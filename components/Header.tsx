'use client';
import { useState } from 'react';
import { testFredApiKey } from '@/lib/fredApi';

interface HeaderProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onApiKeyValid: (valid: boolean) => void;
}

export default function Header({ apiKey, onApiKeyChange, onApiKeyValid }: HeaderProps) {
  const [inputKey, setInputKey] = useState(apiKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'fail' | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const handleSaveTest = async () => {
    if (!inputKey.trim()) return;
    setIsTesting(true);
    setTestResult(null);
    const valid = await testFredApiKey(inputKey.trim());
    setTestResult(valid ? 'success' : 'fail');
    if (valid) {
      onApiKeyChange(inputKey.trim());
      onApiKeyValid(true);
    } else {
      onApiKeyValid(false);
    }
    setIsTesting(false);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-700 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl font-bold text-white mb-3">
          🏛️ 미국 재무부 국채 위기 모니터
        </h1>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-400 font-medium text-sm">🔑 FRED API 키 설정</span>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="text-slate-400 hover:text-slate-200 text-xs underline"
            >
              키 발급 방법
            </button>
          </div>

          {showHelp && (
            <div className="mb-3 bg-slate-900 border border-slate-700 rounded p-3 text-xs text-slate-300">
              <p className="mb-1 font-medium">FRED API 키 무료 발급:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>fred.stlouisfed.org 접속 → 상단 &quot;My Account&quot; → &quot;API Keys&quot;</li>
                <li>이메일로 계정 생성 (무료)</li>
                <li>32자리 API 키 발급 후 아래 입력</li>
              </ol>
              <p className="mt-2 text-slate-500">⚠️ 키는 브라우저(localStorage)에만 저장되며 서버로 전송되지 않습니다.</p>
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTest()}
              placeholder="32자리 FRED API 키 입력..."
              className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSaveTest}
              disabled={isTesting || !inputKey.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm rounded font-medium transition-colors"
            >
              {isTesting ? '테스트 중...' : '저장 & 테스트'}
            </button>
          </div>

          {testResult === 'success' && (
            <p className="mt-2 text-green-400 text-sm">✅ API 키 확인 완료. 실시간 데이터를 불러옵니다.</p>
          )}
          {testResult === 'fail' && (
            <p className="mt-2 text-red-400 text-sm">❌ API 키가 유효하지 않습니다. FRED 사이트에서 키를 확인하세요.</p>
          )}
        </div>
      </div>
    </header>
  );
}
