import React, { useState } from 'react';
import { DocumentItem, Category } from '../types';
import { FileText, Calendar, User, Search, Eye, GitCompare, Trash2, Tag, ArrowUpDown } from 'lucide-react';

interface DocumentListProps {
  documents: DocumentItem[];
  categories: Category[];
  searchQuery: string;
  onSelectDoc: (doc: DocumentItem) => void;
  onCompareSelect: (docId: string) => void;
  onDeleteDoc: (id: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  categories,
  searchQuery,
  onSelectDoc,
  onCompareSelect,
  onDeleteDoc,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFileType, setSelectedFileType] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // 저장일 기준 정렬

  // Filter & Sort
  const filtered = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.memo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || doc.categoryId === selectedCategory;
    const matchesType = selectedFileType === 'all' || doc.fileType === selectedFileType;

    return matchesSearch && matchesCategory && matchesType;
  }).sort((a, b) => {
    const timeA = new Date(a.saveDate).getTime();
    const timeB = new Date(b.saveDate).getTime();
    return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
  });

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
    <div className="space-y-6 max-w-7xl mx-auto py-6">
      {/* Top Filter Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-zinc-100 text-zinc-900 font-semibold'
                : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            전체 카테고리 ({documents.length})
          </button>
          {categories.map((cat) => {
            const count = documents.filter((d) => d.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-zinc-100 text-zinc-900 font-semibold'
                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Filters & Sorting */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <select
            value={selectedFileType}
            onChange={(e) => setSelectedFileType(e.target.value)}
            className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-zinc-600"
          >
            <option value="all">모든 파일 형식</option>
            <option value="word">워드 (.docx)</option>
            <option value="hwp">한글 (.hwp)</option>
            <option value="pdf">PDF (.pdf)</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs text-zinc-300 transition"
            title="저장일 기준 정렬 변경"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <span>저장일 {sortOrder === 'desc' ? '최신순' : '과거순'}</span>
          </button>
        </div>
      </div>

      {/* Document Grid */}
      {filtered.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-zinc-200">등록된 문서가 없습니다</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            상단의 [새 문서 업로드] 버튼을 눌러 워드, 한글, PDF 등의 사내 문서를 추가하고 비교를 시작하세요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doc) => {
            const cat = categories.find((c) => c.id === doc.categoryId);

            return (
              <div
                key={doc.id}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 flex flex-col justify-between transition group shadow-sm"
              >
                <div>
                  {/* Top info */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getFileTypeBadge(doc.fileType)}
                      <span className="text-[11px] font-mono px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded">
                        {doc.version}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{doc.saveDate}</span>
                    </span>
                  </div>

                  {/* Title & Category */}
                  <h3
                    onClick={() => onSelectDoc(doc)}
                    className="text-base font-bold text-zinc-100 mb-1 group-hover:text-zinc-200 cursor-pointer line-clamp-1 transition"
                  >
                    {doc.title}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-xs text-zinc-400 mb-3">
                    <Tag className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{cat?.name || '미분류'}</span>
                    <span className="text-zinc-600">•</span>
                    <User className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{doc.author}</span>
                  </div>

                  {/* Content Preview */}
                  <p className="text-xs text-zinc-400 line-clamp-3 mb-4 bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 font-mono">
                    {doc.content}
                  </p>

                  {/* Memo preview if exists */}
                  {doc.memo && (
                    <div className="mb-4 text-[11px] text-zinc-300 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/50 flex items-start space-x-2">
                      <span className="font-semibold text-zinc-400 shrink-0">메모:</span>
                      <span className="line-clamp-1 text-zinc-300">{doc.memo}</span>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="border-t border-zinc-800 pt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSelectDoc(doc)}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>상세 및 메모</span>
                    </button>
                    <button
                      onClick={() => onCompareSelect(doc.id)}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition flex items-center space-x-1"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      <span>비교</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onDeleteDoc(doc.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition"
                    title="문서 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
