import React, { useState, useEffect, useMemo } from 'react';
import { Form, Input, message, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Axios from '../services/api';
import useStyle from '../styles/table.jsx';
import { useTableLogic } from '../hook/TableLogic.jsx';
import { TableHeader, CustomTable } from './Datable.jsx';
import { CrudModal } from './CrudModal';

const { TextArea } = Input;

const Comments = () => {
  const { styles } = useStyle();
  const [form] = Form.useForm();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState('idle'); // 'edit', 'delete'
  const [editing, setEditing] = useState(null);

  // Utilisation du hook avec 'commentDate' comme clé de recherche pour le DatePicker
  const { data, loading, page, pageSize, total, search, setSearch, fetchData } = 
    useTableLogic('/comments', 'commentDate', 10);

  // Mapping des données API pour correspondre aux colonnes
  const commentsData = data.map(comment => ({
  key: comment.id,
  id: comment.id, 
  content: comment.content,
  idPost: comment.id_post,
  idCostumer: comment.id_costumer,
  postTitle: comment.post_title,
  username: comment.username, 
  date: comment.date,
}));

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Actions ---
  const handleOpenEdit = (comment) => {
    setMode('edit');
    setEditing(comment);
    form.setFieldsValue({ content: comment.content });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (comment) => {
    setMode('delete');
    setEditing(comment);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    try {
      if (mode === 'delete') {
        await Axios.delete(`/comments/${editing.id}`);
        message.success('Commentaire supprimé');
      } else if (mode === 'edit') {
        const values = await form.validateFields();
        await Axios.patch(`/comments/${editing.id}`, { content: values.content });
        message.success('Commentaire modifié');
      }
      setIsModalOpen(false);
      fetchData(page, pageSize, search);
    } catch (err) {
      message.error(err.response?.data?.message || "Erreur lors de l'opération");
    }
  };

  const columns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id', 
      width: 80 
    },
    { 
      title: 'Contenu', 
      dataIndex: 'content', 
      key: 'content', 
      ellipsis: true 
    },
    { title: 'Annonce', 
     dataIndex: 'postTitle', 
     key: 'postTitle', 
     width: 150 
    },

    { title: 'Client', 
    dataIndex: 'username', 
    key: 'username', width: 150, responsive: ['md']
 },
    { 
      title: 'Date', 
      dataIndex: 'date', 
      key: 'date',
      width: 120,
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD') : '—' 
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render: (_, comment) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleOpenEdit(comment)} 
          />
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleOpenDelete(comment)} 
          />
        </Space>
      )
    }
  ];

  return (
    <div className="details-panel">
      <h6 className={styles.pageTitle}>Commentaires</h6><hr/>
      
      {/* Utilisation du type="date" pour le DatePicker de recherche */}
      <TableHeader 
        type="date"
        search={search} 
        onSearch={(val) => { setSearch(val); fetchData(1, pageSize, val); }} 
        placeholder="Rechercher par Date" 
      />

      <CustomTable 
        styles={styles} 
        columns={columns} 
        dataSource={commentsData} 
        loading={loading} 
        page={page} 
        pageSize={pageSize} 
        total={total} 
        onChange={fetchData} 
      />

      <CrudModal 
        open={isModalOpen} 
        mode={mode} 
        title={mode === 'delete' ? 'Confirmation de suppression' : 'Modifier le commentaire'}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
      >
        {mode === 'delete' ? (
          <p>Supprimer le commentaire de <b>{editing?.costumerName}</b> sur l'annonce <b>{editing?.postTitle}</b> ?</p>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item 
              name="content" 
              label="Contenu du commentaire" 
              rules={[{ required: true, message: 'Requis' }, { max: 255, message: 'Max 255 caractères' }]}
            >
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        )}
      </CrudModal>
    </div>
  );
};

export default Comments;