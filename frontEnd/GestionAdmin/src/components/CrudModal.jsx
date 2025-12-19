import React from 'react';
import { Modal, Button } from 'antd';
import { RollbackOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';

export const CrudModal = ({ open, mode, title, onCancel, onConfirm, children }) => (
  <Modal
    title={title}
    open={open}
    onCancel={onCancel}
    closable={false}
    maskClosable={false}
    footer={[
      <Button key="cancel" onClick={onCancel} icon={<RollbackOutlined />}>Annuler</Button>,
      <Button 
        key="submit" 
        type="primary" 
        danger={mode === 'delete'} 
        onClick={onConfirm}
        icon={mode === 'delete' ? <DeleteOutlined /> : <SaveOutlined />}
      >
        {mode === 'delete' ? 'Supprimer' : (mode === 'edit' ? 'Modifier' : 'Créer')}
      </Button>
    ]}
  >
    {children}
  </Modal>
);