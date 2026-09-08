import React, { useState } from 'react';
import { DocumentItem, Category } from '../types';
import { X, FileText, Calendar, User, Tag, Edit3, Save, Sparkles, CheckCircle2 } from 'lucide-react';

interface DocumentDetailModalProps {
  document: DocumentItem | null;
  categories: Category[];
  onClose: () => void;
  onUpdateMemo: (docId: string, newMemo: string) => void;
  onSelectForCompare: (docId: string) => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document,
  categories,
  onClose,
  onUpdateMemo,
  onSelectForCompare,
}) => {
  if (!document) return null;

  const [memo, setMemo] = useState(document.memo);
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(document.aiAnalysis || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const category = categories.find((c) => c.id === document.categoryId);

  const handleSaveMemo = () => {
    onUpdateMemo(document.id, memo);
    setIsEditingMemo(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: document.title, content: document.content }),
      });
      const data = await res.json();
      if (data.analysis) {
        setAiAnalysis(data.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getFileTypeBadge = (type: string) => {
    switch (type) {
      case 'word':
        return <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-xs font-medium border border-zinc-700">워드 (.docx)</span>;
      case 'hwp':
        return <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-xs font-medium border border-zinc-700">한글 (.hwp)</span>;
      case 'pdf':
        return <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-xs font-medium border border-zinc-700">PDF (.pdf)</span>;
      default:
        return <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-xs font-medium border border-zinc-700">{type}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-zinc-100">{document.title}</h3>
                {getFileTypeBadge(document.fileType)}
                <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-xs font-mono">{document.version}</span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                카테고리: <strong className="text-zinc-200">{category?.name || '미분류'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onSelectForCompare(document.id);
                onClose();
              }}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg border border-zinc-700 transition"
            >
              이 문서로 비교하기
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-zinc-500" />
              <div>
                <p className="text-[11px] text-zinc-500 font-medium">저장일 (기준일)</p>
                <p className="text-xs font-bold text-zinc-200">{document.saveDate}</p>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex items-center space-x-3">
              <User className="w-4 h-4 text-zinc-500" />
              <div>
                <p className="text-[11px] text-zinc-500 font-medium">작성자</p>
                <p className="text-xs font-bold text-zinc-200">{document.author}</p>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex items-center space-x-3">
              <Tag className="w-4 h-4 text-zinc-500" />
              <div>
                <p className="text-[11px] text-zinc-500 font-medium">용량 / 파일</p>
                <p className="text-xs font-bold text-zinc-200">{document.fileSize || '1.5 MB'}</p>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex items-center space-x-3">
              <FileText className="w-4 h-4 text-zinc-500" />
              <div>
                <p className="text-[11px] text-zinc-500 font-medium">버전 정보</p>
                <p className="text-xs font-bold text-zinc-200">{document.version}</p>
              </div>
            </div>
          </div>

          {/* AI Analysis Box */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-zinc-200 text-sm font-semibold">
                <Sparkles className="w-4 h-4 text-zinc-400" />
                <span>AI 문서 요약 및 인사이트</span>
              </div>
              <button
                onClick={handleRunAiAnalysis}
                disabled={isAnalyzing}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-lg border border-zinc-700 transition flex items-center space-x-1"
              >
                {isAnalyzing ? <span>분석 중...</span> : <span>AI 재분석</span>}
              </button>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {aiAnalysis || '아직 AI 분석이 실행되지 않았습니다. [AI 재분석] 버튼을 눌러주세요.'}
            </p>
          </div>

          {/* Memo / Notes Section (필수 요구사항: 각 문서에 메모 작성 가능) */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-zinc-200 text-sm font-semibold">
                <Edit3 className="w-4 h-4 text-zinc-400" />
                <span>문서 메모 및 특이사항 작성</span>
              </div>
              <div className="flex items-center space-x-2">
                {savedSuccess && (
                  <span className="text-xs text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>저장됨</span>
                  </span>
                )}
                {isEditingMemo ? (
                  <button
                    onClick={handleSaveMemo}
                    className="px-3 py-1 bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-semibold rounded-lg transition flex items-center space-x-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>메모 저장</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingMemo(true)}
                    className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-lg border border-zinc-700 transition"
                  >
                    메모 수정
                  </button>
                )}
              </div>
            </div>

            {isEditingMemo ? (
              <textarea
                rows={3}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="이 문서에 대한 검토 의견, 메모, 특이사항을 자유롭게 작성하세요..."
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-zinc-500"
              />
            ) : (
              <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800/80 text-xs text-zinc-300 min-h-[44px] whitespace-pre-wrap">
                {memo || '작성된 메모가 없습니다. [메모 수정]을 눌러 메모를 남겨보세요.'}
              </div>
            )}
          </div>

          {/* Document Main Content */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">문서 본문 내용</h4>
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
              {document.content}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 flex justify-end bg-zinc-950">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
