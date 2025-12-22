import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { documentsApi, Document } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Modal from './Modal';
import DataTable from './DataTable';
import { Plus, FileText, Download, Trash2, Eye, File, FileSpreadsheet, Upload, Loader2 } from 'lucide-react';

interface DocumentsPageProps {
  role: UserRole;
}

const DocumentsPage: React.FC<DocumentsPageProps> = ({ role }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    associated_entity: ''
  });
  const { toast } = useToast();

  const canModify = role === 'admin' || role === 'hr';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await documentsApi.getAll();
      if (response.data) setDocuments(response.data);
      if (response.error) {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    setIsSubmitting(true);
    try {
      const docType = formData.link.endsWith('.pdf') ? 'pdf' : 
                      formData.link.endsWith('.xls') || formData.link.endsWith('.xlsx') ? 'xls' :
                      formData.link.endsWith('.doc') || formData.link.endsWith('.docx') ? 'doc' : 'other';
      
      const response = await documentsApi.create({
        title: formData.title,
        link: formData.link,
        uploaded_by: 'Current User',
        associated_entity: formData.associated_entity,
        upload_date: new Date().toISOString().split('T')[0],
        type: docType
      });
      
      if (response.error) {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Document uploaded successfully' });
        fetchData();
        setShowAddModal(false);
        resetForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDocument) return;
    
    setIsSubmitting(true);
    try {
      const response = await documentsApi.delete(selectedDocument.id);
      
      if (response.error) {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Document deleted successfully' });
        fetchData();
        setShowDeleteModal(false);
        setSelectedDocument(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', link: '', associated_entity: '' });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText size={20} className="text-red-400" />;
      case 'xls': return <FileSpreadsheet size={20} className="text-green-400" />;
      case 'doc': return <File size={20} className="text-blue-400" />;
      default: return <File size={20} className="text-gray-400" />;
    }
  };

  const entities = ['HR', 'Finance', 'Engineering', 'Marketing', 'Sales', 'Management', 'Operations'];

  const columns = [
    {
      key: 'title',
      label: 'Document',
      sortable: true,
      render: (doc: Document) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1E3A5F] flex items-center justify-center">
            {getFileIcon(doc.type)}
          </div>
          <div>
            <p className="font-medium text-white">{doc.title}</p>
            <p className="text-xs text-gray-400">{doc.type.toUpperCase()}</p>
          </div>
        </div>
      )
    },
    { key: 'associated_entity', label: 'Department', sortable: true },
    { key: 'uploaded_by', label: 'Uploaded By', sortable: true },
    { key: 'upload_date', label: 'Date', sortable: true }
  ];

  const actions = (doc: Document) => (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          window.open(doc.link, '_blank');
        }}
        className="p-2 rounded-lg hover:bg-[#1E3A5F] text-gray-400 hover:text-[#D4AF37] transition-colors"
        title="View"
      >
        <Eye size={16} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toast({ title: 'Download started', description: `Downloading ${doc.title}` });
        }}
        className="p-2 rounded-lg hover:bg-[#1E3A5F] text-gray-400 hover:text-blue-400 transition-colors"
        title="Download"
      >
        <Download size={16} />
      </button>
      {canModify && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedDocument(doc);
            setShowDeleteModal(true);
          }}
          className="p-2 rounded-lg hover:bg-[#1E3A5F] text-gray-400 hover:text-red-400 transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      )}
    </>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Documents</h1>
          <p className="text-gray-400">Company documents and resources</p>
        </div>
        {canModify && (
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A1929] font-semibold rounded-xl hover:from-[#E5C04A] hover:to-[#D4AF37] transition-all"
          >
            <Upload size={20} />
            Upload Document
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{documents.length}</p>
          <p className="text-sm text-gray-400">Total Documents</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-2xl font-bold text-red-400">{documents.filter(d => d.type === 'pdf').length}</p>
          <p className="text-sm text-gray-400">PDF Files</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-2xl font-bold text-green-400">{documents.filter(d => d.type === 'xls').length}</p>
          <p className="text-sm text-gray-400">Spreadsheets</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-2xl font-bold text-blue-400">{documents.filter(d => d.type === 'doc').length}</p>
          <p className="text-sm text-gray-400">Documents</p>
        </div>
      </div>

      {/* Quick Access */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-[#0F2744] border border-[#2D4A6F] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Access</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {documents.slice(0, 4).map(doc => (
            <button
              key={doc.id}
              onClick={() => window.open(doc.link, '_blank')}
              className="p-4 bg-[#0A1929] border border-[#1E3A5F] rounded-xl hover:border-[#D4AF37]/50 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-[#1E3A5F] flex items-center justify-center mb-3">
                {getFileIcon(doc.type)}
              </div>
              <p className="text-sm font-medium text-white truncate">{doc.title}</p>
              <p className="text-xs text-gray-400">{doc.associated_entity}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={documents}
        columns={columns}
        actions={actions}
        searchPlaceholder="Search documents..."
      />

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Upload Document"
        size="md"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Document Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Document Link/URL</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="/docs/filename.pdf"
              className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Associated Department</label>
            <select
              value={formData.associated_entity}
              onChange={(e) => setFormData({ ...formData, associated_entity: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
              required
            >
              <option value="">Select department</option>
              {entities.map(entity => (
                <option key={entity} value={entity}>{entity}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              className="px-4 py-2.5 border border-[#1E3A5F] text-gray-300 rounded-xl hover:bg-[#1E3A5F] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A1929] font-semibold rounded-xl hover:from-[#E5C04A] hover:to-[#D4AF37] transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Upload
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedDocument(null);
        }}
        title="Delete Document"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete <span className="text-white font-medium">{selectedDocument?.title}</span>?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedDocument(null);
              }}
              className="px-4 py-2.5 border border-[#1E3A5F] text-gray-300 rounded-xl hover:bg-[#1E3A5F] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentsPage;
