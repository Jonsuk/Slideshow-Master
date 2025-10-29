
import React from 'react';
import { MediaFile } from '../types';

interface MediaGalleryProps {
  mediaFiles: MediaFile[];
  onSelectSlide: (index: number) => void;
  currentSlideIndex: number;
  onRemoveMedia: (id: string) => void;
  onToggleDramatic: (id: string) => void;
  onReorderMedia: (dragIndex: number, hoverIndex: number) => void;
  onEditText: (mediaFile: MediaFile) => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ mediaFiles, onSelectSlide, currentSlideIndex, onRemoveMedia, onToggleDramatic, onReorderMedia, onEditText }) => {
  if (mediaFiles.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        Your media will appear here.
      </div>
    );
  }

  const handleRemoveClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onRemoveMedia(id);
  };

  const handleDramaticClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onToggleDramatic(id);
  };

  const handleEditTextClick = (e: React.MouseEvent, mediaFile: MediaFile) => {
    e.stopPropagation();
    onEditText(mediaFile);
  };
  
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ index }));
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("application/json"));
    const dragIndex = data.index;
    if (dragIndex !== dropIndex) {
      onReorderMedia(dragIndex, dropIndex);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // This is necessary to allow dropping
  };

  return (
    <div className="flex-grow overflow-y-auto">
        <h2 className="text-lg font-semibold text-cyan-300 border-b border-gray-600 pb-2 mb-3">Your Gallery</h2>
        <div className="grid grid-cols-2 gap-2">
        {mediaFiles.map((media, index) => (
            <div
              key={media.id}
              onClick={() => onSelectSlide(index)}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
              className={`relative rounded-md overflow-hidden cursor-pointer group transition-all duration-300 ${index === currentSlideIndex ? 'ring-4 ring-cyan-400' : 'ring-2 ring-transparent hover:ring-cyan-500'}`}
            >
              <div className="absolute top-1 right-1 z-10 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                      onClick={(e) => handleEditTextClick(e, media)}
                      className="p-1 rounded-full bg-black/50 text-white hover:bg-cyan-500 transition-colors duration-200"
                      aria-label="Edit text"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                      </svg>
                  </button>
                  <button
                      onClick={(e) => handleDramaticClick(e, media.id)}
                      className={`p-1 rounded-full transition-colors duration-200 ${media.isDramatic ? 'bg-yellow-500 text-gray-900' : 'bg-black/50 text-white hover:bg-yellow-400'}`}
                      aria-label="Toggle dramatic effect"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                  </button>
                  <button
                      onClick={(e) => handleRemoveClick(e, media.id)}
                      className="p-1 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors duration-200"
                      aria-label="Remove media"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                  </button>
              </div>
              {media.type === 'image' ? (
                  <img src={media.src} alt={media.file.name} className="w-full h-24 object-cover" />
              ) : (
                  <video src={media.src} className="w-full h-24 object-cover" />
              )}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
               {media.type === 'video' && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/80" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                  </div>
              )}
            </div>
        ))}
        </div>
    </div>
  );
};

export default MediaGallery;