export interface OverlayOptions {
  text: string;
  color: string;
  fontSize: number;
}

export interface MediaFile {
  id: string;
  file: File;
  src: string;
  type: 'image' | 'video' | 'audio';
  isDramatic?: boolean;
  overlayOptions?: OverlayOptions;
}

export enum SlideEffect {
  Fade = 'fade',
  Slide = 'slide',
  Zoom = 'zoom',
  Blur = 'blur',
  Flip = 'flip',
  Rotate = 'rotate',
  KenBurns = 'kenburns',
  None = 'none'
}