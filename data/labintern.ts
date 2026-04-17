// Maintainer notes:
// 1. Update page copy in LABINTERN_PAGE_COPY.
// 2. Add or edit decision-tree answers in PLANNER_QUESTIONS.
// 3. Add, remove, or revise ideas in PLANNER_PROJECTS.
// 4. Update special non-internship routes in GRAD_ROUTE_COPY and POSTDOC_ROUTE_COPY.
// 5. Scoring rules live in /web/lib/labintern.ts.

export type AnswerKey = 'level' | 'duration' | 'coding' | 'style' | 'interest';

export type AnswerState = Partial<Record<AnswerKey, string>>;

export type CompletedAnswers = Record<AnswerKey, string>;

export interface PlannerOption {
  value: string;
  label: string;
  hint: string;
}

export interface PlannerQuestion {
  key: AnswerKey;
  title: string;
  description: string;
  options: PlannerOption[];
}

export interface PlannerProject {
  id: string;
  title: string;
  summary: string;
  levels: string[];
  duration: string[];
  coding: string[];
  styles: string[];
  interests: string[];
  outputs: string[];
  tags: string[];
  lane: string;
  mentorLoad: string;
}

export interface RankedProject extends PlannerProject {
  score: number;
}

export interface ContactDraft {
  name: string;
  email: string;
  background: string;
  notes: string;
}

export interface EmailDraft {
  subject: string;
  body: string;
}

export interface RouteCopy {
  badge: string;
  title: string;
  description: string;
  detailTitle: string;
  details: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  ctaDescription?: string;
  followup?: string;
  contactIntro?: string;
}

export const LABINTERN_PAGE_COPY = {
  badge: 'LabIntern',
  title: 'Future Lab Member Planner',
  description: 'Walk through the decision tree, review the best-fit internship ideas, and finish with a prefilled message to Ludo.',
  introTitle: 'Find the right path into the lab.',
  introDescription:
    'This page helps prospective applicants understand which route fits best, from short-term internships to graduate or postdoctoral pathways, and gives each person a clearer next step before reaching out.',
};

export const GRAD_PROGRAM_URL = 'https://education.scripps.edu/graduate/about-the-graduate-school/';

export const GRAD_ROUTE_COPY: RouteCopy = {
  badge: 'PhD Route',
  title: 'Graduate applicants should go through Scripps Graduate School',
  description:
    'This track is better treated as a PhD application rather than a short-term internship match. For four-year graduate training, the right entry point is the Scripps Graduate School program.',
  detailTitle: 'Why this path',
  details: [
    'A PhD is a long-form training program, not a short-term intern-style placement.',
    'Admissions, rotations, and funding are handled through the graduate school structure.',
    'The LabIntern decision tree is better reserved for high school, undergraduate, and short research-placement cases.',
  ],
  ctaLabel: 'Open Scripps Graduate School',
  ctaUrl: GRAD_PROGRAM_URL,
  ctaDescription: 'Review the graduate program details, admissions structure, and application path here:',
  followup:
    'If someone is specifically interested in our lab, they can mention that in their graduate application materials and then reach out separately once they are in the proper admissions pipeline.',
};

export const POSTDOC_ROUTE_COPY: RouteCopy = {
  badge: 'Postdoc Note',
  title: 'No funded postdoc opportunity listed right now',
  description:
    'We do not have a dedicated postdoc funding opportunity in the lab at the moment. That said, if your research overlaps strongly with the lab, or if you have fellowship or external funding options, it is still worth reaching out directly.',
  detailTitle: 'What to include',
  details: [
    'A short statement about research fit with mesoscale modeling, molecular graphics, or related methods.',
    'Any current or planned fellowship, grant, or independent funding path.',
    'Links to recent papers, code, portfolio work, or a current CV.',
  ],
  contactIntro:
    'Fill in a bit of context, then the planner will open a prefilled message to autin@scripps.edu. The draft explains that there is no funded postdoc opening listed right now, but the candidate still wants to connect.',
};

export const INITIAL_CONTACT_DRAFT: ContactDraft = {
  name: '',
  email: '',
  background: '',
  notes: '',
};

export const PLANNER_QUESTIONS: PlannerQuestion[] = [
  {
    key: 'level',
    title: 'Student level',
    description: 'Start with expected independence and depth.',
    options: [
      { value: 'highschool', label: 'High School', hint: 'Short scope, visible outputs, lower technical risk' },
      { value: 'undergrad', label: 'Undergrad', hint: 'Moderate independence with coding or analysis' },
      { value: 'grad', label: 'Graduate (PhD)', hint: 'PhD-track applicants should go through the Scripps Graduate School program' },
      { value: 'postdoc', label: 'Postdoc', hint: 'Independent researchers can still reach out even when funding is limited' },
    ],
  },
  {
    key: 'duration',
    title: 'Project length',
    description: 'Match ambition to the calendar, not to optimism.',
    options: [
      { value: 'short', label: 'About 1 month', hint: 'Best for high school or a compact summer slot' },
      { value: 'medium', label: 'About 2 months', hint: 'Best for SURF, REACH, or deeper undergraduate work' },
    ],
  },
  {
    key: 'coding',
    title: 'Coding comfort',
    description: 'Enough skill to finish matters more than theoretical interest.',
    options: [
      { value: 'low', label: 'Low', hint: 'Little to no coding' },
      { value: 'medium', label: 'Moderate', hint: 'Can use notebooks and adapt scripts' },
      { value: 'high', label: 'Strong', hint: 'Can build and debug independently' },
    ],
  },
  {
    key: 'style',
    title: 'Preferred work style',
    description: 'This usually predicts success better than raw CV sparkle.',
    options: [
      { value: 'hands_on', label: 'Hands-on / fabrication', hint: '3D printing, assembly, testing' },
      { value: 'visual', label: 'Visual / communication', hint: 'Stories, demos, design, educational material' },
      { value: 'data', label: 'Data / images', hint: 'Masks, datasets, comparisons, evaluation' },
      { value: 'software', label: 'Software / engineering', hint: 'Features, viewers, clean tools' },
      { value: 'research', label: 'Research / modeling', hint: 'Geometry, methods, simulations' },
      { value: 'organize', label: 'Documentation / coordination', hint: 'Tracking, GitHub structure, reproducibility' },
    ],
  },
  {
    key: 'interest',
    title: 'Main scientific interest',
    description: 'Pick the lane most likely to keep the student engaged.',
    options: [
      { value: 'outreach', label: 'Outreach & education', hint: 'Virus Lesson, demos, teaching tools' },
      { value: 'cellpaint', label: 'CellPaint', hint: 'Interactive painting, UI/UX, educational scenes' },
      { value: 'ml', label: 'AI / segmentation', hint: 'Masks, predictions, benchmarking' },
      { value: 'capsid', label: 'Capsid geometry', hint: 'Mesh, fullerene, assembly structure' },
      { value: 'molstar', label: 'Mol* / Mesoscope', hint: 'Viewer features and molecular visualization' },
      { value: 'sim', label: 'Simulation & cellPACK', hint: 'Exports, formats, model-to-sim workflows, recipes' },
      { value: 'general', label: 'General / mixed', hint: 'Keep options open and flexible' },
    ],
  },
];

export const PLANNER_PROJECTS: PlannerProject[] = [
  {
    id: 'HS-1',
    title: 'Virus Capsid 3D-Print Education Kit',
    summary: 'Build and test a polished physical teaching kit with pentamers, hexamers, and assembly activities that complements The Virus Lesson demos.',
    levels: ['highschool', 'undergrad'],
    duration: ['short'],
    coding: ['low', 'medium'],
    styles: ['hands_on', 'visual'],
    interests: ['outreach', 'capsid', 'general'],
    outputs: ['Printable STL set', 'Assembly guide', 'Photo/video documentation', 'GitHub repo'],
    tags: ['Low risk', 'Outreach', 'Hands-on'],
    lane: 'Physical',
    mentorLoad: 'Low',
  },
  {
    id: 'HS-2',
    title: 'Mini Segmentation Curation and Visualization',
    summary: 'Curate a tiny synthetic or cropped tomogram dataset with masks and build a clear visual comparison gallery of prediction quality.',
    levels: ['highschool', 'undergrad'],
    duration: ['short', 'medium'],
    coding: ['medium', 'high'],
    styles: ['data', 'visual'],
    interests: ['ml', 'general'],
    outputs: ['Small benchmark dataset', 'Viewer/gallery', 'Error notes', 'GitHub repo'],
    tags: ['AI exposure', 'Visual', 'Feasible'],
    lane: 'Data',
    mentorLoad: 'Low-Medium',
  },
  {
    id: 'HS-3',
    title: 'MolViewStory for Protein, Virus or Cells',
    summary: 'Create an interactive molecular story with scenes, captions, and guided views for teaching, outreach, or recruitment.',
    levels: ['highschool', 'undergrad'],
    duration: ['short', 'medium'],
    coding: ['low', 'medium'],
    styles: ['visual'],
    interests: ['outreach', 'molstar', 'general'],
    outputs: ['Interactive story', 'Captions/script', 'Screenshots', 'Short demo video'],
    tags: ['Reusable', 'Communication', 'Low risk'],
    lane: 'Storytelling',
    mentorLoad: 'Low',
  },
  {
    id: 'HS-4',
    title: 'GitHub Progress Dashboard',
    summary: 'Create a clean project-tracking system with milestones, issue templates, progress reporting, and internship documentation.',
    levels: ['highschool', 'undergrad'],
    duration: ['short'],
    coding: ['low', 'medium'],
    styles: ['organize', 'software'],
    interests: ['general'],
    outputs: ['Project board', 'Milestones', 'Templates', 'README'],
    tags: ['Very low risk', 'Operations', 'Open science'],
    lane: 'Organization',
    mentorLoad: 'Low',
  },
  {
    id: 'HS-5',
    title: 'CellPaint Educational Gallery',
    summary: 'Use CellPaint to construct scientifically accurate, visually engaging 2D/3D scenes of cellular environments for outreach and education.',
    levels: ['highschool', 'undergrad'],
    duration: ['short', 'medium'],
    coding: ['low'],
    styles: ['visual', 'hands_on'],
    interests: ['cellpaint', 'outreach', 'general'],
    outputs: ['Curated scene gallery', 'Educational captions', 'Outreach presentation'],
    tags: ['Art', 'Biology', 'Outreach'],
    lane: 'Storytelling',
    mentorLoad: 'Low',
  },
  {
    id: 'UG-1',
    title: 'Mini Ghost-in-the-Cell Pipeline',
    summary: 'Build a scoped end-to-end pilot from model generation to phantom tomogram to packaged masks, focusing on reproducibility and clean outputs.',
    levels: ['undergrad', 'grad'],
    duration: ['medium'],
    coding: ['medium', 'high'],
    styles: ['data', 'research'],
    interests: ['ml', 'sim', 'general'],
    outputs: ['Scripts', 'Mini dataset', 'README', 'Poster-ready figure'],
    tags: ['Core project', 'Reproducible', 'Pipeline'],
    lane: 'Pipeline',
    mentorLoad: 'Medium',
  },
  {
    id: 'UG-2',
    title: 'Synthetic Tomogram Segmentation Benchmark',
    summary: 'Compare a small number of segmentation strategies on a focused synthetic benchmark and summarize where each method succeeds or fails.',
    levels: ['undergrad', 'grad'],
    duration: ['medium'],
    coding: ['medium', 'high'],
    styles: ['data', 'research'],
    interests: ['ml'],
    outputs: ['Benchmark scripts', 'Metrics', 'Figures', 'Summary report'],
    tags: ['Benchmarking', 'AI', 'Clear outcome'],
    lane: 'AI',
    mentorLoad: 'Medium',
  },
  {
    id: 'UG-3',
    title: 'Mesoscope / Mol* Mini-Feature',
    summary: 'Ship one practical feature such as .star loading, .tbl loading, a gizmo, or a modernized viewer workflow.',
    levels: ['undergrad', 'grad'],
    duration: ['medium'],
    coding: ['medium', 'high'],
    styles: ['software'],
    interests: ['molstar', 'general'],
    outputs: ['Working feature', 'Demo file', 'Technical notes', 'Walkthrough video'],
    tags: ['Software', 'GitHub visible', 'Professional'],
    lane: 'Software',
    mentorLoad: 'Medium',
  },
  {
    id: 'UG-4',
    title: 'Simulation Export Bridge',
    summary: 'Prototype one exporter from cellPACK-style models into a simulation-friendly format such as bentopy, .gro, or .lammps.',
    levels: ['undergrad', 'grad'],
    duration: ['medium'],
    coding: ['medium', 'high'],
    styles: ['software', 'research'],
    interests: ['sim'],
    outputs: ['Exporter', 'Example input/output', 'Validation notes', 'Documentation'],
    tags: ['Simulation', 'Modular', 'Technical'],
    lane: 'Simulation',
    mentorLoad: 'Medium',
  },
  {
    id: 'UG-5',
    title: 'CellPaint Feature Development',
    summary: 'Develop new interactive features for CellPaint, such as advanced brush mechanics, 3D export capabilities, or performance optimizations for large scenes.',
    levels: ['undergrad', 'grad'],
    duration: ['medium'],
    coding: ['medium', 'high'],
    styles: ['software'],
    interests: ['cellpaint', 'general'],
    outputs: ['Merged PRs', 'Feature documentation', 'Demo scene'],
    tags: ['Software', 'Interactive', 'WebDev'],
    lane: 'Software',
    mentorLoad: 'Medium',
  },
  {
    id: 'UG-6',
    title: 'cellPACK Recipe Curation & Validation',
    summary: 'Curate and validate biological recipes for cellPACK, ensuring correct stoichiometries and molecular structures for a specific organelle or virus.',
    levels: ['undergrad', 'grad'],
    duration: ['medium'],
    coding: ['low', 'medium'],
    styles: ['data', 'research'],
    interests: ['sim', 'general'],
    outputs: ['Validated recipe file', 'Rendered images', 'Biological reference document'],
    tags: ['Biology', 'Modeling', 'Data'],
    lane: 'Data',
    mentorLoad: 'Low-Medium',
  },
  {
    id: 'UG-7',
    title: 'WebXR Molecular Experience',
    summary: 'Prototype a WebXR or VR experience using Mol* or A-Frame to let users step inside a cellPACK model or interact with a virus capsid.',
    levels: ['undergrad', 'grad'],
    duration: ['medium'],
    coding: ['medium', 'high'],
    styles: ['software', 'visual'],
    interests: ['outreach', 'molstar'],
    outputs: ['WebXR prototype', 'User testing notes', 'Demo video'],
    tags: ['VR/AR', 'Interactive', 'Outreach'],
    lane: 'Software',
    mentorLoad: 'High',
  },
  {
    id: 'GR-1',
    title: 'HIV Capsid Mesh Prototype',
    summary: 'Implement and evaluate one focused strategy to generate HIV capsid mesh geometry, keeping the scope tight and the outputs testable.',
    levels: ['grad', 'undergrad'],
    duration: ['medium'],
    coding: ['high'],
    styles: ['research'],
    interests: ['capsid', 'general'],
    outputs: ['Mesh generator', 'Visualizations', 'Basic metrics', 'Export format'],
    tags: ['Research', 'Geometry', 'Higher risk'],
    lane: 'Geometry',
    mentorLoad: 'High',
  },
  {
    id: 'GR-2',
    title: 'Integrative Modeling to STA Pre-Alignment Prototype',
    summary: 'Explore a focused proof of concept linking surface geometry or mesh-derived normals to downstream subvolume positioning and rotation.',
    levels: ['grad'],
    duration: ['medium'],
    coding: ['high'],
    styles: ['research'],
    interests: ['capsid', 'sim', 'general'],
    outputs: ['Prototype code', 'Geometry tests', 'Validation figures', 'Technical memo'],
    tags: ['Advanced', 'Research', 'Method development'],
    lane: 'Advanced',
    mentorLoad: 'High',
  },
];
