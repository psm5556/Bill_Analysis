'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import SummaryOpinion from '@/components/tabs/SummaryOpinion';
import AuctionManual from '@/components/tabs/AuctionManual';
import EventCalendar from '@/components/tabs/EventCalendar';
import WeeklyAuction from '@/components/tabs/WeeklyAuction';
import ContrarianIndicators from '@/components/tabs/ContrarianIndicators';
import CascadeFailure from '@/components/tabs/CascadeFailure';
import DealerPosition from '@/components/tabs/DealerPosition';
import Check1Issuance from '@/components/tabs/Check1Issuance';
import Check2Interest from '@/components/tabs/Check2Interest';
import Check3Liquidity from '@/components/tabs/Check3Liquidity';
import Check4Maturity from '@/components/tabs/Check4Maturity';
import Glossary from '@/components/tabs/Glossary';
import DataSources from '@/components/tabs/DataSources';
import { TABS } from '@/lib/constants';
import type { TabId } from '@/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('summary');
  const [apiKey, setApiKey] = useState('');
  const [apiKeyValid, setApiKeyValid] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('fredApiKey');
    if (stored) {
      try {
        setApiKey(JSON.parse(stored));
      } catch {
        setApiKey(stored);
      }
    }
  }, []);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem('fredApiKey', JSON.stringify(key));
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'summary': return <SummaryOpinion />;
      case 'auction-manual': return <AuctionManual />;
      case 'event-calendar': return <EventCalendar />;
      case 'weekly-auction': return <WeeklyAuction />;
      case 'contrarian': return <ContrarianIndicators apiKey={apiKey} />;
      case 'cascade': return <CascadeFailure />;
      case 'dealer': return <DealerPosition />;
      case 'check1': return <Check1Issuance />;
      case 'check2': return <Check2Interest />;
      case 'check3': return <Check3Liquidity apiKey={apiKey} />;
      case 'check4': return <Check4Maturity apiKey={apiKey} />;
      case 'glossary': return <Glossary />;
      case 'data-sources': return <DataSources />;
      default: return <SummaryOpinion />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
        onApiKeyValid={setApiKeyValid}
      />
      <TabNavigation tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {!apiKeyValid && activeTab !== 'summary' && activeTab !== 'auction-manual' &&
         activeTab !== 'event-calendar' && activeTab !== 'weekly-auction' &&
         activeTab !== 'cascade' && activeTab !== 'dealer' &&
         activeTab !== 'check1' && activeTab !== 'check2' &&
         activeTab !== 'glossary' && activeTab !== 'data-sources' && (
          <div className="bg-yellow-950/50 border border-yellow-700 rounded-lg p-4 mb-4 text-sm text-yellow-300">
            💡 실시간 데이터를 보려면 상단에서 FRED API 키를 입력하고 &ldquo;저장 &amp; 테스트&rdquo;를 클릭하세요.
          </div>
        )}
        {renderTab()}
      </main>
    </div>
  );
}
