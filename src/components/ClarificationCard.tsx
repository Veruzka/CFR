import React, { useState } from 'react';
import { ClarificationQuestion } from '../types/agent';
import { HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

interface ClarificationCardProps {
  questions: ClarificationQuestion[];
  agentReaction: string;
  originalFrustration: string;
  onSubmitClarifications: (answers: { question: string; answer: string }[]) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const ClarificationCard: React.FC<ClarificationCardProps> = ({
  questions,
  agentReaction,
  originalFrustration,
  onSubmitClarifications,
  onCancel,
  isLoading,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    questions.forEach((q) => {
      if (q.options && q.options.length > 0) {
        initial[q.id] = q.options[0];
      }
    });
    return initial;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAnswers = questions.map((q) => ({
      question: q.question,
      answer: selectedAnswers[q.id] || (q.options ? q.options[0] : 'Specific detail'),
    }));
    onSubmitClarifications(finalAnswers);
  };

  return (
    <div className="bg-[#121b2b] border border-[#22334d] rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="flex items-center gap-3 border-b border-[#22334d] pb-4">
        <div className="w-10 h-10 rounded-2xl bg-[#cb902c] text-[#0c131f] flex items-center justify-center shrink-0 font-bold shadow-md">
          <HelpCircle className="w-5 h-5 text-[#0c131f]" />
        </div>
        <div>
          <span className="text-xs font-mono text-[#cb902c] font-bold uppercase tracking-wider block">
            Clarification
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#f5f1e8] font-display">
            Give CFR A Little More Context
          </h2>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-[#f5f1e8] italic bg-[#0c131f] p-4 rounded-2xl border border-[#22334d]">
        "{agentReaction || "A diss track needs real details! Select a quick detail below so we can cook the bars."}"
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {questions.map((q, idx) => (
          <div key={q.id || idx} className="space-y-2.5">
            <label className="block text-xs font-mono text-[#d99bb2] uppercase tracking-wider font-bold">
              {idx + 1}. {q.question}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options?.map((opt) => {
                const isSelected = selectedAnswers[q.id] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                    className={`text-left p-3.5 rounded-2xl text-xs transition-all font-medium leading-relaxed ${
                      isSelected
                        ? 'bg-[#e3554e] text-white shadow-md font-bold'
                        : 'bg-[#0c131f] border border-[#22334d] text-[#f5f1e8] hover:border-[#cb902c]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="pt-4 flex items-center justify-between gap-4 border-t border-[#22334d]">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-[#a1b0c6] hover:text-[#f5f1e8] font-medium"
            disabled={isLoading}
          >
            ← Back
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-[#e3554e] to-[#cb902c] hover:brightness-110 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#e3554e]/20"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                <span>Writing Bars...</span>
              </>
            ) : (
              <>
                <span>Generate Rap Letter</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
