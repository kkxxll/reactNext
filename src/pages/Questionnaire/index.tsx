import { useMemo, useState } from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

type QuestionnaireStatus = 'draft' | 'published' | 'closed';

interface Questionnaire {
  id: string;
  title: string;
  description?: string;
  questionCount: number;
  status: QuestionnaireStatus;
  createdAt: string;
}

const statusMap: Record<QuestionnaireStatus, { color: string; label: string }> = {
  draft: { color: 'default', label: '草稿' },
  published: { color: 'green', label: '已发布' },
  closed: { color: 'red', label: '已关闭' },
};

const initialData: Questionnaire[] = [
  {
    id: '1',
    title: '前端开发体验调研',
    description: '收集团队对当前前端开发体验的反馈',
    questionCount: 10,
    status: 'published',
    createdAt: '2025-05-01 10:00:00',
  },
  {
    id: '2',
    title: '员工满意度问卷',
    description: '季度员工满意度调研',
    questionCount: 15,
    status: 'draft',
    createdAt: '2025-05-10 14:20:00',
  },
  {
    id: '3',
    title: '产品功能优先级投票',
    description: '收集用户对下季度功能的期望',
    questionCount: 6,
    status: 'closed',
    createdAt: '2025-04-20 09:30:00',
  },
];

function formatDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function Questionnaire() {
  const [dataSource, setDataSource] = useState<Questionnaire[]>(initialData);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuestionnaireStatus | 'all'>('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Questionnaire | null>(null);
  const [form] = Form.useForm<Omit<Questionnaire, 'id' | 'createdAt'>>();

  const filteredData = useMemo(() => {
    return dataSource.filter((item) => {
      const matchKeyword = keyword.trim() === '' || item.title.includes(keyword.trim());
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchKeyword && matchStatus;
    });
  }, [dataSource, keyword, statusFilter]);

  const openCreateModal = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ status: 'draft', questionCount: 1 });
    setModalOpen(true);
  };

  const openEditModal = (record: Questionnaire) => {
    setEditing(record);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      questionCount: record.questionCount,
      status: record.status,
    });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDataSource((prev) => prev.filter((item) => item.id !== id));
    message.success('删除成功');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        setDataSource((prev) =>
          prev.map((item) => (item.id === editing.id ? { ...item, ...values } : item)),
        );
        message.success('更新成功');
      } else {
        const newItem: Questionnaire = {
          id: Date.now().toString(),
          createdAt: formatDateTime(new Date()),
          ...values,
        };
        setDataSource((prev) => [newItem, ...prev]);
        message.success('创建成功');
      }
      setModalOpen(false);
    } catch {
      // 校验失败由 antd 自行展示
    }
  };

  const columns: ColumnsType<Questionnaire> = [
    {
      title: '问卷标题',
      dataIndex: 'title',
      key: 'title',
      width: 220,
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text?: string) => text || <span className="text-gray-400">—</span>,
    },
    {
      title: '题目数',
      dataIndex: 'questionCount',
      key: 'questionCount',
      width: 90,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: QuestionnaireStatus) => {
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
            title="确认删除该问卷？"
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
        <h2 className="m-0 text-lg font-semibold">问卷管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          新建问卷
        </Button>
      </div>

      <Space className="mb-4" wrap>
        <Input
          allowClear
          placeholder="搜索问卷标题"
          prefix={<SearchOutlined />}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ width: 240 }}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 140 }}
          options={[
            { value: 'all', label: '全部状态' },
            { value: 'draft', label: '草稿' },
            { value: 'published', label: '已发布' },
            { value: 'closed', label: '已关闭' },
          ]}
        />
      </Space>

      <Table<Questionnaire>
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        scroll={{ x: 900 }}
      />

      <Modal
        title={editing ? '编辑问卷' : '新建问卷'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText="确定"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            label="问卷标题"
            name="title"
            rules={[
              { required: true, message: '请输入问卷标题' },
              { max: 50, message: '标题最多 50 个字符' },
            ]}
          >
            <Input placeholder="请输入问卷标题" />
          </Form.Item>
          <Form.Item label="问卷描述" name="description" rules={[{ max: 200 }]}>
            <Input.TextArea rows={3} placeholder="请输入问卷描述（可选）" />
          </Form.Item>
          <Form.Item
            label="题目数量"
            name="questionCount"
            rules={[{ required: true, message: '请输入题目数量' }]}
          >
            <InputNumber min={1} max={100} className="!w-full" />
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select
              options={[
                { value: 'draft', label: '草稿' },
                { value: 'published', label: '已发布' },
                { value: 'closed', label: '已关闭' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Questionnaire;
