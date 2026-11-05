import { RapLetter } from '../types/agent';

export function createClientFallbackLetter(frustration: string, target: string): { letter: RapLetter; reaction: string } {
  const cleanTarget = target.trim() || 'The Offender';
  const cleanFrustration = frustration.trim();
  const lower = cleanFrustration.toLowerCase();

  let v1_line1 = 'I gotta keep it candid, keep it 100 percent real,';
  let v1_line2 = 'The way you act on this block is an awful kind of deal.';
  let v1_line3 = 'Left a polite little note hoping common sense would click,';
  let v1_line4 = 'Two weeks later and the same old selfish trick!';

  let hook_line1 = 'Move on up, let the block breathe free,';
  let hook_line2 = 'Basic respect is what everybody wants to see!';
  let hook_line3 = 'No bad blood, no damage to the door,';
  let hook_line4 = 'Just common decency and room for one more!';

  if (lower.includes('park') || lower.includes('car') || lower.includes('space') || lower.includes('street')) {
    v1_line1 = 'Hogging four whole spots like you own the public street,';
    v1_line2 = 'Circling around in San Francisco is an Olympic feat.';
    v1_line3 = 'Left a friendly sticky note asking you to move ahead,';
    v1_line4 = 'Took the note and left the car parked like cement instead!';

    hook_line1 = 'Pull that whip forward, share up the street,';
    hook_line2 = 'Finding legal parking shouldn’t feel like defeat!';
  } else if (lower.includes('stomp') || lower.includes('noise') || lower.includes('loud') || lower.includes('ceiling') || lower.includes('neighbor')) {
    v1_line1 = 'Stomping on the floor like you wearing concrete shoes,';
    v1_line2 = 'Midnight bowling practice got me singing the blues.';
    v1_line3 = 'My ceiling chandelier is vibrating through the night,';
    v1_line4 = 'I got an early morning meeting and this just ain’t right!';

    hook_line1 = 'Turn down the bass, lighten up your tread,';
    hook_line2 = 'Eight whole hours of sleep is what we need in bed!';
  } else if (lower.includes('fridge') || lower.includes('food') || lower.includes('lunch') || lower.includes('sandwich')) {
    v1_line1 = 'Put three sticky notes on my turkey pesto sub,';
    v1_line2 = 'Someone devoured it before noon with zero love.';
    v1_line3 = 'Communal fridge etiquette is practically in the dust,';
    v1_line4 = 'Stealing lunch at work completely breaks the office trust!';

    hook_line1 = 'Pack your own meal, keep your fingers clear,';
    hook_line2 = 'That wasn’t your sandwich sitting over here!';
  }

  return {
    reaction: `Yo! CFR here on the mic. We took that whole mess with "${cleanTarget}" and spun it into pure 90s lyrical catharsis!`,
    letter: {
      title: 'Official Notice of Grievance (The 90s Boom-Bap Cut)',
      recipient: cleanTarget,
      subject: `Formal Notice: ${cleanFrustration.slice(0, 40)}`,
      verses: [
        {
          title: 'Verse 1: The Disturbance',
          lines: [v1_line1, v1_line2, v1_line3, v1_line4]
        },
        {
          title: 'Verse 2: The Resolution',
          lines: [
            'We share the pavement and we share the city air,',
            'All it takes is two seconds to show somebody that you care.',
            'Pull forward two feet, do the right thing for once,',
            'Because acting like you own the block is acting like a dunce!'
          ]
        }
      ],
      chorus: {
        title: 'The Hook',
        lines: [hook_line1, hook_line2, hook_line3, hook_line4]
      },
      outro: 'Take this letter with a smile, but pull your car forward. Peace.',
      signOff: 'Sincerely, The Aggrieved & Cathartic Fun Rapper'
    }
  };
}
