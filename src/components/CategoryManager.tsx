import React, { useState } from 'react';
import { Category, DocumentItem } from '../types';
import { Folder, Plus, Trash2, Edit2, FileText, Check, X } from 'lucide-react';

interface CategoryManagerProps {
  categories: Category[];
  documents: DocumentItem[];
  onAddCategory: (name: string, description: string) => void;
  onUpdateCategory: (id: string, name: string, description: string) => void;
  onDeleteCategory: (id: string) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  documents,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddCategory(name.trim(), description.trim());
    setName('');
    setDescription('');
    setIsCreating(false);
  };

  const handleUpdate = (id: string) => {
    if (!name.trim()) return;
    onUpdateCategory(id, name.trim(), description.trim());
    setEditingId(null);
    setName('');
    setDescription('');
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">사내 문서 카테고리 관리</h2>
          <p className="text-sm text-zinc-400 mt-1">
            부서별, 업무별로 카테고리를 생성하고 여러 문서를 체계적으로 분류하여 관리합니다.
          </p>
        </div>
        {!isCreating && (
          <button
            onClick={() => {
              setIsCreating(true);
              setName('');
              setDescription('');
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-semibold rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>새 카테고리 추가</span>
          </button>
        )}
      </div>

      {/* New Category Form Modal / Card */}
      {isCreating && (
        <form onSubmit={handleCreate} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 shadow-lg">
          <h3 className="text-base font-semibold text-zinc-200">새 카테고리 생성</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">카테고리명</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 재무/회계 규정"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">설명</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="카테고리에 대한 간단한 설명"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg transition"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-semibold rounded-lg transition"
            >
              저장하기
            </button>
          </div>
        </form>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const catDocs = documents.filter((d) => d.categoryId === cat.id);
          const isEditing = editingId === cat.id;

          return (
            <div
              key={cat.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between hover:border-zinc-700 transition group shadow-sm"
            >
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-zinc-200"
                  />
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-zinc-200"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleUpdate(cat.id)}
                      className="p-1.5 bg-zinc-100 text-zinc-900 rounded-lg hover:bg-white"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                          <Folder className="w-4 h-4" />
                        </div>
                        <h3 className="text-base font-semibold text-zinc-100">{cat.name}</h3>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => startEdit(cat)}
                          className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition"
                          title="수정"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteCategory(cat.id)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-zinc-800 rounded-lg transition"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400 mb-4">{cat.description || '설명이 없습니다.'}</p>
                  </div>

                  <div className="border-t border-zinc-800/80 pt-4 flex items-center justify-between text-xs text-zinc-400">
                    <div className="flex items-center space-x-1.5">
                      <FileText className="w-4 h-4 text-zinc-500" />
                      <span>포함된 문서: <strong className="text-zinc-200">{catDocs.length}건</strong></span>
                    </div>
                    <span className="text-zinc-500 font-mono">ID: {cat.id}</span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
