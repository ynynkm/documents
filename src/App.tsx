/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Category, DocumentItem, FileType } from './types';
import { initialCategories, initialDocuments } from './data/mockData';
import { Navbar } from './components/Navbar';
import { CategoryManager } from './components/CategoryManager';
import { DocumentList } from './components/DocumentList';
import { UploadModal } from './components/UploadModal';
import { DocumentDetailModal } from './components/DocumentDetailModal';
import { ComparisonStudio } from './components/ComparisonStudio';
import { ChronologyTimeline } from './components/ChronologyTimeline';

export default function App() {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('enterprise_doc_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('enterprise_doc_items');
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'comparison' | 'chronology' | 'categories'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDocForDetail, setSelectedDocForDetail] = useState<DocumentItem | null>(null);
  
  // For comparison tab pre-selection
  const [compareDocAId, setCompareDocAId] = useState<string | undefined>(undefined);
  const [compareDocBId, setCompareDocBId] = useState<string | undefined>(undefined);

  useEffect(() => {
    localStorage.setItem('enterprise_doc_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('enterprise_doc_items', JSON.stringify(documents));
  }, [documents]);

  // Category Handlers
  const handleAddCategory = (name: string, description: string) => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      description,
    };
    setCategories([...categories, newCat]);
  };

  const handleUpdateCategory = (id: string, name: string, description: string) => {
    setCategories(
      categories.map((c) => (c.id === id ? { ...c, name, description } : c))
    );
  };

  const handleDeleteCategory = (id: string) => {
    if (documents.some((d) => d.categoryId === id)) {
      alert('해당 카테고리에 속한 문서가 존재합니다. 문서를 먼저 이동하거나 삭제해주세요.');
      return;
    }
    setCategories(categories.filter((c) => c.id !== id));
  };

  // Document Handlers
  const handleUploadDocument = (docData: {
    title: string;
    fileType: FileType;
    categoryId: string;
    saveDate: string;
    version: string;
    author: string;
    content: string;
    memo: string;
    fileSize: string;
  }) => {
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      ...docData,
    };
    setDocuments([newDoc, ...documents]);
  };

  const handleDeleteDocument = (id: string) => {
    if (window.confirm('정말 이 문서를 삭제하시겠습니까?')) {
      setDocuments(documents.filter((d) => d.id !== id));
      if (selectedDocForDetail?.id === id) {
        setSelectedDocForDetail(null);
      }
    }
  };

  const handleUpdateMemo = (docId: string, newMemo: string) => {
    setDocuments(
      documents.map((d) => (d.id === docId ? { ...d, memo: newMemo } : d))
    );
    if (selectedDocForDetail && selectedDocForDetail.id === docId) {
      setSelectedDocForDetail({ ...selectedDocForDetail, memo: newMemo });
    }
  };

  const handleSelectForCompare = (docId: string) => {
    if (!compareDocAId) {
      setCompareDocAId(docId);
    } else if (!compareDocBId && compareDocAId !== docId) {
      setCompareDocBId(docId);
    } else {
      setCompareDocAId(compareDocId => compareDocId || docId);
      setCompareDocBId(docId);
    }
    setActiveTab('comparison');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-zinc-100">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenUpload={() => setIsUploadOpen(true)}
        docCount={documents.length}
        categoryCount={categories.length}
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DocumentList
            documents={documents}
            categories={categories}
            searchQuery={searchQuery}
            onSelectDoc={(doc) => setSelectedDocForDetail(doc)}
            onCompareSelect={handleSelectForCompare}
            onDeleteDoc={handleDeleteDocument}
          />
        )}

        {activeTab === 'comparison' && (
          <ComparisonStudio
            documents={documents}
            categories={categories}
            initialDocAId={compareDocAId}
            initialDocBId={compareDocBId}
          />
        )}

        {activeTab === 'chronology' && (
          <ChronologyTimeline
            documents={documents}
            categories={categories}
            onSelectDoc={(doc) => setSelectedDocForDetail(doc)}
            onCompareSelect={handleSelectForCompare}
          />
        )}

        {activeTab === 'categories' && (
          <CategoryManager
            categories={categories}
            documents={documents}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        categories={categories}
        onUploadDocument={handleUploadDocument}
      />

      {/* Document Detail & Memo Modal */}
      <DocumentDetailModal
        document={selectedDocForDetail}
        categories={categories}
        onClose={() => setSelectedDocForDetail(null)}
        onUpdateMemo={handleUpdateMemo}
        onSelectForCompare={handleSelectForCompare}
      />
    </div>
  );
}
