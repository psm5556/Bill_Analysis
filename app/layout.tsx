import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '미국 재무부 국채 위기 모니터',
  description: '미국 국채 발행 구조, 이자 부담, 유동성, 경매 수요를 통합 모니터링하는 대시보드',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
