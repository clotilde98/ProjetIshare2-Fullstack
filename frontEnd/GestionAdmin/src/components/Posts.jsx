import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Input, Button, Space, Modal, Form, message, Select, InputNumber, Tag } from "antd";
import { PlusOutlined, FilterOutlined, EditOutlined, DeleteOutlined, RollbackOutlined, CalendarOutlined } from "@ant-design/icons";
import useStyle from '../styles/table.jsx';
import Axios from "../services/api"; 
import "../styles/body.css";


const { Option } = Select;

const Posts = () => {
  const { styles } = useStyle();
  const [posts, setPosts] = useState([]);
  const [clients, setClients] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPosts, setTotalPosts] = useState(0);

  const [citySearch, setCitySearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);
  const [mode, setMode] = useState("idle");
  const [form] = Form.useForm();

  const [pendingCategoryNames, setPendingCategoryNames] = useState([]);
  
  // Nouveaux états pour la réservation
  const [isReserveModalVisible, setIsReserveModalVisible] = useState(false);
  const [reservingPost, setReservingPost] = useState(null);
  const [reserveForm] = Form.useForm();


  const fetchPosts = useCallback(async (page = 1, limit = 10, city = "", status = null) => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (city) params.city = city;
      if (status) params.postStatus = status;

      const res = await Axios.get("/posts", { params });
      const rows = res.data && Array.isArray(res.data.rows) ? res.data.rows : [];
      const total = res.data?.total ?? 0;

      const postsData = rows.map((post) => ({
        key: post.id,
        id: post.id,
        title: post.title,
        description: post.description,
        numberOfPlaces: post.number_of_places, 
        placesRestantes: post.places_restantes, 
        postStatus: post.post_status,
        city: post.city,
        street: post.street,
        streetNumber: post.street_number,
        postalCode: post.postal_code,
        addressID: post.address_id,
        username: post.username,
        clientID: post.client_id,
        categories: post.categories,
      }));

      setPosts(postsData);
      setTotalPosts(total);
      setCurrentPage(page);
      setPageSize(limit);
    } catch (err) {
      console.error(err);
      message.error("Erreur lors du chargement des annonces");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClients = useCallback(async () => {
    setLoadingClients(true);
    try {
      const res = await Axios.get("/users", {
        params: {
          role: "user",
        },
      });

      const clientsData = res.data?.rows || res.data || [];

      const formattedClients = clientsData.map((client) => ({
        id: client.id,
        name: client.username ,
      }));

      setClients(formattedClients);
    } catch (err) {
      console.error("Erreur lors du chargement des clients:", err);
    } finally {
      setLoadingClients(false);
    }
  }, []);

  const fetchAllCities = useCallback(async () => {
    setLoadingCities(true);
    try {
      const res = await Axios.get("/getAllCities");
      const citiesData = res.data?.rows || res.data || [];

      const formattedCities = citiesData.map((address) => ({
        id: address.id,
        displayName: `${address.city} (${address.postal_code})`,
        city: address.city,
        postalCode: address.postal_code,
      }));

      setCities(formattedCities);
    } catch (err) {
      console.error("Erreur lors du chargement des adresses:", err);
    } finally {
      setLoadingCities(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const res = await Axios.get("/productType");
      const categoriesData = res.data?.rows || res.data || [];

      const formattedCategories = categoriesData.map((cat) => ({
        id: cat.id_category,
        nameCategory: cat.name_category,
      }));

      setCategories(formattedCategories);
    } catch (err) {
      console.error("Erreur lors du chargement des catégories:", err);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1, pageSize, citySearch, statusFilter);
    fetchClients();
    fetchAllCities();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (pagination) => {
    const newPage = pagination.current;
    const newLimit = pagination.pageSize;
    fetchPosts(newPage, newLimit, citySearch, statusFilter);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setCitySearch(value);
    fetchPosts(1, pageSize, value, statusFilter);
  };

  const handleStatusFilter = (value) => {
    const newStatus = value === "all" ? null : value;
    setStatusFilter(newStatus);
    fetchPosts(1, pageSize, citySearch, newStatus);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingPost(null);
    setDeletingPost(null);
    setMode("idle");
    form.resetFields();
    setPendingCategoryNames([]);
  };

  const handleAdd = () => {
    setEditingPost(null);
    setMode("create");
    form.resetFields();
    form.setFieldsValue({ post_status: "available", selected_category_ids: [] });
    setIsModalVisible(true);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setMode("edit");
    form.resetFields();

    const currentCategoryNames = post.categories ? post.categories.split(",").map((s) => s.trim()).filter(Boolean) : [];

    const commonFields = {
      title: post.title,
      description: post.description,
      number_of_places: post.numberOfPlaces,
      post_status: post.postStatus,
      address_id: post.addressID ,
      street: post.street,
      street_number: post.streetNumber,
    };

    if (categories && categories.length > 0) {
      const currentCategoryIds = categories.filter((cat) => currentCategoryNames.includes(cat.nameCategory)).map((cat) => cat.id);

      form.setFieldsValue({
        ...commonFields,
        selected_category_ids: currentCategoryIds,
      });
      setPendingCategoryNames([]);
    } else {
      form.setFieldsValue({
        ...commonFields,
        selected_category_ids: [],
      });

      setPendingCategoryNames(currentCategoryNames);
    }

    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    setDeletingPost(record);
    setMode("delete");
    setIsModalVisible(true);
  };

  const handleDeleteSubmit = async () => {
    if (mode !== "delete" || !deletingPost || !deletingPost.id) {
      message.error("Impossible de supprimer: ID manquant.");
      return;
    }

    try {
      await Axios.delete(`/posts/${deletingPost.id}`);
      message.success(`Annonce n° ${deletingPost.id} supprimée avec succès`);
      handleCancel();
      fetchPosts(currentPage, pageSize, citySearch, statusFilter);
    } catch (err) {
      console.error("Erreur de suppression:", err);
      message.error(err.response?.data?.message || ` Erreur lors de la suppression.`);
      handleCancel();
    }
  };

  const handleFormSubmit = async (values) => {
    const currentMode = mode;
    if (currentMode === "delete") return;

    const numberOfPlaces = Number(values.number_of_places);
    if (isNaN(numberOfPlaces) || numberOfPlaces < 1) {
      message.error("Le nombre de places est invalide.");
      return;
    }

    
    const resolvedAddressId = Number(values.address_id) || (editingPost?.addressID !== undefined && editingPost?.addressID !== null ? Number(editingPost.addressID) : undefined);

    if (!resolvedAddressId || isNaN(resolvedAddressId)) {
      message.error("ID d'adresse manquant. Veuillez sélectionner une ville/code postal valide.");
      return;
    }

    let clientID;
    if (currentMode === 'create') {
      const resolvedClientRaw = values.client_id;
      clientID = resolvedClientRaw !== undefined && resolvedClientRaw !== null ? Number(resolvedClientRaw) : null;
      if (!clientID) {
        message.error("ID client manquant en mode création.");
        return;
      }
    } else if (currentMode === 'edit') {
      clientID = editingPost?.clientID !== undefined && editingPost?.clientID !== null ? Number(editingPost.clientID) : null;
      if (!clientID) {
        message.error("ID client original introuvable pour la mise à jour.");
        return;
      }
    }

    let selectedAddress = cities.find((c) => c.id === resolvedAddressId);

    if (!selectedAddress && currentMode === "edit" && editingPost && Number(editingPost.addressID) === resolvedAddressId) {
      selectedAddress = {
        id: resolvedAddressId,
        city: editingPost.city,
        postalCode: editingPost.postalCode,
      };
    }

    if (!selectedAddress || !selectedAddress.city || !selectedAddress.postalCode) {
      if (currentMode === 'create') {
        message.error("Adresse sélectionnée invalide. Veuillez re-sélectionner la ville et le code postal.");
        return;
      }
    }

    const selectedCategoryIDs = (values.selected_category_ids || []).map((id) => Number(id));
    console.log("Selected category IDs to send:", selectedCategoryIDs);

    try {
      const payload = {
        title: values.title,
        description: values.description,
        postStatus: values.post_status,
        numberOfPlaces: numberOfPlaces,

        street: values.street,
        streetNumber: Number(values.street_number),
        addressID: resolvedAddressId, 
        photo: "default_photo_url.jpg",

        categoriesProduct: selectedCategoryIDs,

        city: selectedAddress?.city || editingPost?.city,
        postalCode: selectedAddress?.postalCode || editingPost?.postalCode,
        clientID: clientID,
      };


      if (currentMode === "edit" && editingPost) {       
        const res = await Axios.patch(`/posts/${editingPost.id}`, payload);
         console.log("Prepared payload for request:", payload);
        message.success(" Annonce mise à jour");
      } else if (currentMode === "create") {
        const res = await Axios.post("/posts", payload);
        message.success("Annonce créée");
      }

      handleCancel();
      fetchPosts(currentMode === "create" ? 1 : currentPage, pageSize, citySearch, statusFilter);
    } catch (err) {
      console.error("Error during form submit:", err);
      console.error("err.response:", err.response);

      if (err.response && err.response.status === 400 && Array.isArray(err.response.data)) {
        console.error("Erreurs de Validation du Serveur (400):", err.response.data);
        const firstError = err.response.data[0]?.message || "Erreur de validation inconnue.";
        message.error(` Échec de la validation: ${firstError}`);
      } else {
        message.error(err.response?.data?.message || "Erreur opération inconnue.");
      }
    }
  };

  const handleRemoveCategoryTag = (categoryIdToRemove) => {
    const currentIds = form.getFieldValue("selected_category_ids") || [];
    const newIds = currentIds.filter((id) => id !== categoryIdToRemove);
    form.setFieldsValue({ selected_category_ids: newIds });
    form.validateFields(["selected_category_ids"]);
  };

  useEffect(() => {
    if (mode === "edit" && pendingCategoryNames.length > 0 && categories.length > 0) {
      const mappedIds = categories.filter((cat) => pendingCategoryNames.includes(cat.nameCategory)).map((cat) => cat.id);
      form.setFieldsValue({ selected_category_ids: mappedIds });
      setPendingCategoryNames([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, pendingCategoryNames, mode]);
  
  // Fonctions de Réservation
  const handleReserve = (post) => {
    setReservingPost(post);
    reserveForm.resetFields();
    reserveForm.setFieldsValue({ post_id: post.id }); 
    setIsReserveModalVisible(true);
  };

  const handleReserveCancel = () => {
    setIsReserveModalVisible(false);
    setReservingPost(null);
    reserveForm.resetFields();
  };
  
  const handleReserveSubmit = async (values) => {
    
    try {
      const payload = {
        postID: reservingPost.id, 
        clientID: Number(values.client_id), 
        reservation_status: "confirmed"
      };

      console.log("Payload de réservation envoyé:", payload);

      const res = await Axios.post("/reservations", payload); 
      
      message.success(`Réservation pour l'annonce "${reservingPost.title}" créée avec succès.`);
      handleReserveCancel();
      fetchPosts(currentPage, pageSize, citySearch, statusFilter); // Rechargement pour voir la place restante mise à jour
      
    } catch (err) {
      console.error("Erreur lors de la création de la réservation:", err);
      message.error(err.response?.data?.message || "Erreur lors de la création de la réservation.");
    }
  };


  const tableColumns = useMemo(
    () => [
      { title: "Titre", width: 150, dataIndex: "title", key: "title", ellipsis: true },
      { title: "Nombre de places", width: 80, dataIndex: "numberOfPlaces", key: "numberOfPlaces" },
      
      { 
        title: "Restantes", 
        width: 80, 
        dataIndex: "placesRestantes",
        key: "placesRestantes",
        render: (placesRestantes) => {
            const isFull = placesRestantes <= 0;
            const color = isFull ? 'red' : (placesRestantes <= 2 ? 'orange' : 'green');
            return (
                <Tag color={color} style={{ fontWeight: 'bold' }}>
                    {placesRestantes}
                </Tag>
            );
        }
      },

      {
        title: "Ville",
        dataIndex: "city",
        key: "city",
        width: 90,
        render: (text) => <span>{text}</span>,
      },
      {
        title: "Catégories",
        dataIndex: "categories",
        key: "categories",
        width: 150,
        render: (categoriesString) => {
          if (!categoriesString) return "—";
          return categoriesString.split(",").map((cat, index) => (
            <Tag key={index} color="blue" className={styles.categoryTag}>
              {cat.trim()}
            </Tag>
          ));
        },
      },
      {
        title: "Statut",
        dataIndex: "postStatus",
        key: "postStatus",
        width: 100,
        render: (status) => {
          let text = "—";
          let color = "#808080";

          if (status === "available") {
            text = "Disponible";
            color = "#52c41a";
          } else if (status === "unavailable") {
            text = "Indisponible";
            color = "#ff4d4f";
          }

          return (
            <span
              style={{
                color: color,
                fontWeight: "bold",
              }}
            >
              {text}
            </span>
          );
        },
      },
      { title: "Client", width: 90, dataIndex: "username", key: "username" },
      {
        title: "Actions",
        key: "actions",
        fixed: "right",
        width: 250, 
        render: (_, record) => (
          <Space size="small">
            {/* Bouton Réserver */}
            <Button 
                type="default" 
                icon={<CalendarOutlined />} 
                onClick={() => handleReserve(record)} 
                size="small" 
                disabled={record.postStatus !== "available" || record.placesRestantes <= 0} 
            >
                Réserver
            </Button>
            <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small" />
            <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} size="small" />
          </Space>
        ),
      },
    ],
    [styles.categoryTag]
  );

  const currentAddressDisplay = useMemo(() => {
    if (mode === "edit" && editingPost) {
      const city = editingPost.city || "";
      const postalCode = editingPost.postalCode || "";
      if (city || postalCode) {
        const displayName = `${city} (${postalCode})`;
        return <span style={{ fontWeight: "bold", color: "#000" }}>{displayName}</span>;
      }
    }
    return null;
  }, [mode, editingPost]);

  const allAddressOptions = useMemo(() => {
    let options = [...cities];

    if (mode === "edit" && editingPost && editingPost.addressID) {
      const addressId = Number(editingPost.addressID);
      const displayValue = `${editingPost.city || ""} (${editingPost.postalCode || ""})`;

      const isAddressInCities = cities.some((c) => c.id === addressId);

      if (!isAddressInCities) {
        options = [
          {
            id: addressId,
            displayName: displayValue,
            city: editingPost.city,
            postalCode: editingPost.postalCode,
          },
          ...cities,
        ];
      }
    }
    return options;
  }, [cities, mode, editingPost]);

  return (
    <div className="details-panel">
      <h6 className={styles.pageTitle}>Annonces</h6>
       <hr/>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search placeholder="Rechercher par Ville" value={citySearch} onChange={handleSearch} style={{ width: 300 }} />
        <Select value={statusFilter || "all"} onChange={handleStatusFilter} style={{ width: 180 }} placeholder="Filtrer par Statut" suffixIcon={<FilterOutlined />}>
          <Option value="all">Tous les Statuts</Option>
          <Option value="available">Disponible</Option>
          <Option value="unavailable">Indisponible</Option>
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Créer Annonce
        </Button>
      </Space>

      <Table
        tableLayout="fixed"
        className={styles.customTable}
        columns={tableColumns}
        dataSource={posts}
        loading={loading}
        scroll={{ x: 1200, y: 55 * 6 }}
        pagination={{
          current: currentPage,
          pageSize,
          total: totalPosts,
          onChange: (page, size) => handleTableChange({ current: page, pageSize: size }),
        }}
      />

      {/* Modal CRUD (Création, Modification, Suppression) */}
      <Modal
        title={mode === "delete" ? "Confirmation de suppression" : editingPost ? "Modifier l'Annonce" : "Créer une Annonce"}
        open={isModalVisible}
        onCancel={handleCancel}
        closable={false}
        maskClosable={false}
        footer={
          mode === "delete"
            ? [
                <Button key="cancel-del" onClick={handleCancel} icon={<RollbackOutlined />}>
                  Annuler
                </Button>,
                <Button key="submit-del" type="primary" danger onClick={handleDeleteSubmit}>
                  Supprimer
                </Button>,
              ]
            : [
                <Button key="cancel" onClick={handleCancel} icon={<RollbackOutlined />}>
                  Annuler
                </Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()}>
                  {editingPost ? "Sauvegarder" : "Créer"}
                </Button>,
              ]
        }
      >
        {mode === "delete" ? (
          <div>
            <p>
              Êtes-vous sûr de vouloir supprimer l'annonce n° <strong>{deletingPost?.id || "—"}</strong> ?
            </p>
            <p style={{ fontWeight: "bold" }}>
              Titre: {deletingPost?.title || "—"}, Client: {deletingPost?.username || "—"}
            </p>
          </div>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleFormSubmit} initialValues={{ post_status: "available", selected_category_ids: [] }}>
            <Form.Item name="title" label="Titre" rules={[{ required: true, message: "Le titre est requis" }]}>
              <Input maxLength={50} />
            </Form.Item>

            <Form.Item name="description" label="Description" rules={[{ required: true, message: "La description est requise" }]}>
              <Input.TextArea rows={5} maxLength={255} style={{ minHeight: 120 }} />
            </Form.Item>

            <Form.Item
              name="number_of_places"
              label="Nombre de Places (Max)"
              rules={[{ required: true, message: "Le nombre de places est requis", type: "number", min: 1, max: 1000 }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} placeholder="Minimum 1" />
            </Form.Item>

            <Form.Item name="post_status" label="Statut de l'Annonce" rules={[{ required: true, message: "Le statut est requis" }]}>
              <Select placeholder="Sélectionnez le statut">
                <Option value="available">Disponible</Option>
                <Option value="unavailable">Indisponible</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="address_id"
              label={
                <>
                  Ville et Code Postal {mode === "edit" && currentAddressDisplay && <> (Actuelle: {currentAddressDisplay})</>}
                </>
              }
              rules={[
                {
                  required: mode === "create",
                  message: "La ville/code postal est requis",
                },
              ]}
            >
              
              <Select
                showSearch
                placeholder="Rechercher ou sélectionner une ville et son code postal"
                loading={loadingCities}
                optionFilterProp="children"
                optionLabelProp="label"
                filterOption={(input, option) => {
                  const children = option && option.children;
                  const text = typeof children === "string" ? children : (children?.props?.children ?? "");
                  return String(text).toLowerCase().includes(input.toLowerCase());
                }}
              >
                {allAddressOptions.map((address) => {
                  const isCurrent =
                    mode === "edit" && editingPost?.addressID !== undefined && Number(editingPost.addressID) === Number(address.id);

                  const labelNode = isCurrent ? <strong>{address.displayName}</strong> : address.displayName;

                  return (
                    <Option
                      key={address.id}
                      value={address.id}
                      label={labelNode}
                      style={isCurrent ? { fontWeight: "bold" } : {}}
                    >
                      {labelNode}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item name="street" label="Rue" rules={[{ required: true, message: "La rue est requise" }]}>
              <Input maxLength={100} />
            </Form.Item>

            <Form.Item name="street_number" label="Numéro de Rue" rules={[{ required: true, message: "Le numéro de rue est requis", type: "number", min: 1 }]}>
              <InputNumber style={{ width: "100%" }} placeholder="Ex: 12" />
            </Form.Item>

            <Form.Item name="selected_category_ids" label="Catégories de l'Annonce (Sélectionnez pour Ajouter)" rules={[{ required: true, message: "Au moins une catégorie est requise" }]}>
              <Select
                mode="multiple"
                allowClear
                placeholder="Sélectionnez les catégories à ajouter"
                loading={loadingCategories}
                optionFilterProp="children"
                filterOption={(input, option) => String(option.children).toLowerCase().includes(input.toLowerCase())}
              >
                {categories.map((cat) => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.nameCategory}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item noStyle shouldUpdate>
              {() => {
                const selectedIds = form.getFieldValue("selected_category_ids");
                const selectedCategories = (selectedIds || []).map((id) => categories.find((cat) => cat.id === id)).filter(Boolean);
                return (
                  <div style={{ marginBottom: 16, marginTop: -8 }}>
                    {selectedCategories.length > 0 ? (
                      <>
                        <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#888" }}>Catégories Actuelles (Cliquez sur la croix pour supprimer) :</p>
                        <Space size={[0, 8]} wrap>
                          {selectedCategories.map((cat) => (
                            <Tag key={cat.id} closable onClose={() => handleRemoveCategoryTag(cat.id)} color="blue" className={styles.categoryTag}>
                              {cat.nameCategory}
                            </Tag>
                          ))}
                        </Space>
                      </>
                    ) : (
                      <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#888" }}>Aucune catégorie sélectionnée.</p>
                    )}
                  </div>
                );
              }}
            </Form.Item>

            {mode !== "edit" && (
              <Form.Item name="client_id" label="Propriétaire " rules={[{ required: true, message: "Le propriétaire est requis" }]}>
                <Select showSearch placeholder="Rechercher et sélectionner un client" loading={loadingClients} optionFilterProp="children" filterOption={(input, option) => String(option.children).toLowerCase().includes(input.toLowerCase())}>
                  {clients.map((client) => (
                    <Option key={client.id} value={client.id}>
                      {client.name} 
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </Form>
        )}
      </Modal>

      {/* Modal de Réservation (Ajustements Appliqués) */}
      <Modal
        title={`Réserver l'Annonce: ${reservingPost?.title || "..."}`}
        open={isReserveModalVisible}
        onCancel={handleReserveCancel}
        closable={false}
        maskClosable={false}
        footer={[
          <Button key="cancel-res" onClick={handleReserveCancel} icon={<RollbackOutlined />}>
            Annuler
          </Button>,
          <Button key="submit-res" type="primary" danger onClick={() => reserveForm.submit()}>
            Confirmer Réservation
          </Button>,
        ]}
      >
        <Form form={reserveForm} layout="vertical" onFinish={handleReserveSubmit}>
            {/* Champ masqué pour l'ID du Post */}
            <Form.Item name="post_id" hidden>
                <Input /> 
            </Form.Item>
            
            {/* Affichage simple de l'ID du post, le titre est déjà dans le titre du Modal */}
            <p style={{ marginBottom: 16 }}>
                L'ID du Post à réserver est : <strong>{reservingPost?.id || "—"}</strong>. Veuillez sélectionner le client.
            </p>

            <Form.Item name="client_id" label="Sélectionnez le Client à Réserver" rules={[{ required: true, message: "Veuillez sélectionner le client qui réserve" }]}>
                <Select showSearch placeholder="Rechercher et sélectionner un client" loading={loadingClients} optionFilterProp="children" filterOption={(input, option) => String(option.children).toLowerCase().includes(input.toLowerCase())}>
                    {clients.map((client) => (
                        <Option key={client.id} value={client.id}>
                            {/* Affichage du nom d'utilisateur et de l'ID complet */}
                            {client.name} (ID {client.id})
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            
        </Form>
      </Modal>
    </div>
  );
};

export default Posts;