import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini client with telemetry header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
}) : null;

// CFR Role Card: Cathartic Fun Rapper
const CFR_SYSTEM_PROMPT = `You are "Cathartic Fun Rapper (CFR)" - an empowering, direct, and playful writing agent.
PURPOSE:
To help users release & express their frustrations by turning complaints into rap songs and letters.

VOICE & BEHAVIOR:
- Direct, playful, candid, creative, impactful, deterministic, straightforward, and brutally honest in a charming and politically correct way.
- Validate the user's frustration 100%! Turn everyday complaints into devastatingly clever, rhythmic rhymes.
- DO NOT gaslight, tone-police, or minimize their feelings.
- STRICT BOUNDARIES: NO cursing, NO racial slurs, NO threats, NO physical violence.

INTERACTION LOOP:
1. Understand the frustration context.
2. If context is too thin (e.g. fewer than 5 words like "neighbor loud" or "bad day"), ask 2 punchy follow-up questions to extract specifics.
3. If context is sufficient, compose a clean Rap Letter with:
   - Recipient
   - Subject
   - 2 Verses (4 punchy rhyming lines each)
   - 1 Catchy Hook / Chorus (4 lines)
   - Outro & Sign-off
4. Respond in strictly valid JSON format.`;

interface AnalyzeRequest {
  frustration: string;
  clarifications?: { question: string; answer: string }[];
  target?: string;
}

// Route 1: Analyze context and generate rap letter or ask 2 clarifying questions
app.post('/api/agent/analyze-and-draft', async (req: Request, res: Response) => {
  try {
    const { frustration, clarifications = [], target = 'Offender' }: AnalyzeRequest = req.body;

    if (!frustration || frustration.trim().length === 0) {
      return res.status(400).json({ error: 'Frustration context is required.' });
    }

    const hasClarifications = clarifications && clarifications.length > 0;
    const isVeryBrief = frustration.trim().split(/\s+/).length < 5 && !hasClarifications;

    // If extremely short, ask 2 follow-up questions
    if (isVeryBrief) {
      return res.json({
        status: 'needs_clarification',
        agentReaction: "Hold up! CFR here. You can't drop a legendary track with just half a thought. Give me a couple of details so we can cook real bars!",
        questions: [
          {
            id: 'what_happened',
            question: "What's the exact straw that broke the camel's back?",
            options: [
              "Stomping and slamming doors in the dead of night",
              "Borrowing or taking my stuff without asking",
              "Leaving a huge mess for someone else to clean up",
              "Micromanaging and second-guessing every single move"
            ]
          },
          {
            id: 'what_solution',
            question: "What's the bottom-line rule they need to hear?",
            options: [
              "Respect quiet hours and keep the volume down",
              "Buy your own food and leave mine alone",
              "Clean up your own disaster immediately",
              "Give me space and mind your own business"
            ]
          }
        ]
      });
    }

    if (!ai) {
      return res.json(generateFallbackRapLetter(frustration, clarifications, target));
    }

    const clarificationText = clarifications.length > 0
      ? `\nClarification details provided:\n${clarifications.map(c => `- Q: ${c.question} -> A: ${c.answer}`).join('\n')}`
      : '';

    const prompt = `User grievance: "${frustration}"
Recipient: ${target}
${clarificationText}

Evaluate if there is enough context to make a personalized rap letter.
If still too vague, return status "needs_clarification" with 2 questions.
Otherwise, return status "complete" with the letter.

Respond with ONLY valid JSON with this structure:
{
  "status": "complete",
  "agentReaction": "CFR's energetic validation of the user's grievance (1-2 punchy sentences)",
  "selectedPhotoIndex": 0,
  "letter": {
    "title": "Catchy Track Title",
    "recipient": "${target}",
    "subject": "Clear grievance subject",
    "verses": [
      {
        "title": "Verse 1: The Problem",
        "lines": ["line 1", "line 2", "line 3", "line 4"]
      },
      {
        "title": "Verse 2: The Reality Check",
        "lines": ["line 1", "line 2", "line 3", "line 4"]
      }
    ],
    "chorus": {
      "title": "The Hook",
      "lines": ["hook 1", "hook 2", "hook 3", "hook 4"]
    },
    "outro": "Short witty closing statement",
    "signOff": "Sincerely, The Aggrieved & Cathartic Fun Rapper"
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: CFR_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    try {
      const parsed = JSON.parse(response.text || '{}');
      if (parsed && parsed.letter) {
        return res.json(parsed);
      }
      return res.json(generateFallbackRapLetter(frustration, clarifications, target));
    } catch {
      return res.json(generateFallbackRapLetter(frustration, clarifications, target));
    }
  } catch (err: unknown) {
    console.error('Error generating rap letter:', err);
    return res.json(
      generateFallbackRapLetter(
        req.body.frustration || 'Everyday noise',
        req.body.clarifications || [],
        req.body.target || 'The Offender'
      )
    );
  }
});

// Route 2: Refine the letter based on user instruction
app.post('/api/agent/refine', async (req: Request, res: Response) => {
  try {
    const { currentLetter, instruction } = req.body;

    if (!instruction) {
      return res.status(400).json({ error: 'Instruction is required for refinement.' });
    }

    if (!ai) {
      return res.json(generateFallbackRefine(currentLetter, instruction));
    }

    const prompt = `You are Cathartic Fun Rapper (CFR).
The user wants to refine their rap letter.
Refinement request: "${instruction}"

Current Letter:
${JSON.stringify(currentLetter, null, 2)}

Rewrite the letter according to the user's request. Keep it witty, impactful, rhyming, and clean (no cursing, no threats).

Respond with ONLY valid JSON:
{
  "agentReaction": "CFR's hype confirmation (1 sentence)",
  "letter": {
    "title": "Track title",
    "recipient": "${currentLetter?.recipient || 'Recipient'}",
    "subject": "${currentLetter?.subject || 'Subject'}",
    "verses": [
      {
        "title": "Verse 1",
        "lines": ["line 1", "line 2", "line 3", "line 4"]
      },
      {
        "title": "Verse 2",
        "lines": ["line 1", "line 2", "line 3", "line 4"]
      }
    ],
    "chorus": {
      "title": "The Hook",
      "lines": ["hook 1", "hook 2", "hook 3", "hook 4"]
    },
    "outro": "Outro bar",
    "signOff": "Sincerely, The Aggrieved & CFR"
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: CFR_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    try {
      const parsed = JSON.parse(response.text || '{}');
      if (parsed && parsed.letter) {
        return res.json(parsed);
      }
      return res.json(generateFallbackRefine(currentLetter, instruction));
    } catch {
      return res.json(generateFallbackRefine(currentLetter, instruction));
    }
  } catch (err: unknown) {
    console.error('Error in agent refinement:', err);
    return res.json(generateFallbackRefine(req.body.currentLetter, req.body.instruction || 'Tweak lyrics'));
  }
});

// Fallback letter generator
function generateFallbackRapLetter(frustration: string, clarifications: { question: string; answer: string }[], target: string) {
  const detail = clarifications.map(c => c.answer).join(', ') || frustration;

  return {
    status: 'complete',
    agentReaction: `Yo! CFR here. We took that stress with "${target}" and spun it into 100% pure 90s lyrical catharsis. Let's send this message loud and clear!`,
    selectedPhotoIndex: 0,
    letter: {
      title: 'Cease & Desist (The Rhythmic Notice)',
      recipient: target || 'The Neighbor in 4B',
      subject: `Official Notice of Disturbance: ${detail.slice(0, 40)}`,
      verses: [
        {
          title: 'Verse 1: The Disturbance',
          lines: [
            'I gotta keep it candid, keep it 100 percent real,',
            'The way you stomp across the floor is shaking up my meal.',
            'It sounds like bowling balls at midnight rolling down the hall,',
            'My ceiling fan is rattling, vibrations through the wall!'
          ]
        },
        {
          title: 'Verse 2: The Solution',
          lines: [
            'We share the building, share the roof, so let us keep the peace,',
            'Slip on some memory foam and let the heavy thumping cease.',
            'No bad blood in the lobby, no tension by the door,',
            'Just common courtesy whenever stepping on that floor!'
          ]
        }
      ],
      chorus: {
        title: 'The Hook',
        lines: [
          'Turn down the volume, lighten up your tread,',
          'Eight whole hours of peaceful sleep is what we need in bed!',
          'No drama in the stairwell, no shouting in the hall,',
          'Just basic consideration for our shared dry-wall!'
        ]
      },
      outro: 'Take this letter with a smile, but take it to heart. Slippers on, volume down. Peace.',
      signOff: 'Sincerely, The Aggrieved & Cathartic Fun Rapper'
    }
  };
}

function generateFallbackRefine(currentLetter: any, instruction: string) {
  const updated = currentLetter ? JSON.parse(JSON.stringify(currentLetter)) : {};
  if (updated.verses && updated.verses[0] && updated.verses[0].lines) {
    updated.verses[0].lines[0] = `Listen to the beat: ${instruction.slice(0, 35)}...`;
  }
  return {
    agentReaction: `CFR tuned the bars to match: "${instruction}". Spat extra flavor on that mix!`,
    letter: updated
  };
}

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CFR Server running on http://localhost:${PORT}`);
  });
}

startServer();
