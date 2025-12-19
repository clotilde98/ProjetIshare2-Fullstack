import React, { useState, useEffect, useCallback } from "react";
import { Form, Button, message, Select, Input, InputNumber, Row, Col, Space, Modal } from "antd";
import { EditOutlined, DeleteOutlined, FilterOutlined } from "@ant-design/icons";
import useStyle from '../styles/table.jsx';
import Axios from "../services/api";
import "../styles/body.css";

// Import des composants partagés
import { useTableLogic } from "../hook/TableLogic";
import { TableHeader, CustomTable } from "./Datable";
import { CrudModal } from "./CrudModal";

const { Option } = Select;

const Users = () => {
    const { styles } = useStyle();

    // --- 1. LOGIQUE DU HOOK ---
    const {
        data: rawUsers,
        loading,
        page: currentPage,
        pageSize,
        total: totalUsers,
        search: searchText,
        setSearch: setSearchText,
        fetchData: fetchUsers
    } = useTableLogic("/users", "username", 10);

    // --- ÉTATS SECONDAIRES ---
    const [addresses, setAddresses] = useState([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [roleFilter, setRoleFilter] = useState(null);

    // --- ÉTATS UI MODALES ---
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [mode, setMode] = useState('idle');
    const [form] = Form.useForm();

    // --- MAPPING DES DONNÉES (Sans useMemo, comme Reservations.jsx) ---
    const users = (Array.isArray(rawUsers) ? rawUsers : []).map(user => ({
        key: user.id,
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.is_admin,
        addressID: user.address_id,
        street: user.street,
        streetNumber: user.street_number,
        city: user.city,
        postalCode: user.postal_code,
        registrationDate: user.registration_date
    }));

    // --- FETCH DATA SECONDAIRE ---
    const fetchSecondaryData = useCallback(async () => {
        setLoadingAddresses(true);
        try {
            const res = await Axios.get("/getAllCities");
            const data = res.data?.rows || res.data || [];
            setAddresses(data.map(city => ({
                id: city.id,
                displayName: `${city.city} (${city.postal_code})`,
            })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingAddresses(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
        fetchSecondaryData();
    }, [fetchUsers, fetchSecondaryData]);

    // --- HANDLERS ---
    const handleTableChange = (page = 1, size = pageSize, search = searchText, role = roleFilter) => {
        fetchUsers(page, size, search, { role: role });
    };

    const handleSearch = (value) => {
        setSearchText(value);
        handleTableChange(1, pageSize, value);
    };

    const handleRoleFilter = (value) => {
        let newFilter = value === "admin" ? "admin" : value === "not-admin" ? "user" : null;
        setRoleFilter(newFilter);
        handleTableChange(1, pageSize, searchText, newFilter);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingUser(null);
        setDeletingUser(null);
        setMode('idle');
        form.resetFields();
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setMode('edit');
        form.setFieldsValue({
            username: user.username,
            email: user.email,
            is_admin: user.isAdmin,
            address_id: user.addressID,
            street: user.street,
            street_number: user.streetNumber,
        });
        setIsModalVisible(true);
    };

    const handleFormSubmit = async (values) => {
        try {
            const payload = {
               username: values.username,
                email: values.email,
                isAdmin: values.is_admin,
                addressID: Number(values.address_id) || editingUser?.addressID,
                street: values.street,
                streetNumber: String(values.street_number),
                password: values.password, 
                photo: null
            };

            if (mode === 'edit') await Axios.patch(`/users/${editingUser.id}`, payload);
            else await Axios.post("/users/admin", payload);
            
            message.success("Succès");
            handleCancel();
            handleTableChange();
        } catch (err) {
            const msg = err.response?.data?.message || "Erreur lors de l'opération";
            Modal.error({ title: "Action impossible", content: String(msg) });
        }
    };

    const tableColumns = [
        { title: "Email", dataIndex: "email", width: 180, fixed: "left" },
        { title: "Utilisateur", dataIndex: "username", width: 150 },
        {
            title: "Adresse",
            width: 250,
            render: (_, r) => {
                const street = (r.street && r.streetNumber) ? `${r.streetNumber} ${r.street}` : '';
                const city = (r.city && r.postalCode) ? `${r.city} (${r.postalCode})` : '';
                return [street, city].filter(Boolean).join(', ') || 'N/A';
            }
        },
        {
            title: "Inscription",
            dataIndex: "registrationDate",
            width: 120,
            render: d => d ? new Date(d).toLocaleDateString('fr-FR') : "N/A"
        },
        {
            title: "Actions",
            fixed: "right",
            width: 100,
            render: (_, record) => (
                <Space size="small">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small" type="primary" />
                    <Button icon={<DeleteOutlined />} onClick={() => { setDeletingUser(record); setMode('delete'); setIsModalVisible(true); }} size="small" danger type="primary" />
                </Space>
            )
        }
    ];

    return (
        <div className="details-panel">
            <h6 className={styles.pageTitle}>Utilisateurs</h6>
            <hr />

            <TableHeader
                placeholder="Rechercher par nom..."
                search={searchText}
                onSearch={handleSearch}
                onAdd={() => { setMode('create'); setIsModalVisible(true); form.resetFields(); form.setFieldsValue({ is_admin: false }); }}
                filter={
                    <Select value={roleFilter === 'admin' ? 'admin' : roleFilter === 'user' ? 'not-admin' : 'all'} onChange={handleRoleFilter} style={{ width: 180 }} suffixIcon={<FilterOutlined />}>
                        <Option value="all">Tous les rôles</Option>
                        <Option value="admin">Administrateurs</Option>
                        <Option value="not-admin">Utilisateurs</Option>
                    </Select>
                }
            />

            <CustomTable
                styles={styles} columns={tableColumns} dataSource={users} loading={loading}
                page={currentPage} pageSize={pageSize} total={totalUsers} onChange={handleTableChange}
            />

            <CrudModal
                open={isModalVisible} mode={mode}
                title={mode === 'delete' ? 'Suppression' : mode === 'edit' ? "Modifier" : "Ajouter"}
                onCancel={handleCancel}
                onConfirm={() => mode === 'delete' ? 
                    Axios.delete(`/users/${deletingUser.id}`).then(() => { handleCancel(); handleTableChange(); }) : form.submit()}
            >
                {mode === 'delete' ? (
                    <p>Supprimer <b>{deletingUser?.username}</b> ?</p>
                ) : (
                    <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                        <Form.Item name="username" label="Nom d'utilisateur" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                            <Input />
                        </Form.Item>

                        {mode === 'create' && (
                            <>
                                <Form.Item name="password" label="Mot de passe" rules={[{ required: true, min: 6 }]}>
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item name="confirm" label="Confirmation" dependencies={['password']} rules={[
                                    { required: true },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) return Promise.resolve();
                                            return Promise.reject(new Error('Mots de passe différents'));
                                        },
                                    }),
                                ]}>
                                    <Input.Password />
                                </Form.Item>
                            </>
                        )}

                        <Form.Item name="is_admin" label="Rôle">
                            <Select>
                                <Option value={true}>Administrateur</Option>
                                <Option value={false}>Utilisateur Standard</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name="address_id" label="Ville" rules={[{ required: true }]}>
                            <Select showSearch loading={loadingAddresses} optionFilterProp="children">
                                {addresses.map(city => <Option key={city.id} value={city.id}>{city.displayName}</Option>)}
                            </Select>
                        </Form.Item>

                        <Row gutter={8}>
                            <Col span={18}><Form.Item name="street" label="Rue" rules={[{ required: true }]}><Input /></Form.Item></Col>
                            <Col span={6}><Form.Item name="street_number" label="N°" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
                        </Row>
                    </Form>
                )}
            </CrudModal>
        </div>
    );
};

export default Users;