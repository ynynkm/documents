import React, { useState } from 'react';
import { DocumentItem, Category, DiffResult } from '../types';
import { GitCompare, Sparkles, ArrowRight, CheckCircle2, AlertCircle, FileText, Calendar, RotateCcw } from 'lucide-react';

interface ComparisonStudioProps {
  documents: DocumentItem[];
  categories: Category[];
  initialDocAId?: string;
  initialDocBId?: string;
}

export const ComparisonStudio: React.FC<ComparisonStudioProps> = ({
  documents,
  categories,
  initialDocAId,
  initialDocBId,
}) => {
  const [docAId, setDocAId] = useState<string>(
    initialDocAId || (documents[0] ? documents[0].id : '')
  );
  const [docBId, setDocBId] = useState<string>(
    initialDocBId || (documents[1] ? documents[1].id : documents[0] ? documents[0].id : '')
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const docA = documents.find((d) => d.id === docAId);
  const docB = documents.find((d) => d.id === docBId);

  const handleRunComparison = async () => {
    if (!docA || !docB) {
      setError('비교할 두 개의 문서를 모두 선택해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docA, docB }),
      });
      const data = await res.json();
      if (res.ok) {
        setDiffResult(data);
      } else {
        setError(data.error || '비교 분석 중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '서버 통신 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-6">
      {/* Header Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-zinc-300 text-sm font-semibold mb-1">
            <GitCompare className="w-5 h-5 text-zinc-300" />
            <span>AI 사내 문서 비교 스튜디오</span>
          </div>
          <p className="text-xs text-zinc-400">
            두 개의 문서를 선택하고 AI 비교 분석을 실행하면, 변경된 조항, 추가 및 삭제된 내용을 하나의 화면에서 대조할 수 있습니다.
          </p>
        </div>

        <button
          onClick={handleRunComparison}
          disabled={loading || !docA || !docB}
          className="px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-semibold rounded-xl shadow-md transition disabled:opacity-50 flex items-center space-x-2 shrink-0"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
              <span>AI 분석 중...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-zinc-900" />
              <span>AI 차이점 비교 분석 실행</span>
            </>
          )}
        </button>
      </div>

      {/* Document Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document A (Before / Reference) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
              <span>문서 A (기준 / 이전 버전)</span>
            </span>
            <select
              value={docAId}
              onChange={(e) => setDocAId(e.target.value)}
              className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 max-w-[220px]"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.version})
                </option>
              ))}
            </select>
          </div>

          {docA ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-bold text-zinc-200">{docA.title}</span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{docA.saveDate}</span>
                </span>
              </div>
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap h-64 overflow-y-auto">
                {docA.content}
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 py-12 text-center">문서를 선택해주세요.</p>
          )}
        </div>

        {/* Document B (After / Target) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-100"></span>
              <span>문서 B (비교 / 최신 버전)</span>
            </span>
            <select
              value={docBId}
              onChange={(e) => setDocBId(e.target.value)}
              className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 max-w-[220px]"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.version})
                </option>
              ))}
            </select>
          </div>

          {docB ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-bold text-zinc-200">{docB.title}</span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{docB.saveDate}</span>
                </span>
              </div>
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap h-64 overflow-y-auto">
                {docB.content}
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 py-12 text-center">문서를 선택해주세요.</p>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-rose-950/40 border border-rose-900/60 rounded-xl p-4 flex items-center space-x-3 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Comparison Results Section */}
      {diffResult && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-lg animate-fadeIn">
          {/* Summary & Similarity */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
            <div>
              <h3 className="text-sm font-bold text-zinc-100 flex items-center space-x-2 mb-1">
                <Sparkles className="w-4 h-4 text-zinc-400" />
                <span>AI 문서 차이점 종합 분석 결과</span>
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">{diffResult.summary}</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 flex items-center space-x-4 shrink-0">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">유사도 지수</p>
                <p className="text-lg font-bold text-zinc-100">{diffResult.similarityScore}%</p>
              </div>
              <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-300 rounded-full"
                  style={{ width: `${diffResult.similarityScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Additions & Deletions Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Additions */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>신규 추가된 항목 ({diffResult.additions?.length || 0})</span>
              </h4>
              <ul className="space-y-2">
                {diffResult.additions?.map((item, idx) => (
                  <li key={idx} className="text-xs text-zinc-200 bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-lg flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold shrink-0">+</span>
                    <span>{item}</span>
                  </li>
                ))}
                {(!diffResult.additions || diffResult.additions.length === 0) && (
                  <li className="text-xs text-zinc-500 italic">추가된 항목이 없습니다.</li>
                )}
              </ul>
            </div>

            {/* Deletions */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-rose-400 flex items-center space-x-1.5 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <span>삭제된 항목 ({diffResult.deletions?.length || 0})</span>
              </h4>
              <ul className="space-y-2">
                {diffResult.deletions?.map((item, idx) => (
                  <li key={idx} className="text-xs text-zinc-200 bg-rose-950/20 border border-rose-900/40 p-2.5 rounded-lg flex items-start space-x-2">
                    <span className="text-rose-400 font-bold shrink-0">-</span>
                    <span>{item}</span>
                  </li>
                ))}
                {(!diffResult.deletions || diffResult.deletions.length === 0) && (
                  <li className="text-xs text-zinc-500 italic">삭제된 항목이 없습니다.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Detailed Modifications Diff */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              조항별 상세 변경 대조표 (하이라이트 표시)
            </h4>
            <div className="space-y-3">
              {diffResult.modifications?.map((mod, idx) => (
                <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200 px-2.5 py-1 bg-zinc-900 rounded-lg border border-zinc-800">
                      {mod.section}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-amber-950/40 text-amber-300 border border-amber-900/50">
                      내용 수정됨
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-3 bg-rose-950/10 border border-rose-900/30 rounded-lg space-y-1">
                      <p className="text-[10px] text-rose-400 font-sans font-semibold uppercase">문서 A (변경 전)</p>
                      <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{mod.oldText}</p>
                    </div>

                    <div className="p-3 bg-emerald-950/10 border border-emerald-900/30 rounded-lg space-y-1">
                      <p className="text-[10px] text-emerald-400 font-sans font-semibold uppercase">문서 B (변경 후 - 하이라이트)</p>
                      <p className="text-zinc-100 font-medium leading-relaxed whitespace-pre-wrap bg-emerald-950/30 p-1 rounded">
                        {mod.newText}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
