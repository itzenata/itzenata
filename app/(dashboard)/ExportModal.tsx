import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { File, ChevronDown } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (title: string, format: 'pdf' | 'xlsx') => void;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport
}) => {
  const [title, setTitle] = useState('');
  const [format, setFormat] = useState<'pdf' | 'xlsx'>('pdf');
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleExport = () => {
    if (title.trim() === '') {
      setError('Veuillez entrer un titre pour le document.');
      return;
    }
    setError('');
    onExport(title, format);
    onClose();
    setTitle('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setDropdownOpen(!dropdownOpen);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl">
        {/* Content Section */}
        <div className="p-6">
          <div className="mb-6 flex items-center gap-2">
            <File className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Exporter le document
            </h2>
          </div>
          <p className="mb-4 text-sm text-gray-600">
            Entrez un titre et sélectionnez le format pour votre document.
          </p>
          <div className="mb-4">
            <label
              htmlFor="documentTitle"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Titre du document
            </label>
            <input
              id="documentTitle"
              type="text"
              placeholder="Mon document"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          {/* Custom Select Dropdown with adjusted z-index */}
          <div className="relative mb-20" ref={dropdownRef}>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Format d'export
            </label>
            <div
              role="button"
              tabIndex={0}
              className="relative w-full cursor-pointer rounded-md border border-gray-300 px-3 py-2 flex items-center justify-between text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onKeyDown={handleKeyDown}
            >
              {format === 'pdf' ? 'PDF' : 'Excel (XLSX)'}
              <ChevronDown
                className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
                  dropdownOpen ? 'transform rotate-180' : ''
                }`}
              />
            </div>
            {dropdownOpen && (
              <ul
                className="absolute left-0 right-0 z-20 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg"
                role="listbox"
              >
                <li
                  role="option"
                  aria-selected={format === 'pdf'}
                  className={`cursor-pointer px-3 py-2 hover:bg-gray-100 ${
                    format === 'pdf' ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => {
                    setFormat('pdf');
                    setDropdownOpen(false);
                  }}
                >
                  PDF
                </li>
                <li
                  role="option"
                  aria-selected={format === 'xlsx'}
                  className={`cursor-pointer px-3 py-2 hover:bg-gray-100 ${
                    format === 'xlsx' ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => {
                    setFormat('xlsx');
                    setDropdownOpen(false);
                  }}
                >
                  Excel (XLSX)
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Footer Section with higher z-index */}
        <div className="relative z-30 px-6 py-4 bg-gray-50 rounded-b-lg border-t border-gray-100 flex justify-end gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-white hover:bg-gray-50"
          >
            Annuler
          </Button>
          <Button
            onClick={handleExport}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Exporter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
