import React, { useState } from 'react';
import { SIMPLE_SUGGESTIONS } from '../types/agent';
import { Send, Sparkles, ArrowRight } from 'lucide-react';

interface SimplifiedInputProps {
  onSubmit: (frustration: string, target: string) => void;
  isLoading: boolean;
  onSelectSuggestionPhoto?: (photoIndex: number) => void;
}

export const SimplifiedInput: React.FC<SimplifiedInputProps> = ({
  onSubmit,
  isLoading,
  onSelectSuggestionPhoto,
}) => {
  const [frustration, setFrustration] = useState('');
  const [target, setTarget] = useState('Upstairs Neighbor');

  const handleSelectSuggestion = (sug: typeof SIMPLE_SUGGESTIONS[0]) => {
    setFrustration(sug.detail);
    setTarget(sug.target);
    if (onSelectSuggestionPhoto) {
      onSelectSuggestionPhoto(sug.photoIndex);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!frustration.trim() || isLoading) return;
    onSubmit(frustration.trim(), target.trim());
  };

  return (
    <div className="space-y-4">
      {/* 3 Clean Quick Suggestions */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-[#cb902c] uppercase tracking-wider block font-semibold">
          Quick Suggestions to Get Started:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SIMPLE_SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSuggestion(sug)}
              className="text-left p-3.5 rounded-2xl bg-[#162236] hover:bg-[#1b2a42] border border-[#22334d] hover:border-[#cb902c] transition-all text-xs text-[#f5f1e8] font-medium flex items-center justify-between group"
            >
              <span className="line-clamp-2 pr-2 leading-relaxed">{sug.label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#cb902c] shrink-0 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Frustration Box */}
      <form onSubmit={handleSubmit} className="bg-[#121b2b] border border-[#22334d] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div>
          <label className="block text-xs font-mono text-[#d99bb2] uppercase tracking-wider mb-2 font-bold">
            What is frustrating you?
          </label>
          <textarea
            value={frustration}
            onChange={(e) => setFrustration(e.target.value)}
            placeholder="e.g. My neighbor walks around like they got concrete shoes at 2 AM every night, shaking my ceiling..."
            rows={3}
            className="w-full bg-[#0c131f] border border-[#22334d] focus:border-[#e3554e] focus:ring-1 focus:ring-[#e3554e] rounded-2xl p-4 text-[#f5f1e8] placeholder:text-[#6a7b94] text-sm sm:text-base resize-none transition-colors"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="w-full sm:w-auto flex items-center gap-2">
            <span className="text-xs text-[#cb902c] font-mono shrink-0 font-bold">To:</span>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. Upstairs Neighbor"
              className="w-full sm:w-60 bg-[#0c131f] border border-[#22334d] focus:border-[#cb902c] rounded-xl px-3 py-2 text-xs text-[#f5f1e8]"
            />
          </div>

          <button
            type="submit"
            disabled={!frustration.trim() || isLoading}
            className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-[#e3554e] via-[#e3554e] to-[#cb902c] hover:brightness-110 text-white font-black rounded-2xl text-sm shadow-lg shadow-[#e3554e]/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                <span>Writing Rap Letter...</span>
              </>
            ) : (
              <>
                <span>Create Rap Letter</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
