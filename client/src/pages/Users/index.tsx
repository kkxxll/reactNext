import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { createUser, fetchUsers, removeUser, updateUser } from '../../services/user';
import type { User, UserInput, UserRole, UserStatus } from '../../services/user';

const roleMap: Record<UserRole, { color: string; label: string }> = {
  admin: { color: 'red', label: '管理员' },
  editor: { color: 'blue', label: '编辑者' },
  viewer: { color: 'default', label: '查看者' },
};

const statusMap: Record<UserStatus, { color: string; label: string }> = {
  active: { color: 'green', label: '启用' },
  disabled: { color: 'default', label: '禁用' },
};

function Users() {
  const [dataSource, setDataSource] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [keyword, setKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form] = Form.useForm<UserInput>();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchUsers({ keyword, role: roleFilter, status: statusFilter });
      setDataSource(list);
    } catch (e) {
      message.error((e as Error).message || '加载失败');
    } finally {
      setLoading(false);
    }
  }, [keyword, roleFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(loadData, 300);
    return () => clearTimeout(timer);
  }, [loadData]);

  const openCreateModal = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ role: 'viewer', status: 'active' });
    setModalOpen(true);
  };

  const openEditModal = (record: User) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      phone: record.phone,
      role: record.role,
      status: record.status,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await removeUser(id);
      message.success('删除成功');
      loadData();
    } catch (e) {
      message.error((e as Error).message || '删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      if (editing) {
        await updateUser(editing.id, values);
        message.success('更新成功');
      } else {
        await createUser(values);
        message.success('创建成功');
      }
      setModalOpen(false);
      loadData();
    } catch (e) {
      if (e instanceof Error) {
        message.error(e.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      ellipsis: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
      render: (text?: string) => text || <span className="text-gray-400">—</span>,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: UserRole) => {
        const cfg = roleMap[role];
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: UserStatus) => {
        const cfg = statusMap[status];
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除该用户？"
            okText="删除"
            okButtonProps={{ danger: true }}
            cancelText="取消"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="m-0 text-lg font-semibold">用户管理</h2>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            新建用户
          </Button>
        </Space>
      </div>

      <Space className="mb-4" wrap>
        <Input
          allowClear
          placeholder="搜索姓名或邮箱"
          prefix={<SearchOutlined />}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ width: 220 }}
        />
        <Select
          value={roleFilter}
          onChange={setRoleFilter}
          style={{ width: 120 }}
          options={[
            { value: 'all', label: '全部角色' },
            { value: 'admin', label: '管理员' },
            { value: 'editor', label: '编辑者' },
            { value: 'viewer', label: '查看者' },
          ]}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 120 }}
          options={[
            { value: 'all', label: '全部状态' },
            { value: 'active', label: '启用' },
            { value: 'disabled', label: '禁用' },
          ]}
        />
      </Space>

      <Table<User>
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (t) => `共 ${t} 条` }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={editing ? '编辑用户' : '新建用户'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={submitting}
        okText="确定"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            label="姓名"
            name="name"
            rules={[
              { required: true, message: '请输入姓名' },
              { max: 20, message: '姓名最多 20 个字符' },
            ]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }]}
          >
            <Input placeholder="请输入手机号（可选）" />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select
              options={[
                { value: 'admin', label: '管理员' },
                { value: 'editor', label: '编辑者' },
                { value: 'viewer', label: '查看者' },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select
              options={[
                { value: 'active', label: '启用' },
                { value: 'disabled', label: '禁用' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Users;
