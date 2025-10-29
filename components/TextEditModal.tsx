
import React, { useState, useEffect } from 'react';
import { MediaFile } from '../types';

interface TextEditModalProps {
  mediaFile: MediaFile;
  onSave: (id: string, text: string) => void;
  onClose: () => void;
}

const TextEditModal: React.FC<TextEditModalProps> = ({ mediaFile, onSave, onClose }) => {
  const [text, setText] = useState(mediaFile.overlayText || '');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSave = () => {
    onSave(mediaFile.id, text);
  };
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
          onClose();
      }
  }

  return (
    <div 
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black/70 z-30 flex items-center justify-center p-4"
    >
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-cyan-300 mb-4">Edit Overlay Text</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-32 p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
          placeholder="Enter your caption here..."
        />
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextEditModal;
