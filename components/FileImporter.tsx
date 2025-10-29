import React, { useRef } from 'react';
import { MediaFile } from '../types';

interface FileImporterProps {
  setVisualMedia: React.Dispatch<React.SetStateAction<MediaFile[]>>;
  setAudioFile: React.Dispatch<React.SetStateAction<MediaFile | null>>;
}

const FileImporter: React.FC<FileImporterProps> = ({ setVisualMedia, setAudioFile }) => {
  const visualInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleVisualFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newMediaFiles: MediaFile[] = [];
      for (const file of files) {
          const type = file.type.startsWith('image') ? 'image' : 'video';
          newMediaFiles.push({
            id: crypto.randomUUID(),
            file,
            src: URL.createObjectURL(file),
            type,
          });
      }
      setVisualMedia((prev) => [...prev, ...newMediaFiles]);
    }
  };

  const handleAudioFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile({
        id: crypto.randomUUID(),
        file,
        src: URL.createObjectURL(file),
        type: 'audio',
      });
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-cyan-300 border-b border-gray-600 pb-2">Import Media</h2>
      <button
        onClick={() => visualInputRef.current?.click()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
        <span>Add Images/Videos</span>
      </button>
      <input
        type="file"
        ref={visualInputRef}
        onChange={handleVisualFileChange}
        accept="image/*,video/*"
        multiple
        className="hidden"
      />

      <button
        onClick={() => audioInputRef.current?.click()}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M18 3a1 1 0 00-1.196-.98l-15 2A1 1 0 001 5v8a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1zM4 6h12v1H4V6zm0 2h12v1H4V8zm0 2h12v1H4v-1z" />
        </svg>
        <span>Add Music</span>
      </button>
      <input
        type="file"
        ref={audioInputRef}
        onChange={handleAudioFileChange}
        accept="audio/*"
        className="hidden"
      />
    </div>
  );
};

export default FileImporter;