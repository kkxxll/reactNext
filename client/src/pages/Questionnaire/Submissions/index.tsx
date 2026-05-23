import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Empty, List, Spin, Tag, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { fetchQuestionnaireById, fetchSubmissions } from '../../../services/questionnaire';
import type { Questionnaire, Submission } from '../../../services/questionnaire';

function QuestionnaireSubmissions() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [q, subs] = await Promise.all([
        fetchQuestionnaireById(id),
        fetchSubmissions(id),
      ]);
      setQuestionnaire(q);
      setSubmissions(subs);
    } catch (e) {
      message.error((e as Error).message || '加载失败');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/questionnaire')}
        />
        <h2 className="m-0 text-lg font-semibold">
          提交记录
          {questionnaire && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              —— {questionnaire.title}
            </span>
          )}
        </h2>
        <Tag className="ml-auto">{submissions.length} 条记录</Tag>
      </div>

      <Spin spinning={loading}>
        {submissions.length === 0 && !loading ? (
          <Card>
            <Empty description="暂无提交记录" />
          </Card>
        ) : (
          <List
            dataSource={submissions}
            renderItem={(item, index) => (
              <Card className="mb-3" size="small">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    提交 #{submissions.length - index}
                  </span>
                  <span className="text-xs text-gray-400">{item.submittedAt}</span>
                </div>
                <div className="space-y-2">
                  {item.answers.map((answer, i) => (
                    <div key={i} className="text-sm">
                      <span className="text-gray-500">第 {i + 1} 题：</span>
                      <span className="text-gray-800">{answer || '（未作答）'}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          />
        )}
      </Spin>
    </div>
  );
}

export default QuestionnaireSubmissions;
