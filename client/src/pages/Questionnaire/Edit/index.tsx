import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Form, Input, InputNumber, Select, Space, Spin, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  createQuestionnaire,
  fetchQuestionnaireById,
  updateQuestionnaire,
} from '../../../services/questionnaire';
import type { QuestionnaireInput } from '../../../services/questionnaire';

function QuestionnaireEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [form] = Form.useForm<QuestionnaireInput>();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await fetchQuestionnaireById(id);
      form.setFieldsValue({
        title: data.title,
        description: data.description,
        questionCount: data.questionCount,
        status: data.status,
      });
    } catch (e) {
      message.error((e as Error).message || '加载问卷详情失败');
      navigate('/questionnaire');
    } finally {
      setLoading(false);
    }
  }, [id, form, navigate]);

  useEffect(() => {
    if (isEdit) {
      loadDetail();
    } else {
      // 新建时设置默认值
      form.setFieldsValue({ status: 'draft', questionCount: 1 });
    }
  }, [isEdit, loadDetail, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      if (isEdit && id) {
        await updateQuestionnaire(id, values);
        message.success('更新成功');
      } else {
        await createQuestionnaire(values);
        message.success('创建成功');
      }
      navigate('/questionnaire');
    } catch (e) {
      if (e instanceof Error) {
        message.error(e.message);
      }
      // 表单校验错误由 antd 自行展示
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/questionnaire');
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel}
        />
        <h2 className="m-0 text-lg font-semibold">
          {isEdit ? '编辑问卷' : '新建问卷'}
        </h2>
      </div>

      <Card>
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            style={{ maxWidth: 600 }}
          >
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

            <Form.Item
              label="问卷描述"
              name="description"
              rules={[{ max: 200, message: '描述最多 200 个字符' }]}
            >
              <Input.TextArea rows={4} placeholder="请输入问卷描述（可选）" />
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

            <Form.Item>
              <Space>
                <Button type="primary" onClick={handleSubmit} loading={submitting}>
                  {isEdit ? '保存修改' : '创建问卷'}
                </Button>
                <Button onClick={handleCancel}>取消</Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
}

export default QuestionnaireEdit;
