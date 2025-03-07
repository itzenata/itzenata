import React, { useState } from 'react';

interface DeleteJournalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  journalName: string;
}

const DeleteJournalDialog = ({
  isOpen,
  onClose,
  onConfirm,
  journalName
}: DeleteJournalDialogProps) => {
  const [confirmationText, setConfirmationText] = useState('');
  const isConfirmationValid = confirmationText === journalName;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center gap-2">
          <h2 className="text-xl font-semibold text-red-600">
            Supprimer le journal
          </h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Cette action est irréversible. Cela supprimera définitivement le
            journal
            <span className="font-semibold"> {journalName}</span> ainsi que
            toutes ses transactions associées.
          </p>

          <div className="space-y-2">
            <label
              htmlFor="confirmDelete"
              className="block text-sm font-medium text-gray-700"
            >
              Veuillez taper <span className="font-medium">{journalName}</span>{' '}
              pour confirmer
            </label>
            <input
              id="confirmDelete"
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Tapez le nom du journal pour confirmer"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={!isConfirmationValid}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Supprimer le journal
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteJournalDialog;
