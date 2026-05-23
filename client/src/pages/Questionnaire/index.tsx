import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  fetchQuestionnaires,
  removeQuestionnaire,
} from '../../services/questionnaire';
import type {
  Questionnaire as QuestionnaireItem,
  QuestionnaireStatus,
} from '../../services/questionnaire';

const statusMap: Record<QuestionnaireStatus, { color: string; label: string }> = {
  draft: { color: 'default', label: '草稿' },
  published: { color: 'green', label: '已发布' },
  closed: { color: 'red', label: '已关闭' },
};

function Questionnaire() {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState<QuestionnaireItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuestionnaireStatus | 'all'>('all');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchQuestionnaires({ keyword, status: statusFilter });
      setDataSource(list);
    } catch (e) {
      message.error((e as Error).message || '加载失败');
    } finally {
      setLoading(false);
    }
  }, [keyword, statusFilter]);

  // 关键词输入做 300ms 防抖；状态变化立即触发
  useEffect(() => {
    const timer = setTimeout(loadData, 300);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleDelete = async (id: string) => {
    try {
      await removeQuestionnaire(id);
      message.success('删除成功');
      loadData();
    } catch (e) {
      message.error((e as Error).message || '删除失败');
    }
  };

  const columns: ColumnsType<QuestionnaireItem> = [
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
          <Button type="link" onClick={() => navigate(`/questionnaire/edit/${record.id}`)}>
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
        <Space>
          <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
            刷新
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/questionnaire/create')}
          >
            新建问卷
          </Button>
        </Space>
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

      <Table<QuestionnaireItem>
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        scroll={{ x: 900 }}
      />
    </div>
  );
}

export default Questionnaire;
