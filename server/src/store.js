/**
 * 问卷数据存储（内存版）
 *
 * 进程重启会重置；后续可替换为数据库实现，对路由层无侵入。
 */

const formatDateTime = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
};

let db = [
  {
    id: '1001',
    title: '前端开发体验调研',
    description: '收集团队对当前前端开发体验的反馈',
    questionCount: 10,
    status: 'published',
    createdAt: '2025-05-01 10:00:00',
  },
  {
    id: '1002',
    title: '员工满意度问卷',
    description: '季度员工满意度调研',
    questionCount: 15,
    status: 'draft',
    createdAt: '2025-05-10 14:20:00',
  },
  {
    id: '1003',
    title: '产品功能优先级投票',
    description: '收集用户对下季度功能的期望',
    questionCount: 6,
    status: 'closed',
    createdAt: '2025-04-20 09:30:00',
  },
];

const VALID_STATUSES = ['draft', 'published', 'closed'];

const validateInput = (input) => {
  if (!input || typeof input !== 'object') return '请求体格式错误';
  if (typeof input.title !== 'string' || input.title.trim() === '') return '标题不能为空';
  if (input.title.length > 50) return '标题最多 50 个字符';
  if (input.description != null && typeof input.description !== 'string') {
    return '描述类型错误';
  }
  if (input.description && input.description.length > 200) return '描述最多 200 个字符';
  if (
    typeof input.questionCount !== 'number' ||
    !Number.isInteger(input.questionCount) ||
    input.questionCount < 1 ||
    input.questionCount > 100
  ) {
    return '题目数量必须为 1~100 的整数';
  }
  if (!VALID_STATUSES.includes(input.status)) return '状态值非法';
  return null;
};

const store = {
  getById(id) {
    const item = db.find((it) => it.id === id);
    if (!item) return { error: '问卷不存在', notFound: true };
    return { data: item };
  },

  list({ keyword = '', status = 'all' } = {}) {
    const kw = String(keyword).trim();
    return db.filter((item) => {
      const matchKw = kw === '' || item.title.includes(kw);
      const matchStatus = status === 'all' || item.status === status;
      return matchKw && matchStatus;
    });
  },

  create(input) {
    const error = validateInput(input);
    if (error) return { error };
    const item = {
      id: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
      title: input.title,
      description: input.description || '',
      questionCount: input.questionCount,
      status: input.status,
      createdAt: formatDateTime(new Date()),
    };
    db = [item, ...db];
    return { data: item };
  },

  update(id, input) {
    const error = validateInput(input);
    if (error) return { error };
    const index = db.findIndex((it) => it.id === id);
    if (index === -1) return { error: '问卷不存在', notFound: true };
    const updated = {
      ...db[index],
      title: input.title,
      description: input.description || '',
      questionCount: input.questionCount,
      status: input.status,
    };
    db = db.map((it) => (it.id === id ? updated : it));
    return { data: updated };
  },

  remove(id) {
    const exists = db.some((it) => it.id === id);
    if (!exists) return { error: '问卷不存在', notFound: true };
    db = db.filter((it) => it.id !== id);
    return { data: { success: true } };
  },
};

// ------------------- 答卷存储 -------------------
let submissions = [];

const submissionStore = {
  submit(questionnaireId, answers) {
    const questionnaire = db.find((it) => it.id === questionnaireId);
    if (!questionnaire) return { error: '问卷不存在', notFound: true };
    if (questionnaire.status !== 'published') return { error: '该问卷未发布，无法填写' };
    if (!Array.isArray(answers) || answers.length === 0) return { error: '答案不能为空' };

    const record = {
      id: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
      questionnaireId,
      answers,
      submittedAt: formatDateTime(new Date()),
    };
    submissions = [record, ...submissions];
    return { data: record };
  },

  listByQuestionnaire(questionnaireId) {
    return submissions.filter((s) => s.questionnaireId === questionnaireId);
  },
};

module.exports = { store, submissionStore };
