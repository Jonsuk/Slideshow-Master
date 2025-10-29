
import React, { useState, useEffect } from 'react';
import { MediaFile, SlideEffect } from '../types';

interface SlideshowPlayerProps {
  mediaFile: MediaFile | null;
  effect: SlideEffect;
  isPlaying: boolean;
  imageFit: 'contain' | 'cover';
  slideIndex: number;
  slideDuration: number;
}

const SlideshowPlayer: React.FC<SlideshowPlayerProps> = ({ mediaFile, effect, isPlaying, imageFit, slideIndex, slideDuration }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(Date.now());

  useEffect(() => {
    setKey(Date.now());
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 500);
    return () => clearTimeout(timer);
  }, [mediaFile]);

  const getEffectClasses = () => {
    const baseTransition = 'transition-all duration-500 ease-in-out';
    if (effect === SlideEffect.KenBurns) return `${baseTransition} ${isTransitioning ? 'opacity-0' : 'opacity-100'}`;
    switch (effect) {
      case SlideEffect.Fade:
        return `${baseTransition} ${isTransitioning ? 'opacity-0' : 'opacity-100'}`;
      case SlideEffect.Slide:
        return `${baseTransition} ${isTransitioning ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`;
      case SlideEffect.Zoom:
        return `${baseTransition} ${isTransitioning ? 'scale-50 opacity-0' : 'scale-100 opacity-100'}`;
      case SlideEffect.Blur:
        return `${baseTransition} ${isTransitioning ? 'opacity-0 blur-md' : 'opacity-100 blur-0'}`;
      case SlideEffect.Flip:
        return `${baseTransition} ${isTransitioning ? 'rotate-y-90 opacity-0' : 'rotate-y-0 opacity-100'}`;
      case SlideEffect.Rotate:
        return `${baseTransition} ${isTransitioning ? 'scale-50 opacity-0 rotate-[-45deg]' : 'scale-100 opacity-100 rotate-0'}`;
      default:
        return '';
    }
  };

  const renderMedia = () => {
    if (!mediaFile) return null;

    const isKenBurns = effect === SlideEffect.KenBurns;
    const objectFitClass = imageFit === 'contain' ? 'object-contain' : 'object-cover';
    const dramaticClass = mediaFile.isDramatic ? 'dramatic-flicker' : '';

    const mediaElement = mediaFile.type === 'image' ? (
        <img 
          src={mediaFile.src} 
          alt={mediaFile.file.name} 
          className={`w-full h-full ${objectFitClass} ${dramaticClass}`} 
        />
      ) : (
        <video 
          key={mediaFile.src}
          src={mediaFile.src} 
          className={`w-full h-full ${objectFitClass} ${dramaticClass}`}
          autoPlay={isPlaying}
          muted 
          loop
        />
      );

    if (isKenBurns) {
        const kenBurnsClass = `kenburns-${(slideIndex % 4) + 1}`;
        return (
            <div className="w-full h-full overflow-hidden">
                <div 
                  key={`${mediaFile.id}-${slideDuration}-${imageFit}`}
                  className={`w-full h-full ${kenBurnsClass}`}
                  style={{ animationDuration: `${slideDuration}s` }}
                >
                    {mediaElement}
                </div>
            </div>
        );
    }
    
    return mediaElement;
  };

  if (!mediaFile) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-gray-400">
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-xl">Add images or videos to start</p>
        </div>
      </div>
    );
  }

  return (
    <div key={key} className={`w-full h-full flex items-center justify-center overflow-hidden relative ${getEffectClasses()}`}>
      {renderMedia()}
      {mediaFile.overlayText && (
        <div className="absolute bottom-5 left-5 right-5 p-3 bg-black/70 rounded-lg backdrop-blur-sm transition-opacity duration-500">
          <p className="text-white text-center text-lg md:text-xl lg:text-2xl font-semibold drop-shadow-lg">{mediaFile.overlayText}</p>
        </div>
      )}
    </div>
  );
};

export default SlideshowPlayer;
