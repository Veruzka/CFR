import React, { useState, useEffect } from 'react';
import { PhotoHero } from './components/PhotoHero';
import { SimplifiedInput } from './components/SimplifiedInput';
import { ClarificationCard } from './components/ClarificationCard';
import { SimplifiedLetterCard } from './components/SimplifiedLetterCard';
import { SystemDiagramModal } from './components/SystemDiagramModal';
import { RapLetter, ClarificationQuestion, AgentResponse, HIP_HOP_PHOTOS } from './types/agent';
import { beatEngine } from './utils/audioEngine';
import { createClientFallbackLetter } from './utils/clientFallback';
import { Info, PlusCircle } from 'lucide-react';

export default function App() {
  const [stage, setStage] = useState<'input' | 'clarification' | 'results'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active photo look (0, 1, or 2 from the uploaded 90s photos)
  const [photoIndex, setPhotoIndex] = useState(0);

  // User input context
  const [currentFrustration, setCurrentFrustration] = useState('');
  const [currentTarget, setCurrentTarget] = useState('Upstairs Neighbor');

  // Agent response
  const [clarificationQuestions, setClarificationQuestions] = useState<ClarificationQuestion[]>([]);
  const [agentReaction, setAgentReaction] = useState('');
  const [letter, setLetter] = useState<RapLetter | null>(null);

  // Beat playback
  const [isBeatPlaying, setIsBeatPlaying] = useState(false);

  // System diagram modal
  const [isDiagramOpen, setIsDiagramOpen] = useState(false);

  useEffect(() => {
    return () => {
      beatEngine.stop();
    };
  }, []);

  const handleToggleBeat = () => {
    if (isBeatPlaying) {
      beatEngine.stop();
      setIsBeatPlaying(false);
    } else {
      beatEngine.setBpm(92);
      beatEngine.setStyle('90s Boom-Bap');
      beatEngine.play();
      setIsBeatPlaying(true);
    }
  };

  // Submit initial frustration
  const handleInitialSubmit = async (frustration: string, target: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentFrustration(frustration);
    setCurrentTarget(target);

    try {
      const res = await fetch('/api/agent/analyze-and-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frustration,
          target,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const result: AgentResponse = await res.json();

      if (result.status === 'needs_clarification' && result.questions && result.questions.length > 0) {
        setClarificationQuestions(result.questions);
        setAgentReaction(result.agentReaction);
        setStage('clarification');
      } else if (result.letter) {
        setLetter(result.letter);
        setAgentReaction(result.agentReaction);
        if (typeof result.selectedPhotoIndex === 'number') {
          setPhotoIndex(result.selectedPhotoIndex);
        }
        setStage('results');
      }
    } catch (err: unknown) {
      console.warn('Backend API unavailable or returned error, activating client-side CFR generator:', err);
      // Fallback generates customized letter right away so user is never blocked
      const fallback = createClientFallbackLetter(frustration, target);
      setLetter(fallback.letter);
      setAgentReaction(fallback.reaction);
      setStage('results');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit clarifications
  const handleClarificationsSubmit = async (answers: { question: string; answer: string }[]) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/agent/analyze-and-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frustration: currentFrustration,
          target: currentTarget,
          clarifications: answers,
        }),
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const result: AgentResponse = await res.json();
      if (result.letter) {
        setLetter(result.letter);
        setAgentReaction(result.agentReaction);
        setStage('results');
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage('Could not finalize rap letter.');
    } finally {
      setIsLoading(false);
    }
  };

  // Refine letter
  const handleRefine = async (instruction: string) => {
    if (!letter) return;
    setIsLoading(true);
    setErrorMessage(null);

    const lower = instruction.toLowerCase();
    if (lower.includes('photo') || lower.includes('look') || lower.includes('visual')) {
      setPhotoIndex((prev) => (prev + 1) % HIP_HOP_PHOTOS.length);
    }

    try {
      const res = await fetch('/api/agent/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentLetter: letter,
          instruction,
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const result = await res.json();
      if (result.letter) {
        setLetter(result.letter);
      }
      if (result.agentReaction) {
        setAgentReaction(result.agentReaction);
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage('Could not refine letter.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to start a new letter
  const handleStartNew = () => {
    beatEngine.stop();
    setIsBeatPlaying(false);
    setStage('input');
    setLetter(null);
    setCurrentFrustration('');
  };

  return (
    <div className="min-h-screen bg-[#0c131f] text-[#f5f1e8] flex flex-col font-sans selection:bg-[#e3554e] selection:text-[#0c131f]">
      {/* Top Navigation Bar with Palette */}
      <header className="flex items-center justify-between gap-6 px-6 py-4 border-b border-[#22334d] bg-[#0c131f]/90 backdrop-blur-md sticky top-0 z-40">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleStartNew();
          }}
          className="text-lg font-black tracking-tight text-[#f5f1e8] font-display flex items-center gap-2.5 hover:text-[#cb902c] transition-colors"
        >
          <span className="w-8 h-8 rounded-xl bg-[#e3554e] text-white font-black text-xs flex items-center justify-center font-mono shadow-md">
            CFR
          </span>
          <span>Cathartic Fun Rapper</span>
        </a>

        <div className="flex items-center gap-3">
          {stage === 'results' && (
            <button
              type="button"
              onClick={handleStartNew}
              className="text-xs font-bold text-[#f5f1e8] hover:bg-[#162236] px-3.5 py-1.5 rounded-xl bg-[#121b2b] border border-[#22334d] transition-colors"
            >
              + New Letter
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsDiagramOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#f5f1e8] hover:bg-[#162236] bg-[#121b2b] border border-[#22334d] hover:border-[#cb902c] rounded-xl transition-all"
          >
            <Info className="w-4 h-4 text-[#cb902c]" />
            <span>Architecture & Spec</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {errorMessage && (
          <div className="p-4 bg-[#e3554e]/20 border border-[#e3554e]/60 rounded-2xl text-xs text-[#f5f1e8] flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-[#e3554e] font-bold ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Hero Photo (Shown on Input & Clarification stages) */}
        {stage !== 'results' && (
          <PhotoHero
            photoIndex={photoIndex}
            onSelectPhoto={setPhotoIndex}
            trackTitle="Spit The Frustration. CFR Drops The Beat."
            isBeatPlaying={isBeatPlaying}
          />
        )}

        {/* Stage 1: Simplified Input */}
        {stage === 'input' && (
          <SimplifiedInput
            onSubmit={handleInitialSubmit}
            isLoading={isLoading}
            onSelectSuggestionPhoto={(idx) => setPhotoIndex(idx)}
          />
        )}

        {/* Stage 2: Clarification Card */}
        {stage === 'clarification' && (
          <ClarificationCard
            questions={clarificationQuestions}
            agentReaction={agentReaction}
            originalFrustration={currentFrustration}
            onSubmitClarifications={handleClarificationsSubmit}
            onCancel={() => setStage('input')}
            isLoading={isLoading}
          />
        )}

        {/* Stage 3: Results Display */}
        {stage === 'results' && letter && (
          <SimplifiedLetterCard
            letter={letter}
            photoIndex={photoIndex}
            onSelectPhoto={setPhotoIndex}
            isBeatPlaying={isBeatPlaying}
            onToggleBeat={handleToggleBeat}
            onRefine={handleRefine}
            isRefining={isLoading}
            onStartNew={handleStartNew}
          />
        )}
      </main>

      {/* Clean, minimal footer */}
      <footer className="mt-auto border-t border-[#22334d] bg-[#0c131f] px-6 py-5 text-xs text-[#a1b0c6]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span>Cathartic Fun Rapper (CFR) · Veruska, Saoumya, Margeaux</span>
          <button
            type="button"
            onClick={() => setIsDiagramOpen(true)}
            className="text-[#cb902c] hover:underline font-mono"
          >
            System Diagram & Role Card
          </button>
        </div>
      </footer>

      {/* System Diagram & Role Card Modal */}
      <SystemDiagramModal
        isOpen={isDiagramOpen}
        onClose={() => setIsDiagramOpen(false)}
      />
    </div>
  );
}
