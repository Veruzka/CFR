import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

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
2. If context is too thin (fewer than 5 words like "neighbor loud"), ask 2 punchy follow-up questions to extract specifics.
3. If context is sufficient, compose a clean Rap Letter with:
   - Recipient
   - Subject
   - 2 Verses (4 punchy rhyming lines each)
   - 1 Catchy Hook / Chorus (4 lines)
   - Outro & Sign-off
4. Respond in strictly valid JSON format.`;

const handleAnalyzeAndDraft = async (req: Request, res: Response) => {
  try {
    const { frustration, clarifications = [], target = 'The Offender' } = req.body || {};

    if (!frustration || frustration.trim().length === 0) {
      return res.status(400).json({ error: 'Frustration context is required.' });
    }

    const hasClarifications = clarifications && clarifications.length > 0;
    const isVeryBrief = frustration.trim().split(/\s+/).length < 5 && !hasClarifications;

    if (isVeryBrief) {
      return res.json({
        status: 'needs_clarification',
        agentReaction: "Hold up! CFR in the building. You can't drop a legendary diss track with half a bar. Give me a couple of details so we can cook real bars!",
        questions: [
          {
            id: 'what_happened',
            question: "What's the exact straw that broke the camel's back?",
            options: [
              "Hogging all the street parking spaces for weeks",
              "Ignoring notes and acting completely entitled",
              "Stomping and slamming doors in the dead of night",
              "Leaving a huge mess for someone else to clean up"
            ]
          },
          {
            id: 'what_solution',
            question: "What's the bottom-line rule they need to hear?",
            options: [
              "Move your car up and share the curb with the block",
              "Respect quiet hours and keep the volume down",
              "Clean up your own mess immediately",
              "Give people space and have basic human courtesy"
            ]
          }
        ]
      });
    }

    if (!ai) {
      return res.json(generateFallbackRapLetter(frustration, clarifications, target));
    }

    const clarificationText = clarifications.length > 0
      ? `\nClarification details provided:\n${clarifications.map((c: any) => `- Q: ${c.question} -> A: ${c.answer}`).join('\n')}`
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
    console.error('Error generating rap letter in Vercel function:', err);
    return res.json(
      generateFallbackRapLetter(
        req.body?.frustration || 'Parking and shared space headache',
        req.body?.clarifications || [],
        req.body?.target || 'The Parking Hog'
      )
    );
  }
};

const handleRefine = async (req: Request, res: Response) => {
  try {
    const { currentLetter, instruction } = req.body || {};

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

Rewrite the letter according to the user's request. Keep it witty, impactful, rhyming, and clean.

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
    return res.json(generateFallbackRefine(req.body?.currentLetter, req.body?.instruction || 'Tweak lyrics'));
  }
};

// Support both prefixed (/api/...) and direct (/...) routes on Vercel
app.post(['/api/agent/analyze-and-draft', '/agent/analyze-and-draft'], handleAnalyzeAndDraft);
app.post(['/api/agent/refine', '/agent/refine'], handleRefine);

function generateFallbackRapLetter(frustration: string, clarifications: any[], target: string) {
  const detail = clarifications.map((c: any) => c.answer).join(', ') || frustration;

  return {
    status: 'complete',
    agentReaction: `Yo! CFR here on the mic! We took that whole mess with "${target}" and spun every ounce of frustration into pure rhythmic gold. Let's deliver this message!`,
    selectedPhotoIndex: 0,
    letter: {
      title: 'Four Spots, Zero Courtesy (The San Francisco Edition)',
      recipient: target || 'The Curb Hog',
      subject: `Notice of Space Monopolization: ${detail.slice(0, 45)}`,
      verses: [
        {
          title: 'Verse 1: The Curb Crisis',
          lines: [
            `I gotta keep it candid, keep it 100 percent real,`,
            `Taking four whole parking spaces is an awful kind of deal.`,
            `We living in the city where a spot is hard to find,`,
            `Left a friendly sticky note, but you just left your conscience behind!`
          ]
        },
        {
          title: 'Verse 2: The Solution',
          lines: [
            `Two weeks done passed, your bumper hasn't moved an inch,`,
            `Got the whole block circling and feeling every pinch.`,
            `Pull forward two feet, let your neighbor park in peace,`,
            `Because hoarding public asphalt is a habit that must cease!`
          ]
        }
      ],
      chorus: {
        title: 'The Hook',
        lines: [
          `Pull that whip forward, share up the street,`,
          `Finding legal parking shouldn't feel like defeat!`,
          `No bad blood, no scratches on the door,`,
          `Just common decency and room for one more!`
        ]
      },
      outro: 'Take this letter with a smile, but pull forward two feet. Peace.',
      signOff: 'Sincerely, The Aggrieved Driver & Cathartic Fun Rapper'
    }
  };
}

function generateFallbackRefine(currentLetter: any, instruction: string) {
  const updated = currentLetter ? JSON.parse(JSON.stringify(currentLetter)) : {};
  if (updated.verses && updated.verses[0] && updated.verses[0].lines) {
    updated.verses[0].lines[0] = `Listen closely: ${instruction.slice(0, 35)}...`;
  }
  return {
    agentReaction: `CFR tuned the bars to match: "${instruction}". Spat extra flavor on that mix!`,
    letter: updated
  };
}

export default app;
