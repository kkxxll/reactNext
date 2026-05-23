import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <h1 className="text-xl font-bold text-gray-800 mb-2">提交成功</h1>
      <p className="text-gray-500 mb-8">感谢您的参与，您的回答已成功提交！</p>

      <Link
        href="/"
        className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        返回首页
      </Link>
    </div>
  );
}
