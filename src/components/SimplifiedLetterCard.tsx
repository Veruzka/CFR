import React, { useState } from 'react';
import { RapLetter, HIP_HOP_PHOTOS } from '../types/agent';
import { Play, Pause, Copy, Check, Disc3, Sparkles, Send, Wand2 } from 'lucide-react';

interface SimplifiedLetterCardProps {
  letter: RapLetter;
  photoIndex: number;
  onSelectPhoto: (index: number) => void;
  isBeatPlaying: boolean;
  onToggleBeat: () => void;
  onRefine: (instruction: string) => void;
  isRefining: boolean;
  onStartNew: () => void;
}

export const SimplifiedLetterCard: React.FC<SimplifiedLetterCardProps> = ({
  letter,
  photoIndex,
  onSelectPhoto,
  isBeatPlaying,
  onToggleBeat,
  onRefine,
  isRefining,
  onStartNew,
}) => {
  const [copied, setCopied] = useState(false);
  const [instruction, setInstruction] = useState('');

  const currentPhoto = HIP_HOP_PHOTOS[photoIndex % HIP_HOP_PHOTOS.length];

  const handleCopy = () => {
    const textToCopy = `
TO: ${letter.recipient}
SUBJECT: ${letter.subject}

${letter.verses.map((v) => `[${v.title}]\n${v.lines.join('\n')}`).join('\n\n')}

[${letter.chorus.title}]
${letter.chorus.lines.join('\n')}

[OUTRO]
${letter.outro}

${letter.signOff}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isRefining) return;
    onRefine(instruction.trim());
    setInstruction('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 2-Column Responsive Layout: Large Photo Visual on Left, Rap Letter on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Large Visual Frame (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col justify-between overflow-hidden rounded-[32px] border border-[#22334d] bg-[#121b2b] shadow-2xl relative">
          <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-auto lg:h-full w-full overflow-hidden bg-[#0c131f]">
            <img
              src={currentPhoto.src}
              alt={currentPhoto.alt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter contrast-105 saturate-110"
            />

            {/* Gradient shadow overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c131f] via-[#0c131f]/35 to-transparent" />

            {/* Spinning Vinyl Overlay Badge */}
            <div className="absolute top-4 right-4 z-20">
              <button
                type="button"
                onClick={onToggleBeat}
                className={`p-3 rounded-full shadow-xl transition-all flex items-center justify-center ${
                  isBeatPlaying
                    ? 'bg-[#e3554e] text-white scale-110 shadow-[#e3554e]/40'
                    : 'bg-[#0c131f]/85 text-[#cb902c] hover:bg-[#0c131f]'
                }`}
                title={isBeatPlaying ? 'Pause beat' : 'Play 90s Boom-Bap beat'}
              >
                <Disc3 className={`w-6 h-6 ${isBeatPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
              </button>
            </div>

            {/* Bottom Photo Metadata & Switcher */}
            <div className="absolute bottom-0 inset-x-0 p-6 z-20 space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#cb902c] font-bold block">
                Visual Representation
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#f5f1e8] font-display">
                {currentPhoto.title}
              </h3>
              <p className="text-xs text-[#d99bb2] font-medium">
                {currentPhoto.tagline}
              </p>

              {/* Photo switcher thumbnails */}
              <div className="pt-2 flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#a1b0c6] mr-1">Style:</span>
                {HIP_HOP_PHOTOS.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectPhoto(idx)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      photoIndex === idx
                        ? 'bg-[#e3554e] text-white shadow-md'
                        : 'bg-[#162236]/90 text-[#f5f1e8] hover:text-white border border-[#22334d]'
                    }`}
                  >
                    Look {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rap Letter Display (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-[#121b2b] border border-[#22334d] rounded-[32px] p-6 sm:p-8 shadow-2xl">
          <div className="space-y-6">
            {/* Letter Header */}
            <div className="border-b border-[#22334d] pb-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#e3554e]">
                  Rap Letter Notice
                </span>
                <span className="text-xs text-[#a1b0c6] font-mono">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#f5f1e8] font-display">
                {letter.title}
              </h2>
              <div className="mt-2 text-xs font-mono text-[#f5f1e8] space-y-0.5">
                <p><span className="text-[#a1b0c6]">TO: </span><span className="text-[#cb902c] font-bold">{letter.recipient}</span></p>
                <p><span className="text-[#a1b0c6]">RE: </span>{letter.subject}</p>
              </div>
            </div>

            {/* Verses & Hook */}
            <div className="space-y-5 text-sm sm:text-base leading-relaxed">
              {/* Verse 1 */}
              {letter.verses[0] && (
                <div className="space-y-1.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#cb902c] block">
                    {letter.verses[0].title}
                  </span>
                  {letter.verses[0].lines.map((line, i) => (
                    <p key={i} className="text-[#f5f1e8] font-mono text-sm sm:text-base">
                      {line}
                    </p>
                  ))}
                </div>
              )}

              {/* Hook / Chorus */}
              {letter.chorus && (
                <div className="bg-[#e3554e]/15 border-l-4 border-[#e3554e] p-4 rounded-r-2xl space-y-1.5 my-3">
                  <span className="text-xs font-mono font-black uppercase tracking-widest text-[#e3554e] block">
                    {letter.chorus.title}
                  </span>
                  {letter.chorus.lines.map((line, i) => (
                    <p key={i} className="text-[#f5f1e8] font-mono font-bold text-sm sm:text-base">
                      {line}
                    </p>
                  ))}
                </div>
              )}

              {/* Verse 2 */}
              {letter.verses[1] && (
                <div className="space-y-1.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#cb902c] block">
                    {letter.verses[1].title}
                  </span>
                  {letter.verses[1].lines.map((line, i) => (
                    <p key={i} className="text-[#f5f1e8] font-mono text-sm sm:text-base">
                      {line}
                    </p>
                  ))}
                </div>
              )}

              {/* Outro */}
              {letter.outro && (
                <div className="pt-2 text-xs text-[#a1b0c6] italic font-mono border-t border-[#22334d]">
                  <p>"{letter.outro}"</p>
                  <p className="mt-2 text-[#cb902c] font-bold not-italic">{letter.signOff}</p>
                </div>
              )}
            </div>
          </div>

          {/* Simple Action Bar */}
          <div className="mt-8 pt-5 border-t border-[#22334d] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleBeat}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isBeatPlaying
                    ? 'bg-[#2b52d9] text-white shadow-md'
                    : 'bg-[#162236] hover:bg-[#1f304d] text-[#cb902c] border border-[#22334d]'
                }`}
              >
                {isBeatPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isBeatPlaying ? 'Pause Beat' : 'Play 90s Beat'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#162236] hover:bg-[#1f304d] text-[#f5f1e8] border border-[#22334d] transition-all flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-[#1b4e3b]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Letter'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onStartNew}
              className="text-xs text-[#a1b0c6] hover:text-[#f5f1e8] font-medium transition-colors"
            >
              + New Letter
            </button>
          </div>
        </div>
      </div>

      {/* Simplified Refinement Bar */}
      <div className="bg-[#121b2b] border border-[#22334d] rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Wand2 className="w-4 h-4 text-[#cb902c]" />
          <h4 className="text-sm font-bold text-[#f5f1e8] font-display">
            Want to modify this letter or visual?
          </h4>
        </div>

        <form onSubmit={handleRefineSubmit} className="flex gap-2">
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g. 'Make verse 2 funnier', 'Add a line about squeaky sneakers', 'Make the hook punchier'..."
            className="flex-1 bg-[#0c131f] border border-[#22334d] focus:border-[#e3554e] rounded-2xl px-4 py-3 text-sm text-[#f5f1e8] placeholder:text-[#6a7b94]"
            disabled={isRefining}
          />
          <button
            type="submit"
            disabled={!instruction.trim() || isRefining}
            className="px-6 py-3 bg-gradient-to-r from-[#e3554e] to-[#cb902c] hover:brightness-110 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-2 disabled:opacity-50 transition-all shrink-0 shadow-md shadow-[#e3554e]/20"
          >
            {isRefining ? (
              <Sparkles className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>Refine</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
