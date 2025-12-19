import React, { useState, useEffect, useCallback } from "react";
import { Form, Button, message, Select, Tag, Modal, Space } from "antd";
import { EditOutlined, DeleteOutlined, FilterOutlined } from "@ant-design/icons";
import useStyle from '../styles/table.jsx';
import Axios from "../services/api";
import "../styles/body.css";

// Import des composants partagés
import { useTableLogic } from "../hook/TableLogic";
import { TableHeader, CustomTable } from "./Datable";
import { CrudModal } from "./CrudModal";

const { Option } = Select;

const STATUS_OPTIONS = {
    confirmed: { label: "Confirmée", color: 'green' },
    cancelled: { label: "Annulée", color: 'red' },
    withdrawal: { label: "Retiré", color: 'orange' },
};

const Reservations = () => {
    const { styles } = useStyle();

    // --- States pour les données secondaires ---
    const [clients, setClients] = useState([]);
    const [postsList, setPostsList] = useState([]);

    const [loadingClients, setLoadingClients] = useState(false);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [statusFilter, setStatusFilter] = useState(null);

    // --- States Modals ---
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingReservation, setEditingReservation] = useState(null);
    const [deletingReservation, setDeletingReservation] = useState(null);
    const [mode, setMode] = useState("idle");
    const [form] = Form.useForm();

    // --- Hook Logique Table ---
    const {
        data: rawReservations,
        loading,
        page: currentPage,
        pageSize,
        total: totalReservations,
        search: searchText,
        setSearch: setSearchText,
        fetchData: fetchReservations
    } = useTableLogic("/reservations", "username", 10);

    // --- Mapping des données (SANS useMemo, comme dans Posts.jsx) ---
    const reservations = (Array.isArray(rawReservations) ? rawReservations : []).map(reservation => ({
        key: reservation.id,
        id: reservation.id,
        reservationDate: reservation.reservation_date,
        reservationStatus: reservation.reservation_status,
        postID: reservation.post_id,
        clientID: reservation.client_id,
        username: reservation.username,
        title: reservation.title
    }));

    // --- Fetch Secondary Data (Séquentiel sans Promise.all) ---
    const fetchSecondaryData = useCallback(async () => {
        setLoadingClients(true); 
        setLoadingPosts(true);
        try {
            const usersResponse = await Axios.get("/users", { params: { role: "user" } });
            const postsResponse = await Axios.get("/posts", { params: { post_status: 'available' } });

            setClients((usersResponse.data?.rows || usersResponse.data || []).map(user => ({ 
                id: user.id, 
                name: user.username 
            })));

            setPostsList((postsResponse.data?.rows || postsResponse.data || []).map(post => ({
                id: post.id, 
                title: post.title
            })));

        } catch (error) { 
            console.error(error); 
        } finally { 
            setLoadingClients(false); 
            setLoadingPosts(false); 
        }
    }, []);

    useEffect(() => {
        fetchReservations();
        fetchSecondaryData();
    }, [fetchSecondaryData, fetchReservations]);

    // --- Handlers ---
    const handleTableChange = (page = 1, size = pageSize, search = searchText, status = statusFilter) => {
        fetchReservations(page, size, search, { status: status });
    };

    const handleSearch = (value) => {
        setSearchText(value);
        handleTableChange(1, pageSize, value);
    };

    const handleStatusFilter = (value) => {
        const s = value === "all" ? null : value;
        setStatusFilter(s);
        handleTableChange(1, pageSize, searchText, s);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingReservation(null);
        setDeletingReservation(null);
        setMode("idle");
        form.resetFields();
    };

    const handleEdit = (record) => {
        setEditingReservation(record);
        setMode("edit");
        form.setFieldsValue({
            reservation_status: record.reservationStatus,
            post_id: record.postID,
            client_id: record.clientID,
        });
        setIsModalVisible(true);
    };

    const handleFormSubmit = async (values) => {
        try {
            const payload = {
                reservationStatus: values.reservation_status,
                postID: values.post_id,
                clientID: values.client_id,
                providedClientID: values.client_id 
            };

            if (mode === "edit") await Axios.patch(`/reservations/${editingReservation.id}`, payload);
            else await Axios.post("/reservations", payload);

            message.success("Succès");
            handleCancel();
            handleTableChange();
        } catch (err) {
            const msg = err.response?.data?.message || "Erreur lors de l'opération";
            Modal.error({ title: "Action impossible", content: String(msg) });
        }
    };

    const tableColumns = [
        {
            title: "Date",
            dataIndex: "reservationDate",
            render: date => date ? new Date(date).toLocaleDateString('fr-FR') : "N/A"
        },
        {
            title: "Statut",
            dataIndex: "reservationStatus",
            render: status => {
                const info = STATUS_OPTIONS[status] || { label: 'Inconnu', color: 'default' };
                return <Tag color={info.color}>{info.label.toUpperCase()}</Tag>;
            }
        },
        { title: "Annonce", dataIndex: "title", ellipsis: true },
        { title: "Client", dataIndex: "username" },
        {
            title: "Actions",
            fixed: "right",
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small" type="primary" />
                    <Button icon={<DeleteOutlined />} onClick={() => { setDeletingReservation(record); setMode("delete"); setIsModalVisible(true); }} size="small" danger type="primary" />
                </Space>
            )
        }
    ];

    return (
        <div className="details-panel">
            <h6 className={styles.pageTitle}>Réservations</h6>
            <hr />

            <TableHeader
                placeholder="Rechercher (Client...)"
                search={searchText}
                onSearch={handleSearch}
                onAdd={() => { setMode("create"); setIsModalVisible(true); form.resetFields(); }}
                filter={
                    <Select value={statusFilter || 'all'} onChange={handleStatusFilter} style={{ width: 180 }} suffixIcon={<FilterOutlined />}>
                        <Option value="all">Tous les Statuts</Option>
                        <Option value="confirmed">Confirmée</Option>
                        <Option value="cancelled">Annulée</Option>
                        <Option value="withdrawal">Retiré</Option>
                    </Select>
                }
            />

            <CustomTable
                styles={styles} columns={tableColumns} dataSource={reservations} loading={loading}
                page={currentPage} pageSize={pageSize} total={totalReservations} onChange={handleTableChange}
            />

            <CrudModal
                open={isModalVisible} mode={mode}
                title={mode === "delete" ? "Confirmation" : (mode === "edit" ? "Modifier" : "Créer")}
                onCancel={handleCancel}
                onConfirm={() => mode === "delete" ? 
                    Axios.delete(`/reservations/${deletingReservation.id}`).then(() => { handleCancel(); handleTableChange(); }) : form.submit()}
            >
                {mode === "delete" ? (
                    <p>Supprimer la réservation n° <b>{deletingReservation?.id}</b> ?</p>
                ) : (
                    <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                        <Form.Item name="post_id" label="Annonce" rules={[{ required: true, message: "Champ obligatoire" }]}>
                            <Select showSearch loading={loadingPosts} placeholder="Choisir une annonce">
                                {postsList.map(post => <Option key={post.id} value={post.id}>{post.title}</Option>)}
                            </Select>
                        </Form.Item>

                        <Form.Item name="client_id" label="Client" rules={[{ required: true, message: "Champ obligatoire" }]}>
                            <Select showSearch loading={loadingClients} placeholder="Choisir un client">
                                {clients.map(user => <Option key={user.id} value={user.id}>{user.name}</Option>)}
                            </Select>
                        </Form.Item>

                        {mode === 'edit' && (
                            <Form.Item name="reservation_status" label="Statut" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="confirmed">Confirmée</Option>
                                    <Option value="cancelled">Annulée</Option>
                                    <Option value="withdrawal">Retiré</Option>
                                </Select>
                            </Form.Item>
                        )}
                    </Form>
                )}
            </CrudModal>
        </div>
    );
};

export default Reservations;