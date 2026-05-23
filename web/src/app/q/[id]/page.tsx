'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getQuestionnaire, submitAnswer, type Questionnaire } from '@/lib/api';

interface Props {
  params: Promise<{ id: string }>;
}

export default function QuestionnaireFillPage({ params }: Props) {
  const router = useRouter();
  const [id, setId] = useState('');
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getQuestionnaire(id)
      .then((data) => {
        setQuestionnaire(data);
        setAnswers(new Array(data.questionCount).fill(''));
      })
      .catch((e) => setError(e.message || '加载失败'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (index: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证至少填写了一个答案
    if (answers.every((a) => a.trim() === '')) {
      setError('请至少回答一道题目');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await submitAnswer(id, answers);
      router.push(`/q/${id}/success`);
    } catch (err) {
      setError((err as Error).message || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-400">
        加载中...
      </div>
    );
  }

  if (error && !questionnaire) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!questionnaire) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-2">{questionnaire.title}</h1>
        {questionnaire.description && (
          <p className="text-gray-500 text-sm">{questionnaire.description}</p>
        )}
        <div className="mt-3 text-xs text-gray-400">
          共 {questionnaire.questionCount} 道题
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {answers.map((answer, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                第 {index + 1} 题
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="请输入您的回答..."
                value={answer}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-500 text-center">{error}</div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? '提交中...' : '提交问卷'}
          </button>
        </div>
      </form>
    </div>
  );
}
