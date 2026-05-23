import Link from 'next/link';
import { getPublishedQuestionnaires, type Questionnaire } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let questionnaires: Questionnaire[] = [];
  let error = '';

  try {
    questionnaires = await getPublishedQuestionnaires();
  } catch (e) {
    error = (e as Error).message || '加载失败';
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">在线问卷</h1>
        <p className="text-gray-500">选择一份问卷开始填写</p>
      </div>

      {error && (
        <div className="text-center text-red-500 py-8">{error}</div>
      )}

      {!error && questionnaires.length === 0 && (
        <div className="text-center text-gray-400 py-16">暂无可填写的问卷</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {questionnaires.map((q) => (
          <Link
            key={q.id}
            href={`/q/${q.id}`}
            className="block bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all"
          >
            <h3 className="text-base font-medium text-gray-800 mb-2 line-clamp-1">
              {q.title}
            </h3>
            {q.description && (
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {q.description}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{q.questionCount} 道题</span>
              <span>{q.createdAt}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
