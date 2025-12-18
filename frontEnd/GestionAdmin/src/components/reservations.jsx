import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Input, Button, Space, Modal, Form, message, Select } from "antd";
import { PlusOutlined, FilterOutlined, EditOutlined, DeleteOutlined, RollbackOutlined } from "@ant-design/icons";
import useStyle from '../styles/table.jsx';
import Axios from "../services/api"; 
import "../styles/body.css"; 

const { Option } = Select;

const STATUS_OPTIONS = {
    confirmed: { label: "Confirmée", color: '#52c41a' },
    cancelled: { label: "Annulée", color: '#ff4d4f' },
    withdrawal: { label: "Rétiré", color: '#faad14' },
};

const Reservations = () => {
    const { styles } = useStyle();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [postsList, setPostsList] = useState([]);
    const [clientsList, setClientsList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalReservations, setTotalReservations] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingReservation, setEditingReservation] = useState(null);
    const [deletingReservation, setDeletingReservation] = useState(null);
    const [mode, setMode] = useState('idle');
    const [form] = Form.useForm();

    const fetchPosts = useCallback(async () => {
        try {
            const res = await Axios.get("/posts", { params: { post_status: 'available' } });
            const posts = Array.isArray(res.data) ? res.data : (res.data.rows || []);
            setPostsList(posts.map(p => ({ id: p.id, title: p.title })));
        } catch (err) {
            console.error("Erreur posts:", err);
        }
    }, []);

    const fetchClients = useCallback(async () => {
        try {
            const res = await Axios.get("/users", { params: { role: 'user' } });
            const clients = Array.isArray(res.data) ? res.data : (res.data.rows || []);
            setClientsList(clients.map(c => ({ id: c.id, username: c.username })));
        } catch (err) {
            console.error("Erreur clients:", err);
        }
    }, []);

    const fetchReservations = useCallback(async (page = 1, limit = 10, search = "", status = null) => {
        setLoading(true);
        try {
            const params = { page, limit };
            if (search) params.search = search;
            if (status) params.status = status;

            const res = await Axios.get("/reservations", { params });
            const rows = res.data && Array.isArray(res.data.rows) ? res.data.rows : [];
            const total = res.data?.total ?? 0;

            const reservationsData = rows.map(reser => ({
                key: reser.id,
                id: reser.id,
                reservationDate: reser.reservation_date,
                reservationStatus: reser.reservation_status ,
                postID: reser.post_id,
                clientID: reser.client_id,
                username: reser.username ,
                title: reser.title 
            }));

            setReservations(reservationsData);
            setTotalReservations(total);
            setCurrentPage(page);
            setPageSize(limit);
        } catch (err) {
            message.error("Erreur chargement réservations");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReservations(1, pageSize, searchText, statusFilter);
        fetchPosts();
        fetchClients();
    }, [pageSize, searchText, statusFilter]);

    // --- Handlers ---
    const handleAdd = () => {
        setEditingReservation(null);
        setMode('create');
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = reser => {
        setEditingReservation(reser);
        setMode('edit');
        setIsModalVisible(true);
        form.setFieldsValue({
            reservation_status: reser.reservationStatus,
            post_id: reser.postID,
            client_id: reser.clientID,
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingReservation(null);
        setDeletingReservation(null);
        setMode('idle');
        form.resetFields();
    };

    const handleFormSubmit = async values => {
        if (mode === 'delete') return;

        try {
            if (mode === 'edit' && editingReservation) {
                const updatePayload = {
                    reservationStatus: values.reservation_status,
                    postID: values.post_id,
                    providedClientID: values.client_id
                };
                await Axios.patch(`/reservations/${editingReservation.id}`, updatePayload);
                message.success("Réservation mise à jour");
            } else if (mode === 'create') {
                const createPayload = {
                    postID: values.post_id,
                    providedClientID: values.client_id,
                };
                const res = await Axios.post("/reservations", createPayload);
                console.log(res);
                message.success(" Réservation créée");
            }

            handleCancel();
            fetchReservations(mode === 'create' ? 1 : currentPage, pageSize, searchText, statusFilter);
        } catch (err) {
            const serverMessage = err.response?.data?.message || err.response?.data || "Erreur lors de l'opération";
            Modal.error({
                title: 'Opération refusée',
                content: String(serverMessage),
            });
        }
    };

    const handleDeleteSubmit = async () => {
        try {
            await Axios.delete(`/reservations/${deletingReservation.id}`);
            message.success(' Réservation supprimée');
            handleCancel();
            fetchReservations(currentPage, pageSize, searchText, statusFilter);
        } catch (err) {
            message.error('Erreur lors de la suppression');
        }
    };

    const tableColumns = useMemo(() => [
        {
            title: "Date",
            dataIndex: "reservationDate",
            width: 140,
            render: text => text ? new Date(text).toLocaleDateString('fr-FR') : "N/A"
        },
        {
            title: "Statut",
            dataIndex: "reservationStatus",
            width: 120,
            render: status => {
                const statusInfo = STATUS_OPTIONS[status] || { label: 'Inconnu', color: '#8c8c8c' };
                return <span style={{ color: statusInfo.color, fontWeight: 'bold' }}>{statusInfo.label.toUpperCase()}</span>;
            }
        },
        { title: "Annonce", dataIndex: "title" },
        { title: "Client", dataIndex: "username" },
        {
            title: "Actions",
            key: "actions",
            fixed: "right",
            width: 140,
            render: (_, record) => (
                <Space size="small">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small" />
                    <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => { setDeletingReservation(record); setMode('delete'); setIsModalVisible(true); }} size="small" />
                </Space>
            )
        }
    ], [currentPage, pageSize, searchText, statusFilter]);

    return (
        <div className="details-panel">
            <h6 className={styles.pageTitle}>Réservations</h6>
            <hr />
            <Space style={{ marginBottom: 16 }}>
                <Input.Search
                    placeholder="Rechercher..."
                    onSearch={val => { setSearchText(val); fetchReservations(1, pageSize, val, statusFilter); }}
                    style={{ width: 250 }}
                />
                <Select
                    value={statusFilter || 'all'}
                    onChange={val => { const s = val === 'all' ? null : val; setStatusFilter(s); fetchReservations(1, pageSize, searchText, s); }}
                    style={{ width: 180 }}
                >
                    <Option value="all">Tous les Statuts</Option>
                    <Option value="confirmed">Confirmée</Option>
                    <Option value="cancelled">Annulée</Option>
                    <Option value="withdrawal">Rétiré</Option>
                </Select>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Créer Réservation</Button>
            </Space>

            <Table
                className={styles.customTable}
                columns={tableColumns}
                dataSource={reservations}
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize,
                    total: totalReservations,
                    onChange: (page, size) => fetchReservations(page, size, searchText, statusFilter)
                }}
            />

            <Modal
                title={mode === 'delete' ? 'Confirmation' : mode === 'edit' ? "Modifier la Réservation" : "Créer une Réservation"}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel} icon={<RollbackOutlined />}>Annuler</Button>,
                    <Button key="submit" type="primary" danger={mode === 'delete'} onClick={() => mode === 'delete' ? handleDeleteSubmit() : form.submit()}>
                        {mode === 'delete' ? 'Supprimer' : mode === 'edit' ? 'Modifier' : 'Créer'}
                    </Button>
                ]}
            >
                {mode === 'delete' ? (
                    <p>Supprimer la réservation n° <b>{deletingReservation?.id}</b> ?</p>
                ) : (
                    <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                        <Form.Item name="post_id" label="Annonce" rules={[{ required: true, message: "Sélectionnez une annonce" }]}>
                            <Select showSearch placeholder="Sélectionner l'annonce" optionFilterProp="children">
                                {mode === 'edit' && editingReservation && !postsList.find(p => p.id === editingReservation.postID) && (
                                    <Option value={editingReservation.postID}>{editingReservation.title} (Actuel)</Option>
                                )}
                                {postsList.map(p => <Option key={p.id} value={p.id}>{p.title}</Option>)}
                            </Select>
                        </Form.Item>

                        <Form.Item name="client_id" label="Client" rules={[{ required: true, message: "Sélectionnez le client" }]}>
                            <Select showSearch placeholder="Sélectionner le client" optionFilterProp="children">
                                {mode === 'edit' && editingReservation && !clientsList.find(c => c.id === editingReservation.clientID) && (
                                    <Option value={editingReservation.clientID}>{editingReservation.username} </Option>
                                )}
                                {clientsList.map(c => <Option key={c.id} value={c.id}>{c.username}</Option>)}
                            </Select>
                        </Form.Item>

                        {mode === 'edit' && (
                            <Form.Item name="reservation_status" label="Statut" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="confirmed">Confirmée</Option>
                                    <Option value="cancelled">Annulée</Option>
                                    <Option value="withdrawal">Rétiré</Option>
                                </Select>
                            </Form.Item>
                        )}
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default Reservations;