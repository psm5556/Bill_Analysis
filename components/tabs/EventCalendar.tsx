'use client';
import { useState } from 'react';

interface CalendarEvent {
  id: number;
  date: string;
  category: string;
  title: string;
  importance: 'high' | 'medium' | 'low';
  isManual?: boolean;
}

const PRESET_EVENTS: CalendarEvent[] = [
  { id: 1, date: '2026-04-28', category: '재무부', title: 'Q2 차입 추정치 발표', importance: 'high' },
  { id: 2, date: '2026-04-29', category: '경제지표', title: 'Q1 GDP 속보치 발표', importance: 'high' },
  { id: 3, date: '2026-04-30', category: '경제지표', title: 'PCE 물가 발표', importance: 'high' },
  { id: 4, date: '2026-05-05', category: '재무부', title: '4주/8주 Bills 경매', importance: 'medium' },
  { id: 5, date: '2026-05-06', category: '재무부', title: '3년 Note 경매', importance: 'medium' },
  { id: 6, date: '2026-05-07', category: '재무부', title: '10년 Note 경매', importance: 'high' },
  { id: 7, date: '2026-05-08', category: '재무부', title: '30년 Bond 경매', importance: 'high' },
  { id: 8, date: '2026-05-07', category: 'FOMC', title: 'FOMC 정책 결정 발표', importance: 'high' },
  { id: 9, date: '2026-05-14', category: '경제지표', title: 'CPI 발표', importance: 'high' },
];

const CLUSTER_THRESHOLD = 3;

function detectClusters(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const byDate = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const arr = byDate.get(e.date) ?? [];
    arr.push(e);
    byDate.set(e.date, arr);
  }
  const clusters = new Map<string, CalendarEvent[]>();
  for (const [date, evts] of byDate) {
    if (evts.filter((e) => e.importance === 'high').length >= 2 || evts.length >= CLUSTER_THRESHOLD) {
      clusters.set(date, evts);
    }
  }
  return clusters;
}

const CATEGORIES = ['재무부', 'FOMC', '경제지표', '관세/정책', '기타'];
const CATEGORY_COLORS: Record<string, string> = {
  '재무부': 'bg-blue-900 text-blue-300',
  'FOMC': 'bg-yellow-900 text-yellow-300',
  '경제지표': 'bg-purple-900 text-purple-300',
  '관세/정책': 'bg-orange-900 text-orange-300',
  '기타': 'bg-slate-700 text-slate-300',
};
const IMPORTANCE_COLORS = {
  high: 'text-red-400',
  medium: 'text-yellow-400',
  low: 'text-slate-400',
};
const IMPORTANCE_LABELS = {
  high: '🔴 높음',
  medium: '🟡 보통',
  low: '🟢 낮음',
};

export default function EventCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>(PRESET_EVENTS);
  const [newDate, setNewDate] = useState('');
  const [newCategory, setNewCategory] = useState('기타');
  const [newTitle, setNewTitle] = useState('');
  const [newImportance, setNewImportance] = useState<'high' | 'medium' | 'low'>('medium');

  const clusters = detectClusters(events);
  const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));

  const addEvent = () => {
    if (!newDate || !newTitle.trim()) return;
    setEvents((prev) => [
      ...prev,
      {
        id: Date.now(),
        date: newDate,
        category: newCategory,
        title: newTitle.trim(),
        importance: newImportance,
        isManual: true,
      },
    ]);
    setNewTitle('');
    setNewDate('');
  };

  const removeEvent = (id: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id || !e.isManual));
  };

  return (
    <div className="space-y-6">
      {/* Cluster Alert */}
      {clusters.size > 0 && (
        <div className="bg-red-950/50 border border-red-800 rounded-lg p-4">
          <h3 className="text-red-400 font-bold mb-3">⚠️ 클러스터 경보일 감지</h3>
          <p className="text-slate-400 text-sm mb-3">아래 날짜들은 고위험 이벤트가 집중되어 있습니다. 특별 주의가 필요합니다.</p>
          <div className="space-y-2">
            {[...clusters.entries()].map(([date, evts]) => (
              <div key={date} className="bg-red-950/50 border border-red-900 rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-400 font-bold text-sm">🚨 {date}</span>
                  <span className="text-red-300 text-xs">{evts.length}개 이벤트 집중</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {evts.map((e) => (
                    <span key={e.id} className="text-xs bg-red-900/50 text-red-200 px-2 py-0.5 rounded">
                      {e.title}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* This Week's Scheduled Auctions */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-3">📅 이번 주 예정 경매</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { day: '월요일', items: ['4주 Bills 경매', '8주 Bills 경매'], note: '매주 정기 발행' },
            { day: '화요일', items: ['CMB (필요시)', '52주 Bills (격주)'], note: '비정기 발행' },
            { day: '수요일', items: ['2년 Note (월간)', '5년 Note (월간)'], note: '월간 정기' },
            { day: '목요일', items: ['3년 Note (월간)', '7년 Note (월간)'], note: '월간 정기' },
          ].map((day) => (
            <div key={day.day} className="bg-slate-900 rounded p-3">
              <div className="text-blue-400 font-medium text-sm mb-1">{day.day}</div>
              {day.items.map((item, i) => (
                <div key={i} className="text-slate-300 text-xs py-0.5">• {item}</div>
              ))}
              <div className="text-slate-600 text-xs mt-1">{day.note}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-yellow-950/50 border border-yellow-800 rounded p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">⚡ 주요 경매 주간 (월간)</p>
          <p className="text-slate-300">10년(화) + 30년(수~목) 경매 주간은 장기물 수요 테스트 핵심. 결과는 TreasuryDirect.gov에서 경매 당일 오후 발표.</p>
        </div>
      </div>

      {/* Fed Buyback Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-3">🏦 Fed 바이백 프로그램</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 rounded p-4">
            <div className="text-blue-400 font-bold mb-2 text-sm">정기 유동성 바이백</div>
            <div className="text-slate-300 text-sm space-y-1">
              <p>• 매주 실시 (연준 재량)</p>
              <p>• 오래된 국채 매입 → 시장 유동성 공급</p>
              <p>• 규모 확대 = 유동성 방어 모드 신호</p>
            </div>
          </div>
          <div className="bg-slate-900 rounded p-4">
            <div className="text-yellow-400 font-bold mb-2 text-sm">긴급 유동성 바이백</div>
            <div className="text-slate-300 text-sm space-y-1">
              <p>• 비정기 (시장 스트레스 시)</p>
              <p>• 경매 실패 방어 목적</p>
              <p>• 발동 = 재무부/Fed 긴장 신호</p>
            </div>
          </div>
        </div>
        <p className="text-slate-500 text-xs mt-3">* 바이백 일정: TreasuryDirect.gov → Buyback Operations</p>
      </div>

      {/* Event Timeline */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-4">📋 이벤트 타임라인</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400">날짜</th>
                <th className="text-left py-2 px-3 text-slate-400">카테고리</th>
                <th className="text-left py-2 px-3 text-slate-400">이벤트</th>
                <th className="text-left py-2 px-3 text-slate-400">중요도</th>
                <th className="py-2 px-3 text-slate-400"></th>
              </tr>
            </thead>
            <tbody>
              {sortedEvents.map((event, i) => (
                <tr key={event.id} className={`border-b border-slate-800 ${i % 2 === 0 ? 'bg-slate-900/30' : ''} ${clusters.has(event.date) ? 'ring-1 ring-red-900/50' : ''}`}>
                  <td className="py-2 px-3 text-slate-300 whitespace-nowrap">
                    {event.date}
                    {clusters.has(event.date) && <span className="ml-1 text-red-400 text-xs">🚨</span>}
                  </td>
                  <td className="py-2 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${CATEGORY_COLORS[event.category] ?? 'bg-slate-700 text-slate-300'}`}>
                      {event.category}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-200">{event.title}</td>
                  <td className={`py-2 px-3 text-xs font-medium ${IMPORTANCE_COLORS[event.importance]}`}>
                    {IMPORTANCE_LABELS[event.importance]}
                  </td>
                  <td className="py-2 px-3">
                    {event.isManual && (
                      <button
                        onClick={() => removeEvent(event.id)}
                        className="text-slate-600 hover:text-red-400 text-xs transition-colors"
                      >
                        삭제
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Event Add */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-4">➕ 이벤트 수동 추가</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-slate-400 text-xs mb-1 block">날짜</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1 block">카테고리</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-slate-400 text-xs mb-1 block">이벤트 제목</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addEvent()}
              placeholder="이벤트 내용 입력..."
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-slate-400 text-xs">중요도:</span>
          {(['high', 'medium', 'low'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setNewImportance(level)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                newImportance === level
                  ? level === 'high' ? 'bg-red-600 text-white' : level === 'medium' ? 'bg-yellow-600 text-white' : 'bg-slate-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {IMPORTANCE_LABELS[level]}
            </button>
          ))}
        </div>
        <button
          onClick={addEvent}
          disabled={!newDate || !newTitle.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm rounded font-medium transition-colors"
        >
          추가
        </button>
      </div>

      {/* QRA Schedule */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-3">🗓️ 분기별 국채 발행 공고 (QRA) 일정</h3>
        <div className="space-y-3 text-sm">
          <div className="bg-slate-900 rounded p-3">
            <div className="text-blue-400 font-medium">2026년 2분기 (5월)</div>
            <ul className="text-slate-300 mt-1 space-y-1">
              <li>• 4월 28일경: 차입 추정치 발표</li>
              <li>• 5월 예정: QRA 발표 (쿠폰채 경매 규모, 단기물 방향성)</li>
            </ul>
          </div>
          <div className="bg-slate-900 rounded p-3">
            <div className="text-blue-400 font-medium">2026년 3분기 (8월)</div>
            <p className="text-slate-300 mt-1">Q3 QRA 발표 예정</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">⚡ QRA 발표는 재무부가 발행 구성의 구조적 변화를 신호하는 핵심 이벤트입니다.</p>
      </div>

      {/* Tariff Policy Tree */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <h3 className="text-white font-bold mb-4">🌳 관세 정책 대안 체계도</h3>
        <div className="text-sm text-slate-400 mb-4">
          <code className="text-blue-400">IEEPA 차단 → Section 122 발동 → Section 232 대체 → Section 301 정밀타격 → Section 201 세이프가드</code>
        </div>
        <div className="space-y-4">
          {[
            {
              name: 'IEEPA',
              subtitle: '국제비상경제권한법',
              color: 'red',
              items: [
                '가장 강력한 수단, 의회 승인 불필요',
                '현재 차단 상태 (2026년 2월 대법원 위헌 판결)',
                '가장 빠른 옵션이었으나 현재 사용 불가',
              ],
            },
            {
              name: 'Section 122',
              subtitle: '1974년 통상법 §122',
              color: 'yellow',
              items: [
                '모든 수입품에 최대 15% 임시 관세',
                '150일 시한 (의회 승인으로 연장 가능)',
                'IEEPA 실패 후 "플랜 B"',
                '만료 예정: ~2026년 7월',
              ],
            },
            {
              name: 'Section 232',
              subtitle: '무역확장법 §232',
              color: 'orange',
              items: [
                '국가안보 근거 특정 관세',
                '현재 가동 중 (철강/알루미늄/구리)',
                '무기한 유지 가능',
                '브랜드별 적용 가능',
              ],
            },
            {
              name: 'Section 301',
              subtitle: '통상법 §301',
              color: 'yellow',
              items: [
                '불공정 무역관행 보복',
                '조사 과정 필요 (수개월)',
                '정밀 타격 능력',
                '결과 예상: ~2026년 7월',
              ],
            },
            {
              name: 'Section 201',
              subtitle: '통상법 §201',
              color: 'slate',
              items: [
                '특정 산업 긴급 세이프가드',
                '4년 기간 제한',
                'WTO 분쟁 위험',
                '예비 옵션',
              ],
            },
          ].map((item) => {
            const colorMap: Record<string, string> = {
              red: 'border-red-700 bg-red-950/30',
              yellow: 'border-yellow-700 bg-yellow-950/30',
              orange: 'border-orange-700 bg-orange-950/30',
              slate: 'border-slate-600 bg-slate-900/50',
            };
            const labelMap: Record<string, string> = {
              red: 'text-red-400',
              yellow: 'text-yellow-400',
              orange: 'text-orange-400',
              slate: 'text-slate-400',
            };
            return (
              <div key={item.name} className={`border rounded-lg p-4 ${colorMap[item.color]}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-bold ${labelMap[item.color]}`}>{item.name}</span>
                  <span className="text-slate-400 text-sm">— {item.subtitle}</span>
                </div>
                <ul className="text-sm text-slate-300 space-y-1">
                  {item.items.map((li, i) => <li key={i}>• {li}</li>)}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
