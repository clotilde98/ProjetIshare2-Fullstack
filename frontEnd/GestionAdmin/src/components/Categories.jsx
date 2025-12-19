import React, { useState, useEffect } from 'react';
import { Form, Input, message, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Axios from '../services/api';
import useStyle from '../styles/table.jsx';
import { useTableLogic } from '../hook/TableLogic.jsx';
import { TableHeader, CustomTable } from './Datable.jsx'; 
import { CrudModal } from './CrudModal';

const Categories = () => {
  const { styles } = useStyle();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState('idle'); 
  const [editing, setEditing] = useState(null);

  const { data, loading, page, pageSize, total, search, setSearch, fetchData } = 
    useTableLogic('/productType', 'nameCategory', 5);

  // Transformation des données pour correspondre aux colonnes
  const categories = data.map(categorie => ({ 
    id: categorie.id_category, // On garde bien l'ID ici
    name: categorie.name_category,
    key: categorie.id_category 
  }));

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  const handleOpenAdd = () => { 
    setMode('create'); 
    setEditing(null); 
    form.resetFields(); 
    setIsModalOpen(true); 
  };

  const handleOpenEdit = (categorie) => { 
    setMode('edit'); 
    setEditing(categorie); // Contient 'id' et 'name'
    form.setFieldsValue({ name: categorie.name });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (categorie) => {
    setMode('delete');
    setEditing(categorie);
    setIsModalOpen(true); 
  };

  const handleConfirm = async () => {
    try {
      if (mode === 'delete') {
        if (!editing?.id) return; 
        await Axios.delete(`/productType/${editing.id}`);
        message.success('Catégorie supprimée');
      } else {
        const values = await form.validateFields();
        
        if (mode === 'edit') {
         
          if (!editing?.id) {
            message.error("Erreur : ID de catégorie introuvable");
            return;
          }
          await Axios.patch(`/productType/${editing.id}`, { 
            nameCategory: values.name 
          });
          message.success('Catégorie modifiée');
        } else {
          await Axios.post('/productType', { nameCategory: values.name });
          message.success('Catégorie créée');
        }
      }
      
      setIsModalOpen(false);
      // Rafraîchir les données
      fetchData(page, pageSize, search); 
    } catch (err) {
      console.error("Erreur complète:", err);
      if (err.response?.status === 409) {
        form.setFields([{ name: 'name', errors: ['Ce nom existe déjà.'] }]);
      } else {
        message.error(err.response?.data?.message || "Erreur lors de l'opération");
      }
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 100 },
    { title: 'Nom de la catégorie', dataIndex: 'name' },
    {
      title: 'Actions',
      width: 140,
      render: (_, record) => (
        <Space>
          {/* On passe bien 'record' qui contient notre 'id' transformé */}
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleOpenEdit(record)} />
          <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleOpenDelete(record)} />
        </Space>
      )
    }
  ];

  return (
    <div className="details-panel">
      <h6 className={styles.pageTitle}>Catégories</h6><hr/>
      
      <TableHeader 
        search={search} 
        onSearch={(val) => { setSearch(val); fetchData(1, pageSize, val); }} 
        onAdd={handleOpenAdd} 
        placeholder="Rechercher une catégorie..." 
      />

      <CustomTable 
        styles={styles} 
        columns={columns} 
        dataSource={categories} 
        loading={loading} 
        page={page} 
        pageSize={pageSize} 
        total={total} 
        onChange={fetchData} 
      />

      <CrudModal 
        open={isModalOpen} 
        mode={mode} 
        onCancel={() => setIsModalOpen(false)} 
        onConfirm={handleConfirm}
        title={mode === 'delete' ? 'Confirmation' : (editing ? 'Modifier la catégorie' : 'Nouvelle Catégorie')}
      >
        {mode === 'delete' ? (
          <p>Voulez-vous supprimer <b>{editing?.name}</b> ?</p>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item 
              name="name" 
              label="Nom de la catégorie" 
              rules={[{ required: true, message: 'Le nom est obligatoire' }]}
            >
              <Input  />
            </Form.Item>
          </Form>
        )}
      </CrudModal>
    </div>
  );
};

export default Categories;