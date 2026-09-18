// ─────────────────────────────────────────────────────────────────────────────
// MolViewStories authored by the lab.
//
// LAB_STORIES  — one entry per story, rendered by StoryGalleryModal in order.
//                `url` is either a remote player on molstar.org, or a story
//                hosted under public/playground/ on this site.
//                `imageUrl` is relative to public/.
//                `unlisted: true` hides the card from the gallery while keeping
//                the story reachable by direct link.
// ─────────────────────────────────────────────────────────────────────────────

export interface LabStory {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string; // relative to public/
  credit?: string;
  scenes?: number;
  unlisted?: boolean;
}

const MVS_EXAMPLES = 'https://raw.githubusercontent.com/molstar/mol-view-stories/refs/heads/main/%40mol-view-stories/webapp/public/examples';

/** Build a stories-viewer URL for a story hosted in the mol-view-stories examples. */
const exampleUrl = (name: string) =>
  `https://molstar.org/stories-viewer/v1?story-url=${encodeURIComponent(`${MVS_EXAMPLES}/${name}/story.mvsx`)}` +
  `&data-format=mvsx&story-session-url=${encodeURIComponent(`${MVS_EXAMPLES}/${name}/story.mvstory`)}`;

export const LAB_STORIES: LabStory[] = [
  {
    id: 'morphometrics',
    title: 'From tomogram to measurement: mitochondrial membranes by Surface Morphometrics',
    description: 'Cryo-ET tomogram to segmented surface mesh, then the measurements themselves — mean curvature, inter-membrane distance from both sides, where the bilayer is resolved, and the three regions of the inner membrane. Hosted on this site.',
    url: 'playground/stories/morphometrics_story/index.html',
    imageUrl: 'assets/stories/morphometrics.jpg',
    scenes: 9,
    unlisted: true,
  },
  {
    id: 'andv',
    title: 'ANDV Story',
    description: 'Andes virus from envelope to genome — the glycoprotein lattice, nucleoprotein assembly, and the ribonucleoprotein complex inside, built from cellPACK models with narration.',
    url: 'https://molstar.org/stories-viewer/v1?story-id=774abcd3&data-format=mvsx',
    imageUrl: 'assets/stories/andv.jpg',
    credit: 'Chloe Bayle',
    scenes: 4,
  },
  {
    id: 'terms-of-entrapment',
    title: 'Terms of Entrapment',
    description: 'A long-form tour of Cu/Zn superoxide dismutase: how the beta barrel fold traps its metal ions, and what the symmetry axis and sequence tell us about the enzyme.',
    url: exampleUrl('terms-of-entrapment'),
    imageUrl: 'assets/stories/terms-of-entrapment.jpg',
    scenes: 16,
  },
  {
    id: 'exosome',
    title: 'Exosome CPK',
    description: 'An idealized exosome model explored from the outside in — surface proteins, interior cargo, and the whole vesicle rendered in space-filling representation.',
    url: exampleUrl('exosome'),
    imageUrl: 'assets/stories/exosome.jpg',
    scenes: 5,
  },
  {
    id: 'flagellar-motor',
    title: 'Flagellar Motor',
    description: 'The bacterial flagellar motor and the conformational switch that reverses its direction of rotation.',
    url: exampleUrl('motm-300'),
    imageUrl: 'assets/stories/motm-300.jpg',
    scenes: 4,
  },
  {
    id: 'myoglobin',
    title: 'Molecule of the Month: Myoglobin',
    description: 'The first protein structure ever solved, told as a Molecule of the Month story — oxygen binding at the heme, and why whales carry so much of it.',
    url: exampleUrl('motm-01'),
    imageUrl: 'assets/stories/motm-01.jpg',
    scenes: 5,
  },
];
