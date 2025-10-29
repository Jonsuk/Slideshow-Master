
import React, { useState, useEffect } from 'react';
import { MediaFile, OverlayOptions } from '../types';

interface TextEditModalProps {
  mediaFile: MediaFile;
  onSave: (id: string, options: OverlayOptions) => void;
  onClose: () => void;
}

const TextEditModal: React.FC<TextEditModalProps> = ({ mediaFile, onSave, onClose }) => {
  const [text, setText] = useState(mediaFile.overlayOptions?.text || '');
  const [color, setColor] = useState(mediaFile.overlayOptions?.color || '#FFFFFF');
  const [fontSize, setFontSize] = useState(mediaFile.overlayOptions?.fontSize || 24);

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
    onSave(mediaFile.id, { text, color, fontSize });
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
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-bold text-cyan-300">Edit Overlay Text</h2>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-32 p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
          placeholder="Enter your caption here..."
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="font-color" className="text-sm font-medium text-gray-300 mb-2">Font Color</label>
            <div className="relative">
              <input
                id="font-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md cursor-pointer"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none font-mono text-sm uppercase">{color}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="font-size" className="text-sm font-medium text-gray-300 mb-2">Font Size ({fontSize}px)</label>
            <input
              id="font-size"
              type="range"
              min="12"
              max="72"
              step="1"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full h-10 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextEditModal;