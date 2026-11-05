export interface Verse {
  title: string;
  lines: string[];
}

export interface RapLetter {
  title: string;
  recipient: string;
  subject: string;
  verses: Verse[];
  chorus: {
    title: string;
    lines: string[];
  };
  outro: string;
  signOff: string;
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface AgentResponse {
  status: 'complete' | 'needs_clarification';
  agentReaction: string;
  questions?: ClarificationQuestion[];
  letter?: RapLetter;
  selectedPhotoIndex?: number;
}

export const HIP_HOP_PHOTOS = [
  {
    id: 'ice_cube_fence',
    src: '/assets/aistudio/Screenshot_2026-11-05_at_2.50.05_PM_a7146af3.png',
    alt: '90s hip-hop fish-eye portrait with fist forward',
    title: 'Direct Confrontation',
    tagline: 'Straightforward & Brutally Honest',
  },
  {
    id: 'ice_cube_rooftop',
    src: '/assets/aistudio/Screenshot_2026-11-05_at_2.50.10_PM_d2720605.png',
    alt: '90s fish-eye rooftop reaching hands towards camera',
    title: 'Reaching The Offender',
    tagline: 'High Energy & Unapologetic Truth',
  },
  {
    id: 'jayz_walkman',
    src: '/assets/aistudio/Screenshot_2026-11-05_at_2.50.17_PM_ddb09a2e.png',
    alt: '90s film photo listening to headphones on park bench',
    title: 'Street-Level Storytelling',
    tagline: 'Classic 90s Beat & Poetic Catharsis',
  },
];

export const SIMPLE_SUGGESTIONS = [
  {
    label: 'Upstairs neighbor tap-dancing at 2am',
    target: 'Upstairs Neighbor',
    detail: 'Walking like they wear concrete boots at 2:30 AM, shaking my ceiling fan right before my early morning standup.',
    photoIndex: 0,
  },
  {
    label: 'Stolen lunch from the work fridge',
    target: 'The Sandwich Bandit',
    detail: 'Devoured my clearly labeled gourmet panini with three sticky notes before noon without leaving a crumb.',
    photoIndex: 1,
  },
  {
    label: "Roommate leaving crusty pans 'soaking'",
    target: 'Roommate in the Kitchen',
    detail: 'Left a greasy skillet soaking in murky sink water for four days straight until a new ecosystem developed.',
    photoIndex: 2,
  },
];
