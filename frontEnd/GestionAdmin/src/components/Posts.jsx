import React, { useState, useEffect, useCallback } from "react";
import { Input, Button, Space, Modal, Form, message, Select, InputNumber, Tag, Row, Col } from "antd";
import { EditOutlined, DeleteOutlined, CalendarOutlined, FilterOutlined } from "@ant-design/icons";
import useStyle from '../styles/table.jsx';
import Axios from "../services/api"; 
import "../styles/body.css";

import { useTableLogic } from "../hook/TableLogic"; 
import { TableHeader, CustomTable } from "./Datable"; 
import { CrudModal } from "./CrudModal"; 

const { Option } = Select;

const Posts = () => {
  const { styles } = useStyle();

  // --- States pour les données secondaires ---
  const [clients, setClients] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);

  // --- States Modals ---
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);
  const [mode, setMode] = useState("idle");
  const [form] = Form.useForm();
  
  const [pendingCategoryNames, setPendingCategoryNames] = useState([]);
  const [isReserveModalVisible, setIsReserveModalVisible] = useState(false);
  const [reservingPost, setReservingPost] = useState(null);
  const [reserveForm] = Form.useForm();

  // --- Hook Logique Table ---
  const { 
    data: rawPosts, loading, page: currentPage, pageSize, total: totalPosts, 
    search: citySearch, setSearch: setCitySearch, fetchData: fetchPosts 
  } = useTableLogic("/posts", "city", 5);

  // --- Map des Posts ---
  const posts = (Array.isArray(rawPosts) ? rawPosts : []).map((post) => ({
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

  // --- Fetch Secondary Data ---
  const fetchSecondaryData = useCallback(async () => {
    setLoadingClients(true); setLoadingCities(true); setLoadingCategories(true);
    try {
      const usersResponse = await Axios.get("/users", { params: { role: "user" } });
      const citiesResponse = await Axios.get("/getAllCities");
      const categoriesResponse = await Axios.get("/productType");

      setClients((usersResponse.data?.rows || usersResponse.data || []).map(user => ({ 
        id: user.id, 
        name: user.username 
      })));

      setCities((citiesResponse.data?.rows || citiesResponse.data || []).map(address => ({
        id: address.id, 
        displayName: `${address.city} (${address.postal_code})`
      })));

      const formattedCategories = (categoriesResponse.data?.rows || categoriesResponse.data || []).map((category) => ({
        id: category.id_category,
        nameCategory: category.name_category,
      }));
      setCategories(formattedCategories);

    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoadingClients(false); 
      setLoadingCities(false); 
      setLoadingCategories(false); 
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchSecondaryData();
  }, [fetchSecondaryData, fetchPosts]);

  useEffect(() => {
    if (mode === "edit" && pendingCategoryNames.length > 0 && categories.length > 0) {
      const mappedIds = categories
        .filter(category => pendingCategoryNames.includes(category.nameCategory))
        .map(category => category.id);
      form.setFieldsValue({ selected_category_ids: mappedIds });
      setPendingCategoryNames([]);
    }
  }, [categories, pendingCategoryNames, mode, form]);

  // --- Handlers ---
  const handleTableChange = (page, pageSize) => fetchPosts(page, pageSize, citySearch, { postStatus: statusFilter });
  
  const handleSearch = (value) => { 
    setCitySearch(value); 
    fetchPosts(1, pageSize, value, { postStatus: statusFilter }); 
  };
  const handleStatusFilter = (value) => {
    const status = value === "all" ? null : value;
    setStatusFilter(status);
    fetchPosts(1, pageSize, citySearch, { postStatus: status });
  };

  const handleCancel = () => {
    setIsModalVisible(false); setEditingPost(null); setDeletingPost(null);
    setMode("idle"); form.resetFields(); setPendingCategoryNames([]);
  };

  const handleEdit = (post) => {
    setEditingPost(post); setMode("edit"); form.resetFields();
    const names = post.categories ? post.categories.split(",").map(name => name.trim()) : [];
    
    form.setFieldsValue({
      title: post.title, 
      description: post.description, 
      number_of_places: post.numberOfPlaces,
      post_status: post.postStatus, 
      address_id: post.addressID, 
      street: post.street, 
      street_number: post.streetNumber,
    });

    if (categories.length > 0) {
      const ids = categories
        .filter(category => names.includes(category.nameCategory))
        .map(category => category.id);
      form.setFieldsValue({ selected_category_ids: ids });
    } else { setPendingCategoryNames(names); }
    setIsModalVisible(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        postStatus: values.post_status,
        numberOfPlaces: Number(values.number_of_places),
        street: values.street,
        streetNumber: Number(values.street_number),
        addressID: values.address_id,
        categoriesProduct: JSON.stringify((values.selected_category_ids || []).map(id => Number(id))),
        providedClientID: values.client_id
      };

      if (mode === "edit") await Axios.patch(`/posts/${editingPost.id}`, payload);
      else await Axios.post("/posts", payload);

      message.success("Succès");
      handleCancel();
      fetchPosts(mode === "create" ? 1 : currentPage, pageSize, citySearch, { postStatus: statusFilter });
    } catch (error) { 
      message.error("Erreur lors de l'enregistrement"); 
    }
  };

  const handleReserveSubmit = (reservationValues) => {
    
    const payload = { 
      postID: Number(reservingPost.id), 
      providedClientID: Number(reservationValues.client_id) 
    };
    
    Axios.post("/reservations", payload)
    .then((res) => {
      message.success("Réservé avec succès"); 
      setIsReserveModalVisible(false); 
      reserveForm.resetFields();
     handleTableChange(currentPage, pageSize); 
       })
    .catch(() => message.error("Erreur réservation"));
  };

  const tableColumns = [
    { title: "Titre", dataIndex: "title", ellipsis: true },
    { 
      title: "Catégories", dataIndex: "categories",
      render: (categoriesString) => categoriesString ? categoriesString.split(',').map(tag => (
        <Tag color="blue" key={tag.trim()}>{tag.trim()}</Tag>
      )) : null
    },
    { title: "Places", dataIndex: "numberOfPlaces", width: 80 },
    { 
      title: "Restantes", dataIndex: "placesRestantes", width: 90,
      render: (value) => <Tag color={value <= 2 ? 'red' : 'green'}>{value}</Tag>
    },
    { title: "Ville", dataIndex: "city", width: 100 },
    {
      title: "Statut", dataIndex: "postStatus",
      render: (status) => (
        <b style={{color: status === 'available' ? 'green' : 'red'}}>
            {status === 'available' ? 'Disponible' : 'Indisponible'}
        </b>
      )
    },
    {
      title: "Actions", fixed: "right", width: 180,
      render: (_, record) => (
        <Space>
          <Button icon={<CalendarOutlined />} onClick={() => { setReservingPost(record); setIsReserveModalVisible(true); }} size="small" disabled={record.postStatus !== 'available' || record.placesRestantes <= 0} />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small" type="primary" />
          <Button icon={<DeleteOutlined />} onClick={() => { setDeletingPost(record); setMode("delete"); setIsModalVisible(true); }} size="small" danger type="primary" />
        </Space>
      ),
    },
  ];

  return (
    <div className="details-panel">
      <h6 className={styles.pageTitle}>Annonces</h6><hr/>

      <TableHeader 
        placeholder="Rechercher par Ville" search={citySearch} onSearch={handleSearch} 
        onAdd={() => { setMode("create"); setIsModalVisible(true); form.resetFields(); }}
        filter={
          <Select value={statusFilter || "all"} onChange={handleStatusFilter} style={{ width: 160 }} suffixIcon={<FilterOutlined />}>
            <Option value="all">Tous les Statuts</Option>
            <Option value="available">Disponible</Option>
            <Option value="unavailable">Indisponible</Option>
          </Select>
        }
      />

      <CustomTable 
      styles={styles} 
      columns={tableColumns}
       dataSource={posts} 
       loading={loading}
        page={currentPage} 
        pageSize={pageSize}
         total={totalPosts}
          onChange={handleTableChange} />


      <CrudModal 
        open={isModalVisible} mode={mode} title={mode === "delete" ? "Confirmation" : (mode === "edit" ? "Modifier" : "Créer")} 
        onCancel={handleCancel} 
        onConfirm={() => mode === "delete" ? 
          Axios.delete(`/posts/${deletingPost.id}`).then(() => 
            { handleCancel(); 
            fetchPosts(currentPage, pageSize, citySearch, { postStatus: statusFilter }); }) : form.submit()}
      >
        {mode !== "delete" && (
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item name="title" label="Titre" rules={[{ required: true, message: 'Champ obligatoire' }]}><Input /></Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Champ obligatoire' }]}><Input.TextArea /></Form.Item>
            
            <Row gutter={16}>
               <Col span={6}>
                  <Form.Item name="number_of_places" label="Places" rules={[{ required: true, message: 'Requis' }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
               </Col>
               <Col span={18}>
                  <Form.Item name="post_status" label="Statut de l'annonce" rules={[{ required: true, message: 'Requis' }]}>
                    <Select style={{ width: '100%' }}>
                      <Option value="available">Disponible</Option>
                      <Option value="unavailable">Indisponible</Option>
                    </Select>
                  </Form.Item>
               </Col>
            </Row>

            <Form.Item name="address_id" label="Ville" rules={[{ required: true, message: 'Champ obligatoire' }]}>
              <Select showSearch loading={loadingCities}>
                {cities.map(city => <Option key={city.id} value={city.id}>{city.displayName}</Option>)}
              </Select>
            </Form.Item>

            <Row gutter={16}>
               <Col span={18}>
                  <Form.Item name="street" label="Rue" rules={[{ required: true, message: 'Requis' }]}>
                    <Input />
                  </Form.Item>
               </Col>
               <Col span={6}>
                  <Form.Item name="street_number" label="N° Rue" rules={[{ required: true, message: 'Requis' }]}>
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
               </Col>
            </Row>

            <Form.Item name="selected_category_ids" label="Catégories" rules={[{ required: true, message: 'Sélectionnez au moins une catégorie' }]}>
              <Select mode="multiple" loading={loadingCategories} placeholder="Sélectionner les catégories">
                {categories.map(category => (
                  <Option key={category.id} value={category.id}>{category.nameCategory}</Option>
                ))}
              </Select>
            </Form.Item>

            {mode === "create" && (
              <Form.Item name="client_id" label="Propriétaire" rules={[{ required: true, message: 'Sélectionnez un propriétaire' }]}>
                <Select showSearch loading={loadingClients}>
                  {clients.map(client => <Option key={client.id} value={client.id}>{client.name}</Option>)}
                </Select>
              </Form.Item>
            )}
          </Form>
        )}
        {mode === "delete" && <p>Supprimer l'annonce n° <strong>{deletingPost?.id}</strong> ?</p>}
      </CrudModal>

      <Modal title="Réserver" open={isReserveModalVisible} onCancel={() => setIsReserveModalVisible(false)} onOk={() => reserveForm.submit()} destroyOnClose>
        <Form form={reserveForm} layout="vertical" onFinish={handleReserveSubmit}>
          <Form.Item name="client_id" label="Client" rules={[{ required: true, message: 'Sélectionnez un client' }]}>
            <Select showSearch placeholder="Sélectionner un client">
              {clients.map(client => <Option key={client.id} value={client.id}>{client.name}</Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Posts;