import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  type AnswerKey,
  type AnswerState,
  type CompletedAnswers,
  type ContactDraft,
  type EmailDraft,
  GRAD_ROUTE_COPY,
  INITIAL_CONTACT_DRAFT,
  LABINTERN_PAGE_COPY,
  PLANNER_QUESTIONS,
  POSTDOC_ROUTE_COPY,
} from '../data/labintern';
import {
  buildPlannerEmailDraft,
  buildPostdocEmailDraft,
  recommendationTone,
  matchReasons,
  scoreProjects,
} from '../lib/labintern';

interface InternPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  const [contactDraft, setContactDraft] = useState<ContactDraft>(INITIAL_CONTACT_DRAFT);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  const resetPlannerState = () => {
    setAnswers({});
    setContactDraft(INITIAL_CONTACT_DRAFT);
    setCopyState('idle');
  };

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

  useEffect(() => {
    if (!isOpen) {
      resetPlannerState();
    }
  }, [isOpen]);

  const isGradProgramPath = answers.level === 'grad';
  const isPostdocPath = answers.level === 'postdoc';
  const isDirectPath = isGradProgramPath || isPostdocPath;
  const hasFullPlannerAnswers = PLANNER_QUESTIONS.every((question) => typeof answers[question.key] === 'string');
  const completedAnswers = (!isDirectPath && hasFullPlannerAnswers ? answers : null) as CompletedAnswers | null;

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

    return buildPlannerEmailDraft(completedAnswers, ranking, contactDraft);
  }, [completedAnswers, contactDraft, isPostdocPath, ranking]);

  if (!isOpen) {
    return null;
  }

  const handleSelect = (key: AnswerKey, value: string) => {
    const currentIndex = PLANNER_QUESTIONS.findIndex((question) => question.key === key);
    const nextAnswers: AnswerState = { ...answers, [key]: value };

    for (let index = currentIndex + 1; index < PLANNER_QUESTIONS.length; index += 1) {
      delete nextAnswers[PLANNER_QUESTIONS[index].key];
    }

    setAnswers(nextAnswers);
    setCopyState('idle');

    window.setTimeout(() => {
      const nextQuestion = PLANNER_QUESTIONS[currentIndex + 1];
      const nextElementId = key === 'level' && (value === 'postdoc' || value === 'grad')
        ? 'planner-results'
        : nextQuestion
          ? `planner-question-${nextQuestion.key}`
          : 'planner-results';
      document.getElementById(nextElementId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  const handleStartOver = () => {
    resetPlannerState();
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

  const visibleQuestions = isDirectPath
    ? PLANNER_QUESTIONS.slice(0, 1)
    : PLANNER_QUESTIONS.filter((_, index) => index === 0 || answers[PLANNER_QUESTIONS[index - 1].key]);
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
              {LABINTERN_PAGE_COPY.badge}
            </div>
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">{LABINTERN_PAGE_COPY.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400 md:text-base">
              {LABINTERN_PAGE_COPY.description}
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
              <h3 className="font-display text-2xl font-bold text-white">{LABINTERN_PAGE_COPY.introTitle}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                {LABINTERN_PAGE_COPY.introDescription}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Progress</div>
              <div className="mt-4 flex items-center gap-3">
                {PLANNER_QUESTIONS.map((question, index) => {
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
                      {index < PLANNER_QUESTIONS.length - 1 && (
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

            {isGradProgramPath && (
              <section
                id="planner-results"
                className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 md:p-8"
              >
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-science-purple/30 bg-science-purple/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-science-purple">
                      {GRAD_ROUTE_COPY.badge}
                    </div>
                    <h3 className="font-display text-3xl font-bold text-white md:text-4xl">{GRAD_ROUTE_COPY.title}</h3>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                      {GRAD_ROUTE_COPY.description}
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

                <div className="grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6">
                    <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Next step</h4>
                    <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                      {GRAD_ROUTE_COPY.ctaDescription}
                    </p>
                    <a
                      href={GRAD_ROUTE_COPY.ctaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center justify-center rounded-full bg-science-teal px-6 py-3 text-sm font-bold text-slate-950 transition-transform hover:scale-[1.02]"
                    >
                      {GRAD_ROUTE_COPY.ctaLabel}
                    </a>
                    <p className="mt-4 text-sm leading-7 text-slate-400">
                      {GRAD_ROUTE_COPY.followup}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-6">
                    <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{GRAD_ROUTE_COPY.detailTitle}</h4>
                    <div className="mt-4 grid gap-3">
                      {GRAD_ROUTE_COPY.details.map((detail) => (
                        <div key={detail} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm leading-6 text-slate-300">
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {isPostdocPath && (
              <section
                id="planner-results"
                className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 md:p-8"
              >
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-200">
                      {POSTDOC_ROUTE_COPY.badge}
                    </div>
                    <h3 className="font-display text-3xl font-bold text-white md:text-4xl">{POSTDOC_ROUTE_COPY.title}</h3>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                      {POSTDOC_ROUTE_COPY.description}
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
                  <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{POSTDOC_ROUTE_COPY.detailTitle}</h4>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    {POSTDOC_ROUTE_COPY.details.map((detail) => (
                      <div key={detail} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm leading-6 text-slate-300">
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>

                <ContactPanel
                  copyState={copyState}
                  contactDraft={contactDraft}
                  emailDraft={emailDraft}
                  intro={POSTDOC_ROUTE_COPY.contactIntro ?? ''}
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
