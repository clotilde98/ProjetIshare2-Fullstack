import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Input, Button, Space, Modal, Form, message, Select } from "antd";
import { PlusOutlined, FilterOutlined, EditOutlined, DeleteOutlined, RollbackOutlined } from "@ant-design/icons";
import { createStyles } from "antd-style";
import Axios from "../services/api"; // Assurez-vous que le chemin d'Axios est correct
import "../styles/body.css"; // Assurez-vous que le chemin des styles est correct

const { Option } = Select;

// Définition des statuts et de leurs styles correspondants
const STATUS_OPTIONS = {
    confirmed: { label: "Confirmée", color: '#52c41a' },
    cancelled: { label: "Annulée", color: '#ff4d4f' },
    withdrawal: { label: "Rétiré", color: '#faad14' },
};

// Styles Ant Design (inchangés)
const useStyle = createStyles(({ css, token }) => {
    const { antCls } = token;
    return {
        customTable: css`
            ${antCls}-table {
                ${antCls}-table-container {
                    ${antCls}-table-body,
                    ${antCls}-table-content {
                        scrollbar-width: thin;
                        scrollbar-color: #eaeaea transparent;
                        scrollbar-gutter: stable;
                    }
                }
            }
        `,
        pageTitle: css``,
    };
});


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


    // --- Fonctions de récupération des données de base ---

    const fetchPosts = useCallback(async () => {
        try {
            const res = await Axios.get("/posts", { params: { post_status: 'available' } });
            const posts = Array.isArray(res.data) ? res.data : (res.data.rows || []);
            setPostsList(posts.map(p => ({ id: p.id, title: p.title })));
        } catch (err) {
            console.error("Erreur lors du chargement des posts:", err);
        }
    }, []);

    const fetchClients = useCallback(async () => {
        try {
            const res = await Axios.get("/users", { params: { role: 'user' } });
            const clients = Array.isArray(res.data) ? res.data : (res.data.rows || []);
            setClientsList(clients.map(c => ({ id: c.id, username: c.username })));
        } catch (err) {
            console.error("Erreur lors du chargement des clients:", err);
        }
    }, []);

    // --- Fonction de récupération des réservations ---
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
                reservation_date: reser.reservation_date,
                reservation_status: reser.reservation_status ? String(reser.reservation_status).toLowerCase() : 'unknown',
                postID: reser.post_id,
                clientID: reser.client_id,
                username: reser.username || `Client ID: ${reser.client_id}`,
                title: reser.title || `Post ID: ${reser.post_id}`
            }));

            setReservations(reservationsData);
            setTotalReservations(total);
            setCurrentPage(page);
            setPageSize(limit);
        } catch (err) {
            console.error(err);
            message.error("Erreur lors du chargement des réservations");
        } finally {
            setLoading(false);
        }
    }, []);

    // --- useEffect pour les chargements initiaux ---
    useEffect(() => {
        fetchReservations(1, pageSize, searchText, statusFilter);
        fetchPosts();
        fetchClients();
    }, [fetchReservations, fetchPosts, fetchClients, pageSize, searchText, statusFilter]);


    const handleTableChange = pagination => {
        const newPage = pagination.current;
        const newLimit = pagination.pageSize;
        fetchReservations(newPage, newLimit, searchText, statusFilter);
    };

    const handleSearch = e => {
        const value = e.target.value;
        setSearchText(value);
        fetchReservations(1, pageSize, value, statusFilter);
    };

    const handleStatusFilter = value => {
        const newStatus = value === 'all' ? null : value;
        setStatusFilter(newStatus);
        fetchReservations(1, pageSize, searchText, newStatus);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingReservation(null);
        setDeletingReservation(null);
        setMode('idle');
        form.resetFields();
    };


    const handleAdd = () => {
        setEditingReservation(null);
        setMode('create');
        form.resetFields();
        if (postsList.length === 0) fetchPosts();
        if (clientsList.length === 0) fetchClients();
        setIsModalVisible(true);
    };

    const handleEdit = record => {
        setEditingReservation(record);
        setMode('edit');
        setIsModalVisible(true);

        if (postsList.length === 0) fetchPosts();
        if (clientsList.length === 0) fetchClients();

        form.setFieldsValue({
            reservation_status: record.reservation_status,
            post_id: record.postID,
            client_id: record.clientID,
        });
    };

    const handleDelete = record => {
        setDeletingReservation(record);
        setMode('delete');
        setIsModalVisible(true);
    };
    
    // --- GESTION DE LA SUPPRESSION AVEC MODAL.ERROR ---
    const handleDeleteSubmit = async () => {
        if (mode !== 'delete' || !deletingReservation || !deletingReservation.id) {
            message.error('Impossible de supprimer: ID manquant.');
            return;
        }

        try {
            await Axios.delete(`/reservations/${deletingReservation.id}`);
            message.success('✅ Réservation supprimée avec succès');
            handleCancel();
            fetchReservations(currentPage, pageSize, searchText, statusFilter);
        } catch (err) {
            console.error('Erreur de suppression:', err);
            
            // Capture du message d'erreur du backend
            const serverMessage = err.response?.data || `Erreur inconnue de suppression.`;
            const httpStatus = err.response?.status || '500';

            Modal.error({
                title: `Erreur ${httpStatus}: Suppression refusée`,
                content: (
                    <div>
                        <p>Impossible de finaliser la suppression de la réservation n° **{deletingReservation.id}**.</p>
                        <p style={{ fontWeight: 'bold', color: '#ff4d4f' }}>
                            Détail de l'erreur: {serverMessage}
                        </p>
                    </div>
                ),
                okText: 'Fermer',
            });
        }
    };


    // --- GESTION DE LA CRÉATION/ÉDITION AVEC MODAL.ERROR ---
    const handleFormSubmit = async values => {
        const currentMode = mode;
        if (currentMode === 'delete') return;

        try {
            const payload = {
                postID: values.post_id,
                clientID: values.client_id, 
                reservation_status: 'confirmed', 
            };

            if (currentMode === 'edit' && editingReservation) {
                payload.reservation_status = values.reservation_status;
                await Axios.patch(`/reservations/${editingReservation.id}`, payload);
                message.success("✅ Réservation mise à jour");
                
            } else if (currentMode === 'create') {
                
                await Axios.post("/reservations", payload);
                message.success("✅ Réservation créée");
            }

            handleCancel();
            fetchReservations(currentMode === 'create' ? 1 : currentPage, pageSize, searchText, statusFilter);

        } catch (err) {
            console.error("❌ ERREUR LORS DE L'OPÉRATION (Create/Edit):", err);

            if (err.response) {
                console.error("STATUT HTTP REÇU:", err.response.status);
                console.error("DÉTAIL DE L'ERREUR SERVEUR (response.data):", err.response.data);
            }
            
            // Capture le message exact envoyé par le backend (ex: "Post doesn't exist")
            const serverMessage = err.response?.data || "Erreur inconnue. Aucune réponse détaillée du serveur.";
            const httpStatus = err.response?.status || '500';

            Modal.error({
                title: `Erreur ${httpStatus}: Opération refusée`,
                content: (
                    <div>
                        <p>L'opération n'a pas pu être finalisée car :</p>
                        <p style={{ fontWeight: 'bold', color: '#ff4d4f', fontSize: '1.1em' }}>
                            {serverMessage}
                        </p>
                    </div>
                ),
                okText: 'J\'ai compris',
            });
        }
    };

    const tableColumns = useMemo(() => [
        {
            title: "Date",
            dataIndex: "reservation_date",
            key: "reservation_date",
            width: 140,
            render: text => {
                if (!text) return "N/A";
                try {
                    return new Date(text).toLocaleDateString('fr-FR');
                }
                catch { return "Date invalide"; }
            }
        },
        {
            title: "Statut",
            dataIndex: "reservation_status",
            key: "reservation_status",
            width: 120,
            render: status => {
                const statusInfo = STATUS_OPTIONS[status] || { label: 'Inconnu', color: '#8c8c8c' };
                return (
                    <span style={{
                        color: statusInfo.color,
                        fontWeight: 'bold'
                    }}>
                        {statusInfo.label.toUpperCase()}
                    </span>
                );
            }
        },
        { title: "Annonce", width: 100, dataIndex: "title", key: "title" },
        { title: "Client", width: 100, dataIndex: "username", key: "username" },
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
    ], [handleEdit, handleDelete]);


    return (
        <div className="details-panel">
            <h6 className={styles.pageTitle}>Réservations</h6>
            <hr />
            <Space style={{ marginBottom: 16 }}>
                <Input.Search
                    placeholder="Rechercher par statut reservation"
                    value={searchText}
                    onChange={handleSearch}
                    style={{ width: 300 }}
                />
                <Select
                    value={statusFilter || 'all'}
                    onChange={handleStatusFilter}
                    style={{ width: 180 }}
                    placeholder="Filtrer par Statut"
                    suffixIcon={<FilterOutlined />}
                >
                    <Option value="all">Tous les Statuts</Option>
                    <Option value="confirmed">Confirmée</Option>
                    <Option value="cancelled">Annulée</Option>
                    <Option value="withdrawal">Rétiré</Option>
                </Select>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Créer Réservation</Button>
            </Space>

            <Table
                tableLayout="fixed"
                className={styles.customTable}
                columns={tableColumns}
                dataSource={reservations}
                loading={loading}
                scroll={{ x: 800, y: 55 * 6 }}
                pagination={{
                    current: currentPage,
                    pageSize,
                    total: totalReservations,
                    onChange: (page, size) => handleTableChange({ current: page, pageSize: size })
                }}
            />

            <Modal
                title={mode === 'delete' ? 'Confirmation de suppression' : editingReservation ? "Modifier la Réservation" : "Créer une Réservation"}
                open={isModalVisible}
                onCancel={handleCancel}
                closable={false}
                maskClosable={false}
                footer={
                    mode === 'delete' ? [
                        <Button key="cancel-del" onClick={handleCancel} icon={<RollbackOutlined />}>Annuler</Button>,
                        <Button key="submit-del" type="primary" danger onClick={handleDeleteSubmit}>Supprimer</Button>
                    ] : [
                        <Button key="cancel" onClick={handleCancel} icon={<RollbackOutlined />}>Annuler</Button>,
                        <Button key="submit" type="primary" onClick={() => form.submit()}>{editingReservation ? 'Sauvegarder' : 'Créer'}</Button>
                    ]
                }
            >
                {mode === 'delete' ? (
                    <div>
                        <p style={{ fontWeight: 'bold' }}>Êtes-vous sûr de vouloir supprimer la réservation n° {deletingReservation?.id || '—'} ?</p>
                    </div>
                ) : (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFormSubmit}
                    >

                        {/* --- Sélection d'Annonce --- */}
                        <Form.Item name="post_id" label="Sélectionner l'Annonce" rules={[{ required: true, message: "Veuillez sélectionner l'annonce" }]}>
                            <Select
                                showSearch
                                placeholder="Rechercher et sélectionner une annonce disponible"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {mode === 'edit' && editingReservation && !postsList.some(p => p.id === editingReservation.postID) && (
                                    <Option
                                        key={`post-${editingReservation.postID}`}
                                        value={editingReservation.postID}
                                    >
                                        {editingReservation.title} (Actuel)
                                    </Option>
                                )}
                                {postsList.map(post => (
                                    <Option key={post.id} value={post.id}>
                                        {post.title}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* --- Sélection de Client --- */}
                        <Form.Item name="client_id" label="Sélectionner le Client (Simple User)" rules={[{ required: true, message: "Veuillez sélectionner le client" }]}>
                            <Select
                                showSearch
                                placeholder="Rechercher et sélectionner le client"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {mode === 'edit' && editingReservation && !clientsList.some(c => c.id === editingReservation.clientID) && (
                                    <Option
                                        key={`client-${editingReservation.clientID}`}
                                        value={editingReservation.clientID}
                                    >
                                        {editingReservation.username} (Actuel)
                                    </Option>
                                )}
                                {clientsList.map(client => (
                                    <Option key={client.id} value={client.id}>
                                        {client.username}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* --- Statut de la Réservation : Affiche UNIQUEMENT en mode 'edit' --- */}
                        {mode === 'edit' && (
                            <Form.Item name="reservation_status" label="Statut de la Réservation" rules={[{ required: true, message: "Veuillez sélectionner un statut" }]}>
                                <Select placeholder="Sélectionnez le statut">
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