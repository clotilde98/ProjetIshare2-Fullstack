import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Input, Button, Space, Modal, Form, message, Select, InputNumber, Row, Col } from "antd";
import { PlusOutlined, FilterOutlined, EditOutlined, DeleteOutlined, RollbackOutlined } from "@ant-design/icons";
import useStyle from '../styles/table.jsx';
import Axios from "../services/api";
import "../styles/body.css";

const { Option } = Select;

const Users = () => {
  const { styles } = useStyle();
  const [users, setUsers] = useState([]);
  const [addresses, setAddresses] = useState([]); 
  
  const [loading, setLoading] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [mode, setMode] = useState('idle');
  const [form] = Form.useForm();
    
  const fetchAddresses = useCallback(async () => {
    setLoadingAddresses(true);
    try {
      const res = await Axios.get("/getAllCities"); 
      const addressesData = res.data?.rows || res.data || [];
      const formattedAddresses = addressesData.map(addr => ({
        id: addr.id,
        city: addr.city,
        postalCode: addr.postal_code, // CamelCase à gauche
        displayName: `${addr.city} (${addr.postal_code})`,
      }));
      setAddresses(formattedAddresses);
    } catch (err) {
      console.error("Erreur lors du chargement des adresses:", err);
      message.error("Impossible de charger la liste des villes.");
    } finally {
      setLoadingAddresses(false);
    }
  }, []);

  const fetchUsers = useCallback(async (page = 1, limit = 10, name = "", role = null) => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (name) params.name = name;
      if (role) params.role = role;
      
      const res = await Axios.get("/users", { params });
      const rows = res.data && Array.isArray(res.data.rows) ? res.data.rows : [];
      const total = res.data?.total ?? 0;

      const usersData = rows.map(user => ({
        key: user.id,
        id: user.id,
        email: user.email,
        username: user.username,
        registrationDate: user.registration_date, 
        isAdmin: user.is_admin,                   
        addressID: user.address_id,               
        street: user.street,
        streetNumber: user.street_number,         
        city: user.city, 
        postalCode: user.postal_code,             
      }));

      setUsers(usersData);
      setTotalUsers(total);
      setCurrentPage(page);
      setPageSize(limit);
    } catch (err) {
      console.error(err);
      message.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(1, pageSize, searchText, roleFilter);
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchUsers, fetchAddresses]);

  // --- Fonctions de Modal ---
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
    setDeletingUser(null);
    setMode('idle');
    form.resetFields();
  };
    
  const handleAdd = () => {
    setEditingUser(null);
    setMode('create');
    form.resetFields();
    setIsModalVisible(true);
    form.setFieldsValue({ is_admin: false }); 
  };

  const handleEdit = user => {
    setEditingUser(user);
    setMode('edit');
    setIsModalVisible(true);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      is_admin: user.isAdmin,      
      address_id: user.addressID,  
      street: user.street,
      street_number: user.streetNumber, 
    });
  };

  const handleDelete = user => {
    setDeletingUser(user);
    setMode('delete'); 
    setIsModalVisible(true); 
  };

  const handleDeleteSubmit = async () => {
      try {
        await Axios.delete(`/users/${deletingUser.id}`); 
        
        message.success(' Utilisateur supprimé avec succès');
        handleCancel(); 
        fetchUsers(currentPage, pageSize, searchText, roleFilter); 
      } catch (err) {
          console.error('Erreur de suppression:', err);
          message.error(err.response?.data?.message || ` Erreur lors de la suppression.`);
          
      }
  };

  const handleFormSubmit = async (values) => {
  if (mode === 'delete') return;

  const resolvedAddressId = Number(values.address_id) || 
    (editingUser?.addressID ? Number(editingUser.addressID) : undefined);

  try {
    const payload = {
      username: values.username,
      email: values.email,
      password: values.password,
      street: values.street,
      streetNumber: String(values.street_number), 
      isAdmin: values.is_admin,
      addressID: resolvedAddressId,
      photo: null,
    };

    if (mode === 'create') {   
      await Axios.post("/users/admin", payload);   
    } else if (mode === 'edit' && editingUser) {  
      await Axios.patch(`/users/${editingUser.id}`, payload);
      message.success("Utilisateur mis à jour !");
    }

    handleCancel();
    fetchUsers(mode === 'create' ? 1 : currentPage, pageSize, searchText, roleFilter);

  } catch (err) {
    const serverMessage = err.response?.data?.message || err.response?.data || "Erreur opération";
    let errorHandled = false;

    if (err.response?.status === 409) {
      const errorMsg = String(err.response.data).toLowerCase() || "";
      if (errorMsg.includes('email')) {
        form.setFields([{ name: 'email', errors: ['Cet email est déjà utilisé.'] }]);
        errorHandled = true;
      }
      if (errorMsg.includes('username') || errorMsg.includes("nom d'utilisateur")) {
        form.setFields([{ name: 'username', errors: ['Ce nom d\'utilisateur est déjà pris.'] }]);
        errorHandled = true;
      }
    }

    if (!errorHandled) {
      message.error(serverMessage);
    }
  }
};

  const handleTableChange = pagination => {
    const newPage = pagination.current;
    const newLimit = pagination.pageSize;
    fetchUsers(newPage, newLimit, searchText, roleFilter);
  };

  const handleSearch = e => {
    const value = e.target.value;
    setSearchText(value);
    fetchUsers(1, pageSize, value, roleFilter);
  };

  const handleRoleFilter = value => {
    let newFilter = null;
    if (value === "admin") newFilter = "admin";
    else if (value === "not-admin") newFilter = "user";
    setRoleFilter(newFilter);
    fetchUsers(1, pageSize, searchText, newFilter);
  };

  const tableColumns = useMemo(() => [
    { title: "Email", width: 180, dataIndex: "email", key: "email", fixed: "left" },
    { title: "Nom d'utilisateur", width: 200, dataIndex: "username", key: "username", fixed: "left" },
    { 
          title: "Adresse Complète", 
          dataIndex: "city", 
          key: "address", 
          width: 200,
          render: (city, record) => {
            const streetInfo = (record.street && record.streetNumber) ? `${record.streetNumber} ${record.street}` : '';
            const cityInfo = (city && record.postalCode) ? `${city} (${record.postalCode})` : '';
            
            if (streetInfo && cityInfo) return `${streetInfo}, ${cityInfo}`;
            if (streetInfo) return streetInfo;
            if (cityInfo) return cityInfo;
            return 'N/A';
          }
    }, 
    {
      title: "Date Inscription",
      dataIndex: "registrationDate", 
      key: "registrationDate",
      width: 140,
      render: text => {
        if (!text) return "N/A";
        try { return new Date(text).toLocaleDateString('fr-FR'); }
        catch { return "Date invalide"; }
      }
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 140,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small" />
          <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} size="small" />
        </Space>
      )
    }
  ], []);

  return (
    <div className="details-panel">
      <h6 className={styles.pageTitle}>Utilisateurs</h6>
      <hr/>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search placeholder="Rechercher par nom" value={searchText} onChange={handleSearch} style={{ width: 250 }} />
        <Select
          value={roleFilter === 'admin' ? 'admin' : roleFilter === 'user' ? 'not-admin' : 'all'}
          onChange={handleRoleFilter}
          style={{ width: 180 }}
          placeholder="Filtrer par Admin"
          suffixIcon={<FilterOutlined />}
        >
          <Option value="all">Tous les utilisateurs</Option>
          <Option value="admin">Administrateurs</Option>
          <Option value="not-admin">Non-Administrateurs</Option>
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Ajouter un Utilisateur</Button>
      </Space>

      <Table
        tableLayout="fixed"
        className={styles.customTable}
        columns={tableColumns}
        dataSource={users}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total: totalUsers,
          onChange: (page, size) => handleTableChange({ current: page, pageSize: size })
        }}
      />

      <Modal
        title={mode === 'delete' ? 'Confirmation de suppression' : editingUser ? "Modifier l'Utilisateur" : "Ajouter un Utilisateur"}
        open={isModalVisible}
        onCancel={handleCancel}
        closable={false}
        maskClosable={false}
        width={600}
        footer={
            mode === 'delete' ? [
                <Button key="cancel-del" onClick={handleCancel} icon={<RollbackOutlined />}>Annuler</Button>,
                <Button key="submit-del" type="primary" danger onClick={handleDeleteSubmit}>Supprimer</Button>
            ] : [
                <Button key="cancel" onClick={handleCancel} icon={<RollbackOutlined />}>Annuler</Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()}>{editingUser ? 'Modifier' : 'Créer'}</Button>
            ]
        }
      >
        {mode === 'delete' ? (
            <div>
                <p>Êtes-vous sûr de vouloir supprimer l'utilisateur suivant ?</p>
                <p style={{ fontWeight: 'bold', color: '#ff4d4f' }}>{deletingUser?.username || '—'} ({deletingUser?.email || '—'})</p>
            </div>
        ) : (
          <Form 
                form={form} 
                layout="vertical" 
                onFinish={handleFormSubmit}
                initialValues={{ is_admin: editingUser?.isAdmin ?? false }}
            >
            <Form.Item 
                name="username" 
                label="Nom d'utilisateur" 
                rules={[
                    { required: true, message: "Le nom d'utilisateur est requis" },
                ]}
            >
              <Input />
            </Form.Item>

            <Form.Item 
                name="email" 
                label="Email" 
                rules={[
                    { required: true, type: 'email', message: "Email requis et valide" }
                ]}
            >
              <Input />
            </Form.Item>

            {!editingUser && (
              <Form.Item 
                name="password" 
                label="Mot de passe" 
                rules={[
                    { required: true, message: "Le mot de passe est requis à la création" },
                    { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères.' }
                ]}
              >
                <Input.Password placeholder="Obligatoire à la création" />
              </Form.Item>
            )}

            {!editingUser && (
                <Form.Item
                    name="confirm"
                    label="Confirmer Mot de passe"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: 'Veuillez confirmer votre mot de passe !' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Les deux mots de passe ne correspondent pas !'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
            )}
            
            <Form.Item name="is_admin" label="Rôle Administrateur">
                <Select placeholder="Sélectionnez le rôle">
                    <Option value={true}>Administrateur</Option>
                    <Option value={false}>Utilisateur Standard</Option>
                </Select>
            </Form.Item>

            <hr style={{ margin: '20px 0' }}/>
            
            <Form.Item 
                name="address_id" 
                label="Ville et Code Postal" 
                rules={[{ required: true, message: "La ville et le code postal sont requis" }]}
            >
                <Select
                    showSearch
                    placeholder="Rechercher ou sélectionner une ville (ID Adresse)"
                    loading={loadingAddresses}
                    optionFilterProp="children"
                    filterOption={(input, option) => 
                        String(option.children).toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {addresses.map(addr => (
                        <Option key={addr.id} value={addr.id}>
                            {addr.displayName}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Row gutter={16}>
                <Col span={16}>
                    <Form.Item name="street" label="Rue" rules={[{ required: true, message: "La rue est requise" }]}>
                        <Input maxLength={100} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="street_number" label="Numéro" rules={[{ required: true, message: "Le numéro de rue est requis", type: 'number', min: 1 }]}>
                        <InputNumber style={{ width: "100%" }} placeholder="Ex: 12" min={1} />
                    </Form.Item>
                </Col>
            </Row>

          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Users;