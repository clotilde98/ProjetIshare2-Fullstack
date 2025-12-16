import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, Input, Button, Space, Modal, Form, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, RollbackOutlined } from '@ant-design/icons';
import Axios from '../services/api'; 
import "../styles/body.css";
import useStyle from '../styles/table.jsx';

const Categories = () => {
  const { styles } = useStyle(); 
    const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
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

  
  const fetchCategories = useCallback(async (currentPage = 1, itemsPerPage = pageSize, searchQuery = '') => {
    setLoading(true);
    
    try {
      const requestParams = { page: currentPage, limit: itemsPerPage };
      
      if (searchQuery) {
        requestParams.nameCategory = searchQuery; 
      }

      const response = await Axios.get('/productType', { params: requestParams });
      
      const categoryRows = response.data?.rows ?? [];
      
      setCategories(categoryRows.map(categorie => ({ 
          key: categorie.id_category ,
          id: categorie.id_category , 
          name: categorie.name_category 
      })));
      
      setTotal(response.data?.total ?? categoryRows.length);
      setPage(currentPage);
      setPageSize(itemsPerPage);
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
      message.error('Impossible de charger les catégories');
    } finally {
      setLoading(false);
    }
  }, [pageSize]); 
 
  useEffect(() => {
    fetchCategories(1, pageSize, '');
  }, [fetchCategories]);


  const openAdd = () => {
    setEditing(null);
    setMode('create'); 
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (categorie) => {
    setEditing(categorie);
    setMode('edit'); 
    form.setFieldsValue({ name: categorie.name }); 
    setIsModalOpen(true);
  };

  const handleDelete = (categorie) => {
    setEditing(categorie); 
    setMode('delete'); 
    setIsModalOpen(true); 
  };


  const handleDeleteSubmit = async () => {
 
    try {
      await Axios.delete(`/productType/${editing.id}`); 
      
      message.success(' Catégorie supprimée avec succès');
      handleCancel();       
      const newTotal = total - 1;
      let newPage = page;      
      if (categories.length === 1 && page > 1 && newTotal > 0) {
        newPage = page - 1;
      } else if (newTotal === 0) {
        newPage = 1;
      }
      
      fetchCategories(newPage, pageSize, search); 
      
    } catch (err) {
        console.error('Erreur de suppression:', err);
        
    }
  };



  const submitForm = async (values) => {
    const currentMode = mode; 
    try {
      
      if (currentMode === 'delete') {
          return;
      }
      
      if (currentMode === 'edit' && editing) {
        await Axios.patch(`/productType/${editing.id}`, { nameCategory: values.name });

      } else if (currentMode === 'create') {
        await Axios.post('/productType', { nameCategory: values.name });
      }

      handleCancel();
      
   fetchCategories(currentMode === 'create' ? 1 : page, pageSize, search);

    } catch (err) {
      console.error(err);
      
      if (err.response?.status === 409) {
        form.setFields([
          {
            name: 'name', 
            errors: [' Cette catégorie existe déjà. Veuillez en choisir un autre nom.'],
          },
        ]);
      } else {
        message.error(err.response?.data?.message || ` Erreur lors de l'opération ${currentMode}`);
        handleCancel();
      }
    }
  };


  const columns = useMemo(() => [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 200 },
    { title: 'Nom de la catégorie', dataIndex: 'name', key: 'name' }, 
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
 
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    fetchCategories(1, pageSize, val); 
  };
  


  return (
    <div className="details-panel">
        <h6 className={styles.pageTitle}>Catégories</h6>
       <hr/>
        
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Rechercher par nom"
          value={search}
          onSearch={nom => { 
                setSearch(nom); 
                fetchCategories(1, pageSize, nom); 
            }}
          onChange={handleSearchChange}
          style={{ width: 300 }}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Ajouter</Button>
      </Space>

      <Table
        className={styles.customTable}
        columns={columns}
        dataSource={categories}
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total, 
          onChange: (page, taille) => fetchCategories(page, taille, search)
        }}
        rowKey="id"
      />
      
      <Modal
        title={mode === 'delete' ? 'Confirmation de suppression' : editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        open={isModalOpen}
        onCancel={handleCancel}
        closable={false}
        maskClosable={false}
        footer={
            mode === 'delete' ? [
                <Button key="cancel-del" onClick={handleCancel} icon={<RollbackOutlined />}>Annuler</Button>,
                <Button key="submit-del" type="primary" danger onClick={handleDeleteSubmit}>Supprimer</Button>
            ] : [
                <Button key="cancel" onClick={handleCancel} icon={<RollbackOutlined />}>Annuler</Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()}>{editing ? 'Modifier' : 'Créer'}</Button>
            ]
        }
      >

        {mode === 'delete' ? (
            <div>
                <p>Êtes-vous sûr de vouloir supprimer la catégorie suivante ?</p>
                <p style={{ fontWeight: 'bold', color: '#ff4d4f' }}>{editing?.name || '—'} (ID: {editing?.id || '—'})</p>
            </div>
        ) : (
          <Form 
                form={form} 
                layout="vertical" 
                onFinish={submitForm}
                initialValues={mode === 'edit' ? { name: editing?.name } : {}} 
            >
            <Form.Item 
                name="name" 
                label="Nom de la catégorie" 
                rules={[
                    { required: true, message: 'Le nom est requis' }, 
                    
                ]}
            >
              <Input />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Categories;