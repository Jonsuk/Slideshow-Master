
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MediaFile, SlideEffect, OverlayOptions } from './types';
import FileImporter from './components/FileImporter';
import MediaGallery from './components/MediaGallery';
import SlideshowPlayer from './components/SlideshowPlayer';
import PlayerControls from './components/PlayerControls';
import TextEditModal from './components/TextEditModal';

export default function App() {
  const [visualMedia, setVisualMedia] = useState<MediaFile[]>([]);
  const [audioFile, setAudioFile] = useState<MediaFile | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [slideEffect, setSlideEffect] = useState<SlideEffect>(SlideEffect.Fade);
  const [imageFit, setImageFit] = useState<'contain' | 'cover'>('contain');
  const [slideDuration, setSlideDuration] = useState(5); // in seconds
  const [editingMediaFile, setEditingMediaFile] = useState<MediaFile | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const inactivityTimeoutRef = useRef<number | null>(null);

  const handleNextSlide = useCallback(() => {
    if (visualMedia.length > 1) {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % visualMedia.length);
    }
  }, [visualMedia.length]);

  const handlePrevSlide = () => {
    if (visualMedia.length > 1) {
      setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + visualMedia.length) % visualMedia.length);
    }
  };

  const handleMouseMove = useCallback(() => {
    if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    setShowControls(true);
    inactivityTimeoutRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, 1500);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!playerContainerRef.current) return;

    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const playerEl = playerContainerRef.current;
    if (!playerEl) return;

    if (isFullscreen) {
      handleMouseMove(); // Show controls and start timer on entering fullscreen
      playerEl.addEventListener('mousemove', handleMouseMove);
      return () => {
        playerEl.removeEventListener('mousemove', handleMouseMove);
      };
    } else {
      // Cleanup when exiting fullscreen
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      setShowControls(true);
    }
  }, [isFullscreen, handleMouseMove]);


  useEffect(() => {
    let timer: number | null = null;
    if (isPlaying && visualMedia.length > 1) {
      timer = window.setTimeout(handleNextSlide, slideDuration * 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentSlideIndex, slideDuration, handleNextSlide, visualMedia.length]);


  const handlePlayPause = () => {
    if(isPlaying) {
      if (audioRef.current) audioRef.current.pause();
    } else {
      if (visualMedia.length > 0 && audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      }
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleRemoveVisualMedia = (idToRemove: string) => {
    const indexToRemove = visualMedia.findIndex(m => m.id === idToRemove);
    if (indexToRemove === -1) return;

    setVisualMedia(prev => {
      const newMedia = prev.filter(media => media.id !== idToRemove);
      
      if (newMedia.length === 0) {
        setCurrentSlideIndex(0);
        setIsPlaying(false);
        if(audioRef.current) audioRef.current.pause();
      } else if (currentSlideIndex >= indexToRemove) {
        setCurrentSlideIndex(Math.max(0, currentSlideIndex -1));
      }
      
      return newMedia;
    });
  };

  const handleToggleDramatic = (idToToggle: string) => {
    setVisualMedia(prevMedia =>
      prevMedia.map(media =>
        media.id === idToToggle
          ? { ...media, isDramatic: !media.isDramatic }
          : media
      )
    );
  };

  const handleReorderMedia = useCallback((dragIndex: number, hoverIndex: number) => {
    setVisualMedia(prevMedia => {
      const draggedItem = prevMedia[dragIndex];
      const newMedia = [...prevMedia];
      newMedia.splice(dragIndex, 1);
      newMedia.splice(hoverIndex, 0, draggedItem);
      return newMedia;
    });
  }, []);

  const handleSaveOverlayOptions = (id: string, options: OverlayOptions) => {
    setVisualMedia(prevMedia =>
      prevMedia.map(media =>
        media.id === id ? { ...media, overlayOptions: options } : media
      )
    );
    setEditingMediaFile(null);
  };

  const currentMediaFile = visualMedia.length > 0 ? visualMedia[currentSlideIndex] : null;

  return (
    <div className="h-screen bg-gray-900 text-gray-200 font-sans flex flex-col overflow-hidden">
      {!isFullscreen && (
        <header className="bg-gray-800/50 backdrop-blur-sm p-4 shadow-lg flex justify-between items-center z-10 flex-shrink-0">
          <h1 className="text-2xl font-bold tracking-wider text-cyan-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Slideshow-Master
          </h1>
        </header>
      )}
      
      <main className={`flex flex-grow overflow-hidden ${isFullscreen ? 'p-0' : 'p-4 gap-4'}`}>
        {!isFullscreen && (
            <div className="flex flex-col w-1/4 min-w-[300px] bg-gray-800/70 rounded-lg p-4 space-y-4 overflow-y-auto">
              <FileImporter setVisualMedia={setVisualMedia} setAudioFile={setAudioFile} />
              <hr className="border-gray-600"/>
              <MediaGallery 
                mediaFiles={visualMedia} 
                onSelectSlide={setCurrentSlideIndex} 
                currentSlideIndex={currentSlideIndex}
                onRemoveMedia={handleRemoveVisualMedia}
                onToggleDramatic={handleToggleDramatic}
                onReorderMedia={handleReorderMedia}
                onEditText={setEditingMediaFile}
              />
            </div>
        )}

        <div 
          ref={playerContainerRef} 
          className={`flex flex-col flex-grow bg-black relative overflow-hidden ${!isFullscreen ? 'rounded-lg shadow-2xl' : ''}`} 
          style={{ perspective: '1000px' }}
        >
          <SlideshowPlayer 
            mediaFile={currentMediaFile} 
            effect={slideEffect} 
            isPlaying={isPlaying}
            imageFit={imageFit}
            slideIndex={currentSlideIndex}
            slideDuration={slideDuration}
          />
          <div className={`absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
             <PlayerControls 
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onPrev={handlePrevSlide}
              onNext={handleNextSlide}
              hasMedia={visualMedia.length > 0}
              slideEffect={slideEffect}
              onEffectChange={setSlideEffect}
              imageFit={imageFit}
              onImageFitChange={setImageFit}
              slideDuration={slideDuration}
              onSlideDurationChange={setSlideDuration}
              isFullscreen={isFullscreen}
              onToggleFullscreen={handleToggleFullscreen}
             />
          </div>
        </div>
      </main>

      {audioFile && <audio ref={audioRef} src={audioFile.src} loop />}
      {editingMediaFile && (
        <TextEditModal
          mediaFile={editingMediaFile}
          onSave={handleSaveOverlayOptions}
          onClose={() => setEditingMediaFile(null)}
        />
      )}
    </div>
  );
}