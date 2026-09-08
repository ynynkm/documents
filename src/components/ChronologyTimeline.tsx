import React, { useState } from 'react';
import { DocumentItem, Category } from '../types';
import { Calendar, FileText, ArrowRight, GitCompare, Tag, User } from 'lucide-react';

interface ChronologyTimelineProps {
  documents: DocumentItem[];
  categories: Category[];
  onSelectDoc: (doc: DocumentItem) => void;
  onCompareSelect: (docId: string) => void;
}

export const ChronologyTimeline: React.FC<ChronologyTimelineProps> = ({
  documents,
  categories,
  onSelectDoc,
  onCompareSelect,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter & sort chronologically by saveDate ascending (oldest first -> before/after sequence)
  const sortedDocs = [...documents]
    .filter((d) => selectedCategory === 'all' || d.categoryId === selectedCategory)
    .sort((a, b) => new Date(a.saveDate).getTime() - new Date(b.saveDate).getTime());

  const getFileTypeBadge = (type: string) => {
    switch (type) {
      case 'word':
        return <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[11px] font-medium border border-zinc-700">워드</span>;
      case 'hwp':
        return <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[11px] font-medium border border-zinc-700">한글</span>;
      case 'pdf':
        return <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[11px] font-medium border border-zinc-700">PDF</span>;
      default:
        return <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[11px] font-medium border border-zinc-700">{type}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-zinc-300" />
            <span>문서 저장일 기준 타임라인 (전·후 배치)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            등록된 문서들의 저장일(Save Date)을 기준으로 과거(전)부터 최신(후)까지의 개정 이력과 버전을 순서대로 배치하여 관리합니다.
          </p>
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 min-w-[200px]"
        >
          <option value="all">모든 카테고리 보기</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Timeline List */}
      {sortedDocs.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center space-y-2">
          <p className="text-sm text-zinc-400">조건에 해당하는 문서가 없습니다.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-zinc-800 ml-4 md:ml-8 space-y-8 py-4">
          {sortedDocs.map((doc, index) => {
            const cat = categories.find((c) => c.id === doc.categoryId);
            const isLatest = index === sortedDocs.length - 1;

            return (
              <div key={doc.id} className="relative pl-8 group">
                {/* Timeline Dot */}
                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-zinc-950 transition ${
                  isLatest ? 'bg-zinc-100 ring-4 ring-zinc-800' : 'bg-zinc-700'
                }`} />

                {/* Card */}
                <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 shadow-sm transition space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-300 rounded font-semibold">
                        순서 #{index + 1}
                      </span>
                      {getFileTypeBadge(doc.fileType)}
                      <span className="text-xs font-mono text-zinc-400 px-2 py-0.5 bg-zinc-950 rounded border border-zinc-800">
                        {doc.version}
                      </span>
                      {isLatest && (
                        <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full font-medium border border-zinc-700">
                          최신 버전 (After)
                        </span>
                      )}
                      {index === 0 && sortedDocs.length > 1 && (
                        <span className="text-[10px] bg-zinc-800/80 text-zinc-400 px-2 py-0.5 rounded-full font-medium border border-zinc-800">
                          기준 버전 (Before)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-zinc-400 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-zinc-200 font-bold">{doc.saveDate}</span>
                    </div>
                  </div>

                  <div>
                    <h3
                      onClick={() => onSelectDoc(doc)}
                      className="text-base font-bold text-zinc-100 hover:text-zinc-300 cursor-pointer transition mb-1"
                    >
                      {doc.title}
                    </h3>
                    <div className="flex items-center space-x-3 text-xs text-zinc-400 mb-3">
                      <span className="flex items-center space-x-1">
                        <Tag className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{cat?.name || '미분류'}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{doc.author}</span>
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 font-mono bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 line-clamp-2">
                      {doc.content}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                    <span className="text-xs text-zinc-500">
                      메모: {doc.memo ? <span className="text-zinc-300">{doc.memo}</span> : '없음'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onSelectDoc(doc)}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-lg transition"
                      >
                        상세 보기
                      </button>
                      <button
                        onClick={() => onCompareSelect(doc.id)}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-lg transition flex items-center space-x-1"
                      >
                        <GitCompare className="w-3.5 h-3.5" />
                        <span>비교하기</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
