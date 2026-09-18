import {
  type AnswerKey,
  type CompletedAnswers,
  type ContactDraft,
  type EmailDraft,
  PLANNER_PROJECTS,
  PLANNER_QUESTIONS,
  type RankedProject,
} from '../data/labintern';

export function getOptionLabel(key: AnswerKey, value?: string) {
  if (!value) {
    return 'Not answered';
  }

  const question = PLANNER_QUESTIONS.find((item) => item.key === key);
  return question?.options.find((option) => option.value === value)?.label ?? value;
}

export function scoreProjects(answers: CompletedAnswers): RankedProject[] {
  return PLANNER_PROJECTS
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

export function matchReasons(project: RankedProject, answers: CompletedAnswers) {
  const reasons: string[] = [];

  if (project.levels.includes(answers.level)) reasons.push(`Scoped well for ${getOptionLabel('level', answers.level)} students`);
  if (project.duration.includes(answers.duration)) reasons.push('Fits the available project window');
  if (project.coding.includes(answers.coding)) reasons.push('Matches the expected coding comfort');
  if (project.styles.includes(answers.style)) reasons.push('Fits the preferred work style');
  if (project.interests.includes(answers.interest)) reasons.push('Aligned with the main scientific interest');

  return reasons.slice(0, 3);
}

export function recommendationTone(score: number) {
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

export function buildPlannerEmailDraft(
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

export function buildPostdocEmailDraft(contactDraft: ContactDraft): EmailDraft {
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
