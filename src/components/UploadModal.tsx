import React, { useState } from 'react';
import { Category, FileType } from '../types';
import { X, Upload, FileText } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onUploadDocument: (doc: {
    title: string;
    fileType: FileType;
    categoryId: string;
    saveDate: string;
    version: string;
    author: string;
    content: string;
    memo: string;
    fileSize: string;
  }) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  categories,
  onUploadDocument,
}) => {
  const [title, setTitle] = useState('');
  const [fileType, setFileType] = useState<FileType>('word');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [saveDate, setSaveDate] = useState(new Date().toISOString().split('T')[0]);
  const [version, setVersion] = useState('v1.0');
  const [author, setAuthor] = useState('홍길동 팀장');
  const [content, setContent] = useState('');
  const [memo, setMemo] = useState('');
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setTitle(file.name.replace(/\.[^/.]+$/, ""));
    
    // Auto-detect extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'hwp') setFileType('hwp');
    else if (ext === 'pdf') setFileType('pdf');
    else setFileType('word');

    // Read text if possible or simulate
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setContent(text);
      } else {
        setContent(`[${file.name} 업로드 완료 내용]\n본 문서의 자동 파싱된 본문 내용입니다. 사내 표준 규정에 따른 검토가 필요합니다.`);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onUploadDocument({
      title: title.trim(),
      fileType,
      categoryId: categoryId || categories[0]?.id || 'cat-1',
      saveDate,
      version: version.trim() || 'v1.0',
      author: author.trim() || '사내 임직원',
      content: content.trim(),
      memo: memo.trim(),
      fileSize: fileName ? '1.8 MB' : '1.2 MB',
    });

    // Reset & close
    setTitle('');
    setContent('');
    setMemo('');
    setFileName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-zinc-300" />
            <h3 className="text-base font-bold text-zinc-100">새 문서 업로드 및 등록</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* File Upload Dropzone */}
          <div className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-xl p-6 text-center bg-zinc-950 transition relative">
            <input
              type="file"
              accept=".docx,.doc,.hwp,.pdf,.txt"
              onChange={handleSimulatedFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-zinc-200">
                {fileName ? <span className="text-emerald-400 font-semibold">{fileName} 선택됨</span> : '파일을 드래그하여 업로드하거나 클릭하세요'}
              </p>
              <p className="text-xs text-zinc-500">
                지원 형식: 워드(.docx), 한글(.hwp), PDF(.pdf), 텍스트(.txt)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">문서 제목 *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 보안 규정 개정안 v1.2"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">파일 종류</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as FileType)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
              >
                <option value="word">워드 (.docx)</option>
                <option value="hwp">한글 (.hwp)</option>
                <option value="pdf">PDF (.pdf)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">카테고리</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">저장일 (기준일) *</label>
              <input
                type="date"
                required
                value={saveDate}
                onChange={(e) => setSaveDate(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">버전</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="v1.0"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">작성자 / 부서</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="예: 경영기획팀 김철수"
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">문서 본문 내용 *</label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="문서의 본문 내용 또는 조항을 입력하거나 파일을 업로드하세요..."
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">초기 메모 / 특이사항</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="문서 관련 메모를 남기세요..."
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg transition"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-semibold rounded-lg transition shadow-sm"
            >
              문서 등록 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
