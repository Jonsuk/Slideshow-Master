
import React from 'react';
import { SlideEffect } from '../types';

interface PlayerControlsProps {
    isPlaying: boolean;
    onPlayPause: () => void;
    onPrev: () => void;
    onNext: () => void;
    hasMedia: boolean;
    slideEffect: SlideEffect;
    onEffectChange: (effect: SlideEffect) => void;
    imageFit: 'contain' | 'cover';
    onImageFitChange: (fit: 'contain' | 'cover') => void;
    slideDuration: number;
    onSlideDurationChange: (duration: number) => void;
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
    isPlaying,
    onPlayPause,
    onPrev,
    onNext,
    hasMedia,
    slideEffect,
    onEffectChange,
    imageFit,
    onImageFitChange,
    slideDuration,
    onSlideDurationChange,
    isFullscreen,
    onToggleFullscreen,
}) => {
    return (
        <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <label htmlFor="effect-select" className="text-sm font-medium text-gray-300">Effect:</label>
                    <select 
                        id="effect-select"
                        value={slideEffect}
                        onChange={(e) => onEffectChange(e.target.value as SlideEffect)}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2"
                        disabled={!hasMedia}
                    >
                        <option value={SlideEffect.Fade}>Fade</option>
                        <option value={SlideEffect.Slide}>Slide</option>
                        <option value={SlideEffect.Zoom}>Zoom</option>
                        <option value={SlideEffect.Blur}>Blur</option>
                        <option value={SlideEffect.Flip}>Flip</option>
                        <option value={SlideEffect.Rotate}>Rotate</option>
                        <option value={SlideEffect.KenBurns}>Ken Burns</option>
                        <option value={SlideEffect.None}>None</option>
                    </select>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={onPrev} disabled={!hasMedia} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={onPlayPause} disabled={!hasMedia} className="p-3 rounded-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:scale-110">
                        {isPlaying ? 
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        }
                    </button>
                    <button onClick={onNext} disabled={!hasMedia} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => onImageFitChange('contain')} 
                        disabled={!hasMedia} 
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${imageFit === 'contain' ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        Fit
                    </button>
                    <button 
                        onClick={() => onImageFitChange('cover')} 
                        disabled={!hasMedia} 
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${imageFit === 'cover' ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        Fill
                    </button>
                    <button 
                        onClick={onToggleFullscreen}
                        className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    >
                        {isFullscreen ? (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zm-3-12V5h3v3h2V5h-5z"/>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
            <div className="flex items-center space-x-3 pt-2">
                <label htmlFor="duration-slider" className="text-sm font-medium text-gray-300">Duration:</label>
                <input
                    id="duration-slider"
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={slideDuration}
                    onChange={(e) => onSlideDurationChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    disabled={!hasMedia}
                />
                <span className="text-sm font-mono w-12 text-center bg-gray-700 rounded-md py-1">{slideDuration}s</span>
            </div>
        </div>
    );
};

export default PlayerControls;
