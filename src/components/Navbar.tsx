import React from 'react';
import { Layers, FileText, GitCompare, Calendar, PlusCircle, FolderKanban, Search } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'comparison' | 'chronology' | 'categories';
  setActiveTab: (tab: 'dashboard' | 'comparison' | 'chronology' | 'categories') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenUpload: () => void;
  docCount: number;
  categoryCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenUpload,
  docCount,
  categoryCount,
}) => {
  return (
    <header className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-100 shadow-inner">
              <Layers className="w-5 h-5 text-zinc-300" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-zinc-100 tracking-tight flex items-center gap-2">
                사내 문서 비교 &amp; 관리 시스템
                <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full border border-zinc-700 font-normal">
                  Enterprise v2.4
                </span>
              </h1>
              <p className="text-xs text-zinc-400">
                문서 버전 관리 및 AI 차이점 분석 대시보드
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="문서 제목, 내용, 작성자 통합 검색..."
                className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-semibold rounded-lg shadow-sm transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>새 문서 업로드</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 border-t border-zinc-900 pt-2 pb-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'dashboard'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>문서 대시보드 ({docCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'comparison'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>AI 문서 비교실</span>
          </button>

          <button
            onClick={() => setActiveTab('chronology')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'chronology'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>저장일 전·후 타임라인</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'categories'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>카테고리 관리 ({categoryCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
