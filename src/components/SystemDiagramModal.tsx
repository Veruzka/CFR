import React, { useState } from 'react';
import {
  X,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Music,
  FileText,
  UserCheck,
  CheckCircle,
  HelpCircle,
  Terminal,
  Activity,
  Bot,
} from 'lucide-react';

interface SystemDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemDiagramModal: React.FC<SystemDiagramModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'role_card'>('architecture');
  const [selectedNode, setSelectedNode] = useState<string | null>('agent_brain');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0c131f]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#121b2b] border border-[#22334d] rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#22334d] bg-[#0c131f]">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-[#e3554e]" />
            <div>
              <h2 className="text-base font-bold text-[#f5f1e8] font-display">
                CFR System Architecture & Agent Workflow
              </h2>
              <p className="text-xs text-[#a1b0c6] font-mono">
                Full-Stack Pipeline · Gemini 3.8 Flash · Web Audio API · Role Card Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab switch */}
            <div className="flex items-center p-1 bg-[#162236] rounded-xl text-xs border border-[#22334d]">
              <button
                type="button"
                onClick={() => setActiveTab('architecture')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  activeTab === 'architecture'
                    ? 'bg-[#e3554e] text-white shadow-sm'
                    : 'text-[#a1b0c6] hover:text-[#f5f1e8]'
                }`}
              >
                System Diagram
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('role_card')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  activeTab === 'role_card'
                    ? 'bg-[#e3554e] text-white shadow-sm'
                    : 'text-[#a1b0c6] hover:text-[#f5f1e8]'
                }`}
              >
                Role Card Spec
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#162236] hover:bg-[#1f304d] text-[#a1b0c6] hover:text-white transition-colors border border-[#22334d]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'architecture' ? (
            <div className="space-y-6">
              {/* Architecture Explanation */}
              <div className="bg-[#0c131f] p-4 rounded-2xl border border-[#22334d] text-xs text-[#f5f1e8] leading-relaxed flex items-start gap-3">
                <Bot className="w-5 h-5 text-[#cb902c] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#f5f1e8] block mb-0.5">
                    How the Cathartic Fun Rapper (CFR) Agent Works:
                  </span>
                  The system integrates a photo-dominant UI styled with the rich tapestry color palette (deep ink, coral, warm ochre, cobalt blue, forest pine) and a server-side proxy running Gemini 3.8 Flash. The agent actively evaluates context sufficiency: if user details are sparse, it triggers a clarification loop before drafting. Once generated, the rap letter is dynamically paired with large 90s hip-hop photography, procedural Web Audio beats, and iterative refinements.
                </div>
              </div>

              {/* Interactive Visual Flow Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
                {/* Node 1 */}
                <div
                  onClick={() => setSelectedNode('client_input')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedNode === 'client_input'
                      ? 'bg-[#162236] border-[#e3554e] shadow-lg shadow-[#e3554e]/10'
                      : 'bg-[#0c131f] border-[#22334d] hover:border-[#1e2d44]'
                  }`}
                >
                  <div className="text-[11px] font-mono text-[#cb902c] font-bold uppercase mb-1">
                    Step 1 · Client Layer
                  </div>
                  <h4 className="text-sm font-bold text-[#f5f1e8] mb-1.5 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#2b52d9]" />
                    Frustration & Visuals
                  </h4>
                  <p className="text-xs text-[#a1b0c6] leading-relaxed">
                    Visual connection with 90s photography, clean suggestions, recipient input & one-click start.
                  </p>
                </div>

                {/* Node 2 */}
                <div
                  onClick={() => setSelectedNode('sufficiency_gate')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedNode === 'sufficiency_gate'
                      ? 'bg-[#162236] border-[#e3554e] shadow-lg shadow-[#e3554e]/10'
                      : 'bg-[#0c131f] border-[#22334d] hover:border-[#1e2d44]'
                  }`}
                >
                  <div className="text-[11px] font-mono text-[#cb902c] font-bold uppercase mb-1">
                    Step 2 · Agent Gate
                  </div>
                  <h4 className="text-sm font-bold text-[#f5f1e8] mb-1.5 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-[#cb902c]" />
                    Context Sufficiency
                  </h4>
                  <p className="text-xs text-[#a1b0c6] leading-relaxed">
                    Evaluates detail depth. If context is too thin, branches to CFR clarification questions.
                  </p>
                </div>

                {/* Node 3 */}
                <div
                  onClick={() => setSelectedNode('agent_brain')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedNode === 'agent_brain'
                      ? 'bg-[#162236] border-[#e3554e] shadow-lg shadow-[#e3554e]/10'
                      : 'bg-[#0c131f] border-[#22334d] hover:border-[#1e2d44]'
                  }`}
                >
                  <div className="text-[11px] font-mono text-[#cb902c] font-bold uppercase mb-1">
                    Step 3 · Model & Server
                  </div>
                  <h4 className="text-sm font-bold text-[#f5f1e8] mb-1.5 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-[#e3554e]" />
                    Gemini 3.8 Flash Brain
                  </h4>
                  <p className="text-xs text-[#a1b0c6] leading-relaxed">
                    Express server executes @google/genai SDK with strict CFR role card behavioral boundaries.
                  </p>
                </div>

                {/* Node 4 */}
                <div
                  onClick={() => setSelectedNode('synthesis_output')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedNode === 'synthesis_output'
                      ? 'bg-[#162236] border-[#e3554e] shadow-lg shadow-[#e3554e]/10'
                      : 'bg-[#0c131f] border-[#22334d] hover:border-[#1e2d44]'
                  }`}
                >
                  <div className="text-[11px] font-mono text-[#cb902c] font-bold uppercase mb-1">
                    Step 4 · Output & Loop
                  </div>
                  <h4 className="text-sm font-bold text-[#f5f1e8] mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#1b4e3b]" />
                    Rap Letter & Visuals
                  </h4>
                  <p className="text-xs text-[#a1b0c6] leading-relaxed">
                    Large photo visual representation, 90s beat synth, formatted memorandum & refinement bar.
                  </p>
                </div>
              </div>

              {/* Node Deep Dive Details Panel */}
              <div className="bg-[#0c131f] p-5 rounded-2xl border border-[#22334d]">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#cb902c] font-bold uppercase">
                  <Terminal className="w-4 h-4" />
                  <span>Inspecting Node: {selectedNode}</span>
                </div>

                {selectedNode === 'client_input' && (
                  <div className="text-xs text-[#f5f1e8] space-y-2">
                    <p>
                      <strong>Client Layer:</strong> Designed around the woven Bauhaus/Anni Albers color palette (deep ink, terracotta coral, warm ochre, cobalt blue) and large 90s street photography.
                    </p>
                    <p>
                      Includes 3 instant scenario suggestions, recipient targeting, and a single "Create Rap Letter" action.
                    </p>
                  </div>
                )}

                {selectedNode === 'sufficiency_gate' && (
                  <div className="text-xs text-[#f5f1e8] space-y-2">
                    <p>
                      <strong>Sufficiency Logic & Clarification Loop:</strong> As mandated by the Role Card interaction loop:
                      <em> "If the user doesn't provide enough information to create the rap, the agent should ask questions to clarify and get enough context before creating the letter."</em>
                    </p>
                    <p>
                      Detects short or ambiguous inputs and presents 2 quick selectable questions.
                    </p>
                  </div>
                )}

                {selectedNode === 'agent_brain' && (
                  <div className="text-xs text-[#f5f1e8] space-y-2">
                    <p>
                      <strong>Server Proxy & Gemini 3.8 Flash:</strong> Invoked strictly server-side in <code>server.ts</code> using <code>@google/genai</code> with telemetry headers. The API key is securely retained on the server.
                    </p>
                    <p>
                      <strong>Boundaries & Safety:</strong> Strict system prompt adherence: NO cursing, NO racial slurs, NO threats, NO physical violence. Does NOT gaslight or downplay the user's frustration—validates it completely with swagger and witty rhymes.
                    </p>
                  </div>
                )}

                {selectedNode === 'synthesis_output' && (
                  <div className="text-xs text-[#f5f1e8] space-y-2">
                    <p>
                      <strong>Multimodal Output & Iteration:</strong> Synthesizes a formal grievance memorandum in rap letter format (Intro, Verses, Hook, Outro, Sign-off).
                    </p>
                    <p>
                      <strong>Visuals & Audio:</strong> Paired with large 90s photography and an in-browser Web Audio boom-bap rhythm beat synthesizer. Allows iterative refinements at any time.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Role Card Tab */
            <div className="bg-[#0c131f] p-6 rounded-2xl border border-[#22334d] space-y-6">
              <div className="border-b border-[#22334d] pb-4">
                <span className="text-xs font-mono text-[#cb902c] uppercase tracking-widest block mb-1">
                  Computational Design Cookbook: From Play to Prototype Role Cards
                </span>
                <h3 className="text-xl font-black text-[#e3554e] font-display">
                  Cathartic Fun Rapper (CFR)
                </h3>
                <p className="text-xs text-[#a1b0c6] font-mono mt-1">
                  Team Members: Veruska, Saoumya, Margeaux · Thomas J McLeish, September 03, 2026
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#121b2b] rounded-2xl border border-[#22334d]">
                  <h4 className="font-bold text-[#cb902c] font-mono uppercase mb-1">Purpose</h4>
                  <p className="text-[#f5f1e8] leading-relaxed">
                    To help users release & express their frustrations by turning complaints into rap songs.
                  </p>
                </div>

                <div className="p-4 bg-[#121b2b] rounded-2xl border border-[#22334d]">
                  <h4 className="font-bold text-[#cb902c] font-mono uppercase mb-1">Engagement Context</h4>
                  <p className="text-[#f5f1e8] leading-relaxed">
                    The user is going through a frustrating experience due to her neighbour not being considerate of their shared space.
                  </p>
                </div>

                <div className="p-4 bg-[#121b2b] rounded-2xl border border-[#22334d]">
                  <h4 className="font-bold text-[#cb902c] font-mono uppercase mb-1">Behavioral Rules & Voice</h4>
                  <p className="text-[#f5f1e8] leading-relaxed">
                    <strong>Voice:</strong> Direct, playful, candid, creative, impactful, deterministic, straightforward, and brutally honest in a charming and politically correct way.
                  </p>
                </div>

                <div className="p-4 bg-[#121b2b] rounded-2xl border border-[#22334d]">
                  <h4 className="font-bold text-[#cb902c] font-mono uppercase mb-1">Interaction Loop</h4>
                  <ul className="text-[#f5f1e8] space-y-1 list-disc list-inside">
                    <li>Get & understand the frustration context</li>
                    <li>Follow-up question (if needed)</li>
                    <li>Flow of creation</li>
                    <li>Iterations based on feedback from user</li>
                  </ul>
                </div>

                <div className="p-4 bg-[#121b2b] rounded-2xl border border-[#22334d]">
                  <h4 className="font-bold text-[#1b4e3b] font-mono uppercase mb-1">Boundaries</h4>
                  <p className="text-[#f5f1e8] leading-relaxed">
                    No cursing, no racial slurs / racism, no threats, no physical violence.
                  </p>
                </div>

                <div className="p-4 bg-[#121b2b] rounded-2xl border border-[#22334d]">
                  <h4 className="font-bold text-[#e3554e] font-mono uppercase mb-1">Does Not Do</h4>
                  <p className="text-[#f5f1e8] leading-relaxed">
                    Does NOT change context or behavior. Does NOT gaslight or reduce frustration!
                  </p>
                </div>

                <div className="p-4 bg-[#121b2b] rounded-2xl border border-[#22334d]">
                  <h4 className="font-bold text-[#cb902c] font-mono uppercase mb-1">Required Inputs</h4>
                  <p className="text-[#f5f1e8] leading-relaxed">
                    Details about the situation and frustration.
                  </p>
                </div>

                <div className="p-4 bg-[#121b2b] rounded-2xl border border-[#22334d]">
                  <h4 className="font-bold text-[#cb902c] font-mono uppercase mb-1">Outputs</h4>
                  <p className="text-[#f5f1e8] leading-relaxed">
                    Rap song & letter: direct, rhymes, with attitude, paired with visual elements.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#0c131f] border-t border-[#22334d] flex items-center justify-between text-xs text-[#a1b0c6] font-mono">
          <span>Cathartic Fun Rapper Engine · Veruska, Saoumya, Margeaux</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#162236] hover:bg-[#1f304d] text-white font-medium rounded-xl transition-colors border border-[#22334d]"
          >
            Close Diagram
          </button>
        </div>
      </div>
    </div>
  );
};
