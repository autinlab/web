import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';

interface InternPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AnswerKey = 'level' | 'duration' | 'coding' | 'style' | 'interest';

type AnswerState = Partial<Record<AnswerKey, string>>;

type CompletedAnswers = Record<AnswerKey, string>;

interface PlannerOption {
  value: string;
  label: string;
  hint: string;
}

interface PlannerQuestion {
  key: AnswerKey;
  title: string;
  description: string;
  options: PlannerOption[];
}

interface PlannerProject {
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

interface RankedProject extends PlannerProject {
  score: number;
}

interface ContactDraft {
  name: string;
  email: string;
  background: string;
  notes: string;
}

interface EmailDraft {
  subject: string;
  body: string;
}

const plannerQuestions: PlannerQuestion[] = [
  {
    key: 'level',
    title: 'Student level',
    description: 'Start with expected independence and depth.',
    options: [
      { value: 'highschool', label: 'High School', hint: 'Short scope, visible outputs, lower technical risk' },
      { value: 'undergrad', label: 'Undergrad', hint: 'Moderate independence with coding or analysis' },
      { value: 'grad', label: 'Graduate', hint: 'Higher autonomy and more technical depth' },
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

const plannerProjects: PlannerProject[] = [
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

const initialContactDraft: ContactDraft = {
  name: '',
  email: '',
  background: '',
  notes: '',
};

function getOptionLabel(key: AnswerKey, value?: string) {
  if (!value) {
    return 'Not answered';
  }

  const question = plannerQuestions.find((item) => item.key === key);
  return question?.options.find((option) => option.value === value)?.label ?? value;
}

function scoreProjects(answers: CompletedAnswers): RankedProject[] {
  return plannerProjects
    .map((project) => {
      let score = 0;

      if (project.levels.includes(answers.level)) score += 8;
      if (project.duration.includes(answers.duration)) score += 6;
      if (project.coding.includes(answers.coding)) score += 5;
      if (project.styles.includes(answers.style)) score += 6;
      if (project.interests.includes(answers.interest)) score += 6;

      if (answers.level === 'highschool' && project.id.startsWith('HS')) score += 3;
      if (answers.level === 'undergrad' && project.id.startsWith('UG')) score += 3;
      if (answers.level === 'grad' && project.id.startsWith('GR')) score += 3;

      if (answers.duration === 'short' && ['GR-1', 'GR-2', 'UG-1', 'UG-4', 'UG-5', 'UG-6', 'UG-7'].includes(project.id)) {
        score -= 4;
      }

      if (answers.coding === 'low' && ['UG-1', 'UG-2', 'UG-3', 'UG-4', 'UG-5', 'UG-7', 'GR-1', 'GR-2'].includes(project.id)) {
        score -= 5;
      }

      if (answers.style === 'hands_on' && !['HS-1', 'HS-5'].includes(project.id)) {
        score -= 1;
      }

      return { ...project, score };
    })
    .sort((left, right) => right.score - left.score);
}

function matchReasons(project: RankedProject, answers: CompletedAnswers) {
  const reasons: string[] = [];

  if (project.levels.includes(answers.level)) reasons.push(`Scoped well for ${getOptionLabel('level', answers.level)} students`);
  if (project.duration.includes(answers.duration)) reasons.push('Fits the available project window');
  if (project.coding.includes(answers.coding)) reasons.push('Matches the expected coding comfort');
  if (project.styles.includes(answers.style)) reasons.push('Fits the preferred work style');
  if (project.interests.includes(answers.interest)) reasons.push('Aligned with the main scientific interest');

  return reasons.slice(0, 3);
}

function recommendationTone(score: number) {
  if (score >= 28) {
    return 'bg-emerald-500/15 border-emerald-400/40 text-emerald-200';
  }

  if (score >= 22) {
    return 'bg-cyan-500/15 border-cyan-400/40 text-cyan-200';
  }

  if (score >= 16) {
    return 'bg-amber-500/15 border-amber-400/40 text-amber-200';
  }

  return 'bg-slate-700/50 border-slate-500/50 text-slate-200';
}

function buildEmailDraft(
  answers: CompletedAnswers,
  recommendations: RankedProject[],
  contactDraft: ContactDraft,
): EmailDraft {
  const topMatches = recommendations.slice(0, 3);
  const candidateName = contactDraft.name.trim() || 'Future Lab Member';
  const subject = `LabIntern planner inquiry - ${candidateName}`;
  const bodyLines = [
    'Hi Ludo,',
    '',
    'I used the LabIntern planner on the lab website and wanted to reach out.',
    '',
    'Candidate details',
    `Name: ${contactDraft.name.trim() || 'Not provided'}`,
    `Email: ${contactDraft.email.trim() || 'Not provided'}`,
    `Background: ${contactDraft.background.trim() || 'Not provided'}`,
    `Notes: ${contactDraft.notes.trim() || 'Not provided'}`,
    '',
    'Planner answers',
    `Student level: ${getOptionLabel('level', answers.level)}`,
    `Project length: ${getOptionLabel('duration', answers.duration)}`,
    `Coding comfort: ${getOptionLabel('coding', answers.coding)}`,
    `Work style: ${getOptionLabel('style', answers.style)}`,
    `Scientific interest: ${getOptionLabel('interest', answers.interest)}`,
    '',
    'Top recommended projects',
    ...topMatches.flatMap((project, index) => [
      `${index + 1}. ${project.title} (${project.id})`,
      `   Lane: ${project.lane}`,
      `   Mentor load: ${project.mentorLoad}`,
      `   Why it fits: ${matchReasons(project, answers).join('; ') || 'General fit'}`,
      `   Summary: ${project.summary}`,
    ]),
    '',
    'Best,',
    contactDraft.name.trim() || 'A future lab member',
  ];

  return {
    subject,
    body: bodyLines.join('\n'),
  };
}

function buildPostdocEmailDraft(contactDraft: ContactDraft): EmailDraft {
  const candidateName = contactDraft.name.trim() || 'Postdoc Candidate';
  const subject = `Postdoc interest - ${candidateName}`;
  const bodyLines = [
    'Hi Ludo,',
    '',
    'I saw the postdoc note in the LabIntern planner and still wanted to reach out.',
    '',
    'Candidate details',
    `Name: ${contactDraft.name.trim() || 'Not provided'}`,
    `Email: ${contactDraft.email.trim() || 'Not provided'}`,
    `Background: ${contactDraft.background.trim() || 'Not provided'}`,
    `Notes: ${contactDraft.notes.trim() || 'Not provided'}`,
    '',
    'I understand there is no funded postdoc opportunity listed right now, but I would still be interested in discussing potential fit, collaborations, or fellowship-aligned options.',
    '',
    'Best,',
    contactDraft.name.trim() || 'A prospective postdoc',
  ];

  return {
    subject,
    body: bodyLines.join('\n'),
  };
}

interface ContactPanelProps {
  copyState: 'idle' | 'copied' | 'error';
  contactDraft: ContactDraft;
  emailDraft: EmailDraft | null;
  intro: React.ReactNode;
  mailtoLink: string;
  onChange: (field: keyof ContactDraft, value: string) => void;
  onCopy: () => void;
}

const ContactPanel: React.FC<ContactPanelProps> = ({
  copyState,
  contactDraft,
  emailDraft,
  intro,
  mailtoLink,
  onChange,
  onCopy,
}) => (
  <div className="mt-8 grid gap-6 rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-6 md:grid-cols-[1.15fr_0.85fr]">
    <div>
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-science-teal/30 bg-science-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-science-teal">
        Contact Step
      </div>
      <h4 className="font-display text-2xl font-bold text-white">Send the planner result to Ludo</h4>
      <div className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">{intro}</div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">Name</span>
          <input
            type="text"
            value={contactDraft.name}
            onChange={(event) => onChange('name', event.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-science-teal"
            placeholder="Future lab member"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">Email</span>
          <input
            type="email"
            value={contactDraft.email}
            onChange={(event) => onChange('email', event.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-science-teal"
            placeholder="name@school.edu"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">Background</span>
          <input
            type="text"
            value={contactDraft.background}
            onChange={(event) => onChange('background', event.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-science-teal"
            placeholder="School, major, program, and availability"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">Notes</span>
          <textarea
            value={contactDraft.notes}
            onChange={(event) => onChange('notes', event.target.value)}
            className="min-h-[140px] w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-science-teal"
            placeholder="Research interests, portfolio links, GitHub, or anything else worth seeing."
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={mailtoLink}
          className="inline-flex items-center justify-center rounded-full bg-science-teal px-6 py-3 text-sm font-bold text-slate-950 transition-transform hover:scale-[1.02]"
        >
          Email my planner summary
        </a>

        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-science-purple hover:text-white"
        >
          Copy summary
        </button>
      </div>

      <p className="mt-3 text-sm text-slate-500">
        {copyState === 'copied' && 'Summary copied. If no mail app opens, paste it into an email manually.'}
        {copyState === 'error' && 'Copy failed. You can still use the email button above.'}
        {copyState === 'idle' && 'The email opens as a draft in the visitor’s default mail client.'}
      </p>
    </div>

    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/70 p-5">
      <h5 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Message Preview</h5>
      <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap break-words font-sans text-sm leading-6 text-slate-300">
        {emailDraft?.body}
      </pre>
    </div>
  </div>
);

const InternPlannerModal: React.FC<InternPlannerModalProps> = ({ isOpen, onClose }) => {
  const [answers, setAnswers] = useState<AnswerState>({});
  const [contactDraft, setContactDraft] = useState<ContactDraft>(initialContactDraft);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const isPostdocPath = answers.level === 'postdoc';
  const hasFullPlannerAnswers = plannerQuestions.every((question) => typeof answers[question.key] === 'string');
  const completedAnswers = (!isPostdocPath && hasFullPlannerAnswers ? answers : null) as CompletedAnswers | null;

  const ranking = useMemo(() => {
    if (!completedAnswers) {
      return [];
    }

    return scoreProjects(completedAnswers);
  }, [completedAnswers]);

  const emailDraft = useMemo(() => {
    if (isPostdocPath) {
      return buildPostdocEmailDraft(contactDraft);
    }

    if (!completedAnswers) {
      return null;
    }

    return buildEmailDraft(completedAnswers, ranking, contactDraft);
  }, [completedAnswers, contactDraft, isPostdocPath, ranking]);

  if (!isOpen) {
    return null;
  }

  const handleSelect = (key: AnswerKey, value: string) => {
    const currentIndex = plannerQuestions.findIndex((question) => question.key === key);
    const nextAnswers: AnswerState = { ...answers, [key]: value };

    for (let index = currentIndex + 1; index < plannerQuestions.length; index += 1) {
      delete nextAnswers[plannerQuestions[index].key];
    }

    setAnswers(nextAnswers);
    setCopyState('idle');

    window.setTimeout(() => {
      const nextQuestion = plannerQuestions[currentIndex + 1];
      const nextElementId = key === 'level' && value === 'postdoc'
        ? 'planner-results'
        : nextQuestion
          ? `planner-question-${nextQuestion.key}`
          : 'planner-results';
      document.getElementById(nextElementId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  const handleStartOver = () => {
    setAnswers({});
    setContactDraft(initialContactDraft);
    setCopyState('idle');
    window.setTimeout(() => {
      document.getElementById('planner-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleCopySummary = async () => {
    if (!emailDraft) {
      return;
    }

    try {
      await navigator.clipboard.writeText(emailDraft.body);
      setCopyState('copied');
    } catch (error) {
      console.error('Could not copy planner summary', error);
      setCopyState('error');
    }
  };

  const handleContactDraftChange = (field: keyof ContactDraft, value: string) => {
    setContactDraft({ ...contactDraft, [field]: value });
    setCopyState('idle');
  };

  const visibleQuestions = isPostdocPath
    ? plannerQuestions.slice(0, 1)
    : plannerQuestions.filter((_, index) => index === 0 || answers[plannerQuestions[index - 1].key]);
  const mailtoLink = emailDraft
    ? `mailto:autin@scripps.edu?subject=${encodeURIComponent(emailDraft.subject)}&body=${encodeURIComponent(emailDraft.body)}`
    : 'mailto:autin@scripps.edu';

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[120] bg-slate-950/90 backdrop-blur-md p-4 md:p-8">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-slate-700/70 bg-slate-900 shadow-2xl shadow-black/50">
        <div className="flex items-start justify-between gap-6 border-b border-slate-800 bg-slate-950/90 px-6 py-5 md:px-8">
          <div id="planner-top">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-science-teal/30 bg-science-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-science-teal">
              LabIntern
            </div>
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">Future Lab Member Planner</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400 md:text-base">
              Walk through the decision tree, review the best-fit internship ideas, and finish with a prefilled message to Ludo.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-700 bg-slate-900 p-2 text-slate-400 transition-colors hover:border-science-teal hover:text-white"
            aria-label="Close LabIntern planner"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6 md:px-8 md:py-8">
          <div className="mb-8 grid gap-4 rounded-[1.75rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 md:grid-cols-[1.4fr_0.9fr]">
            <div>
              <h3 className="font-display text-2xl font-bold text-white">Use the same “Next?” entry point, but give it actual structure.</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                This flow translates the LabIntern decision tree into the site, ranks feasible projects, and packages the output into a message you can review before sending.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Progress</div>
              <div className="mt-4 flex items-center gap-3">
                {plannerQuestions.map((question, index) => {
                  const answered = Boolean(answers[question.key]);
                  const active = visibleQuestions[visibleQuestions.length - 1]?.key === question.key && !answered;

                  return (
                    <React.Fragment key={question.key}>
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
                          answered
                            ? 'border-science-teal bg-science-teal text-slate-950'
                            : active
                              ? 'border-science-purple bg-science-purple/15 text-science-purple'
                              : 'border-slate-700 bg-slate-900 text-slate-500'
                        }`}
                      >
                        {index + 1}
                      </div>
                      {index < plannerQuestions.length - 1 && (
                        <div className={`h-px flex-1 ${answered ? 'bg-science-teal/60' : 'bg-slate-700'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {visibleQuestions.map((question, index) => (
              <section
                key={question.key}
                id={`planner-question-${question.key}`}
                className="relative overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/10 md:p-8"
              >
                <div className="absolute right-5 top-5 rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Step {index + 1}
                </div>

                <div className="mb-8 max-w-2xl">
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-science-teal/20 to-science-purple/20 text-lg font-bold text-white">
                    {index + 1}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white md:text-3xl">{question.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400 md:text-base">{question.description}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {question.options.map((option) => {
                    const isSelected = answers[question.key] === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(question.key, option.value)}
                        className={`rounded-[1.5rem] border p-5 text-left transition-all ${
                          isSelected
                            ? 'border-science-teal bg-science-teal/10 shadow-lg shadow-science-teal/10'
                            : 'border-slate-700 bg-slate-950/70 hover:-translate-y-0.5 hover:border-science-purple/60 hover:bg-slate-950'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className={`text-lg font-semibold ${isSelected ? 'text-science-teal' : 'text-white'}`}>{option.label}</div>
                            <p className="mt-2 text-sm leading-6 text-slate-400">{option.hint}</p>
                          </div>
                          {isSelected && (
                            <div className="mt-1 rounded-full bg-science-teal p-1 text-slate-950">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}

            {isPostdocPath && (
              <section
                id="planner-results"
                className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 md:p-8"
              >
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-200">
                      Postdoc Note
                    </div>
                    <h3 className="font-display text-3xl font-bold text-white md:text-4xl">No funded postdoc opportunity listed right now</h3>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                      We do not have a dedicated postdoc funding opportunity in the lab at the moment. That said, if your research overlaps strongly with the lab, or if you have fellowship or external funding options, it is still worth reaching out directly.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartOver}
                    className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-science-teal hover:text-white"
                  >
                    Start over
                  </button>
                </div>

                <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">What to include</h4>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm leading-6 text-slate-300">
                      A short statement about research fit with mesoscale modeling, molecular graphics, or related methods.
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm leading-6 text-slate-300">
                      Any current or planned fellowship, grant, or independent funding path.
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm leading-6 text-slate-300">
                      Links to recent papers, code, portfolio work, or a current CV.
                    </div>
                  </div>
                </div>

                <ContactPanel
                  copyState={copyState}
                  contactDraft={contactDraft}
                  emailDraft={emailDraft}
                  intro={
                    <>
                      Fill in a bit of context, then the planner will open a prefilled message to <span className="text-white">autin@scripps.edu</span>. The draft explains that there is no funded postdoc opening listed right now, but the candidate still wants to connect.
                    </>
                  }
                  mailtoLink={mailtoLink}
                  onChange={handleContactDraftChange}
                  onCopy={handleCopySummary}
                />
              </section>
            )}

            {completedAnswers && (
              <section
                id="planner-results"
                className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 md:p-8"
              >
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-science-purple/30 bg-science-purple/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-science-purple">
                      Ranked Matches
                    </div>
                    <h3 className="font-display text-3xl font-bold text-white md:text-4xl">Best-fit project directions</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                      These are the top recommendations from the planner based on feasibility, fit, and likely mentor load.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartOver}
                    className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-science-teal hover:text-white"
                  >
                    Start over
                  </button>
                </div>

                <div className="grid gap-5">
                  {ranking.slice(0, 3).map((project, index) => (
                    <article
                      key={project.id}
                      className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="mb-3 flex flex-wrap items-center gap-3">
                            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                              Rank {index + 1}
                            </span>
                            <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${recommendationTone(project.score)}`}>
                              Score {project.score}
                            </span>
                          </div>
                          <h4 className="font-display text-2xl font-bold text-white">{project.title}</h4>
                          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">{project.summary}</p>
                        </div>

                        <div className="min-w-[200px] rounded-[1.25rem] border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-300">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-500">ID</span>
                            <span className="font-semibold text-white">{project.id}</span>
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-4">
                            <span className="text-slate-500">Lane</span>
                            <span>{project.lane}</span>
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-4">
                            <span className="text-slate-500">Mentor load</span>
                            <span>{project.mentorLoad}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-6 border-t border-slate-800 pt-6 md:grid-cols-2">
                        <div>
                          <h5 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Why it fits</h5>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {matchReasons(project, completedAnswers).map((reason) => (
                              <span key={reason} className="rounded-full border border-science-teal/30 bg-science-teal/10 px-3 py-1.5 text-sm text-science-teal">
                                {reason}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Expected outputs</h5>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {project.outputs.map((output) => (
                              <span key={output} className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-300">
                                {output}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <ContactPanel
                  copyState={copyState}
                  contactDraft={contactDraft}
                  emailDraft={emailDraft}
                  intro={
                    <>
                      Fill in a bit of context, then the planner will open a prefilled message to <span className="text-white">autin@scripps.edu</span> with the selected answers and project matches.
                    </>
                  }
                  mailtoLink={mailtoLink}
                  onChange={handleContactDraftChange}
                  onCopy={handleCopySummary}
                />
              </section>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default InternPlannerModal;
