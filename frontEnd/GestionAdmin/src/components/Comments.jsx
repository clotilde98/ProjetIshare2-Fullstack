import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, Input, Button, Space, Modal, Form, message, InputNumber, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, RollbackOutlined } from '@ant-design/icons';
import useStyle from '../styles/table.jsx';
import Axios from '../services/api'; 
import "../styles/body.css";
import dayjs from 'dayjs'; 

const { TextArea } = Input;


const Comments = () => {
  const { styles } = useStyle(); 
  const [comments, setComments] = useState([]);
  
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState(''); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); 
  const [mode, setMode] = useState('idle'); 
  const [form] = Form.useForm();


  const handleCancel = () => {
    setIsModalOpen(false);
    setEditing(null);
    setMode('idle'); 
    form.resetFields();
  };

const fetchComments = useCallback(async (currentPage = 1, itemsPerPage = pageSize, searchQuery = '') => {
    setLoading(true);
    
    try {
      const requestParams = { page: currentPage, limit: itemsPerPage };
      
      if (searchQuery) {
        requestParams.commentDate = searchQuery; 
      }

      const response = await Axios.get('/comments', { params: requestParams });
      
      const { rows: commentRows = [], total = 0 } = response.data;
      
      const mappedComments = commentRows.map(comment => {
        
        return { 
          key: comment.id,
          id: comment.id, 
          content: comment.content,
          idPost: comment.id_post,
          idCostumer: comment.id_costumer,
          postTitle: comment.post_title,
          costumerName: comment.username, 
          date: comment.date,
        }
      });
      
      setComments(mappedComments);
      setTotal(total); 
      setPage(currentPage);
      setPageSize(itemsPerPage);
      
    } catch (err) {
      console.error(' Erreur lors du chargement des commentaires:', err);
      message.error('Impossible de charger les commentaires');
    } finally {
      setLoading(false);
    }
  }, [pageSize]);


  useEffect(() => {
    fetchComments(1, pageSize, search); 
  }, [fetchComments, pageSize, search]);


  const openEdit = (comment) => {
    setEditing(comment);
    setMode('edit'); 
    form.setFieldsValue({ 
      content: comment.content,
    }); 
    setIsModalOpen(true);
  };

  const handleDelete = (comment) => {
    setEditing(comment); 
    setMode('delete'); 
    setIsModalOpen(true); 
  };

  const handleDeleteSubmit = async () => {
      
    
      try {
        await Axios.delete(`/comments/${editing.id}`); 
        
        message.success(' Commentaire supprimé avec succès');
        handleCancel(); 
        fetchComments(page, pageSize, search); 
      } catch (err) {
          console.error('Erreur de suppression:', err);
          const serverMessage = err.response?.data?.message;
        
          message.error(serverMessage || ` Erreur lors de la suppression.`);
          handleCancel();
      }
  };


  const submitForm = async (values) => {
      const currentMode = mode; 
    try {
      
      if (currentMode === 'delete') {
          return;
      }
        
      const payload = {
        content: values.content,
      };
      
      if (currentMode === 'edit' && editing) {
          await Axios.patch(`/comments/${editing.id}`, payload);
          message.success('Commentaire modifié avec succès');
      } 
      
      handleCancel();
      fetchComments(page, pageSize, search);
      
    } catch (err) {
      console.error(err);
      
      message.error(err.response?.data?.message || ` Erreur lors de l'opération ${currentMode}`);
    }
  };


  const columns = useMemo(() => [
    { title: 'Contenu', dataIndex: 'content', key: 'content', ellipsis: true }, 
    { title: 'Annonce', dataIndex: 'postTitle', key: 'postTitle', width: 150 },
    { title: 'Client', dataIndex: 'costumerName', key: 'costumerName', width: 150, responsive: ['md'] },
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
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            shape="square"
            icon={<EditOutlined />} 
            onClick={() => openEdit(record)} 
          />
          <Button 
            type="primary" 
            danger 
            shape="square"
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record)} 
          />
        </Space>
      )
    }
  ], []);

  const handleDateSearch = (date, dateString) => {
    const val = dateString || ''; 
    setSearch(val);
    fetchComments(1, pageSize, val); 
  };
  

  return (
    <div className="details-panel"> 
      <h6 className={styles.pageTitle}>Commentaires</h6>
      <hr/>

      <Space style={{ marginBottom: 16 }}>
        <DatePicker
            placeholder="Rechercher par Date"
            format="YYYY-MM-DD"
            value={search ? dayjs(search, 'YYYY-MM-DD') : null}
            onChange={handleDateSearch}
            allowClear 
        />
      </Space>

      <Table
        className={styles.customTable}
        columns={columns}
        dataSource={comments}
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total, 
          onChange: (p, ps) => fetchComments(p, ps, search)
        }}
        rowKey="id"
      />
        
      <Modal
        title={mode === 'delete' ? 'Confirmation de suppression' : 'Modifier le commentaire'}
        open={isModalOpen}
        onCancel={handleCancel}
        closable={false}
        maskClosable={false}
        width={500}
        footer={
            mode === 'delete' ? [
                <Button key="cancel-del" onClick={handleCancel} icon={<RollbackOutlined />}>Annuler</Button>,
                <Button key="submit-del" type="primary" danger onClick={handleDeleteSubmit}>Supprimer</Button>
            ] : [ 
                <Button key="cancel" onClick={handleCancel} icon={<RollbackOutlined />}>Annuler</Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()}>Modifier</Button>
            ]
        }
      >

        {mode === 'delete' ? (
            <div>
                <p>Êtes-vous sûr de vouloir supprimer le commentaire du client {editing?.costumerName || '—'} concernant l'annonce {editing?.postTitle || '—'} ?</p>
            </div>
        ) : (
          <Form 
               form={form} 
               layout="vertical" 
               onFinish={submitForm}
            >
            <Form.Item name="content" label="Contenu du commentaire" rules={[{ required: true, message: 'Le contenu est requis' }, { max: 255, message: 'Max 255 caractères' }]}>
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Comments;