import React from 'react';
import { HIP_HOP_PHOTOS } from '../types/agent';
import { Disc3 } from 'lucide-react';

interface PhotoHeroProps {
  photoIndex: number;
  onSelectPhoto?: (index: number) => void;
  trackTitle?: string;
  recipient?: string;
  isBeatPlaying?: boolean;
}

export const PhotoHero: React.FC<PhotoHeroProps> = ({
  photoIndex,
  onSelectPhoto,
  trackTitle,
  recipient,
  isBeatPlaying = false,
}) => {
  const currentPhoto = HIP_HOP_PHOTOS[photoIndex % HIP_HOP_PHOTOS.length];

  return (
    <div className="relative group overflow-hidden rounded-[28px] sm:rounded-[36px] border border-[#22334d] bg-[#121b2b] shadow-2xl">
      {/* 90s Film Photo Frame */}
      <div className="relative aspect-[4/5] sm:aspect-[16/10] max-h-[480px] w-full overflow-hidden bg-[#0c131f]">
        <img
          src={currentPhoto.src}
          alt={currentPhoto.alt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter contrast-105 saturate-110 transition-transform duration-700 group-hover:scale-102"
        />

        {/* Vintage film gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c131f] via-[#0c131f]/25 to-transparent opacity-90" />

        {/* Live Beat / Vinyl Indicator */}
        {isBeatPlaying && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e3554e] text-white font-bold text-xs shadow-lg animate-pulse">
            <Disc3 className="w-4 h-4 animate-spin text-white" style={{ animationDuration: '3s' }} />
            <span>90s Boom-Bap Playing</span>
          </div>
        )}

        {/* Track / Situation Overlay Banner at Bottom */}
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 z-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#cb902c] font-bold drop-shadow">
                {recipient ? `Notice to: ${recipient}` : 'Cathartic Fun Rapper (CFR)'}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-[#f5f1e8] tracking-tight font-display drop-shadow-md mt-0.5">
                {trackTitle || 'Turn Frustration Into Bars'}
              </h1>
              <p className="text-xs sm:text-sm text-[#d99bb2] drop-shadow mt-1 font-medium">
                {currentPhoto.tagline}
              </p>
            </div>

            {/* Photo selector dots */}
            {onSelectPhoto && (
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                {HIP_HOP_PHOTOS.map((photo, idx) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => onSelectPhoto(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      photoIndex === idx ? 'w-8 bg-[#e3554e]' : 'w-2.5 bg-white/40 hover:bg-white/80'
                    }`}
                    title={photo.title}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
