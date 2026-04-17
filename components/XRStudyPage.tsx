import React, { useEffect, useState, startTransition } from 'react';
import {
  XR_STUDY_COPY,
  XR_STUDY_STORAGE_KEY,
  XR_SURVEYS,
  type XRSurveyDefinition,
} from '../data/xrStudy';

type CopyState = 'idle' | 'copied' | 'failed';

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const normalizeParticipantCode = (value: string) =>
  value
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 14);

const randomInt = (max: number) => {
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const buffer = new Uint32Array(1);
    window.crypto.getRandomValues(buffer);
    return buffer[0] % max;
  }

  return Math.floor(Math.random() * max);
};

const generateParticipantCode = () =>
  `XR-${Array.from({ length: 6 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join('')}`;

const getInitialParticipantCode = () => {
  if (typeof window === 'undefined') {
    return generateParticipantCode();
  }

  const stored = window.localStorage.getItem(XR_STUDY_STORAGE_KEY);
  return stored ? normalizeParticipantCode(stored) : generateParticipantCode();
};

const buildSurveyUrl = (survey: XRSurveyDefinition, participantCode: string) => {
  const url = new URL(survey.responderUrl);
  url.searchParams.set('embedded', 'true');
  url.searchParams.set('usp', 'pp_url');
  url.searchParams.set(`entry.${survey.participantEntryId}`, participantCode);

  for (const [field, value] of Object.entries(survey.prefills ?? {})) {
    url.searchParams.set(field, value);
  }

  return url.toString();
};

const XRStudyPage: React.FC = () => {
  const [participantCode, setParticipantCode] = useState<string>(getInitialParticipantCode);
  const [activeSurvey, setActiveSurvey] = useState<XRSurveyDefinition | null>(null);
  const [copyState, setCopyState] = useState<CopyState>('idle');

  useEffect(() => {
    if (!participantCode) {
      window.localStorage.removeItem(XR_STUDY_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(XR_STUDY_STORAGE_KEY, participantCode);
  }, [participantCode]);

  useEffect(() => {
    if (!activeSurvey) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveSurvey(null);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [activeSurvey]);

  const openSurvey = (survey: XRSurveyDefinition) => {
    const ensuredCode = normalizeParticipantCode(participantCode) || generateParticipantCode();
    setParticipantCode(ensuredCode);

    startTransition(() => {
      setActiveSurvey(survey);
    });
  };

  const copyParticipantCode = async () => {
    try {
      await navigator.clipboard.writeText(participantCode);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      setCopyState('failed');
      window.setTimeout(() => setCopyState('idle'), 2400);
    }
  };

  const activeSurveyUrl = activeSurvey ? buildSurveyUrl(activeSurvey, participantCode) : '';

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-science-teal/10 blur-3xl" />
        <div className="absolute right-[-12%] top-[12%] h-96 w-96 rounded-full bg-science-purple/10 blur-3xl" />
        <div className="absolute bottom-[-12%] left-[18%] h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-12 sm:px-10 lg:px-12">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-[0_20px_80px_rgba(2,6,23,0.65)] backdrop-blur-xl sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <section>
              <div className="inline-flex items-center gap-2 rounded-full border border-science-teal/30 bg-science-teal/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-science-teal">
                XR Lesson Study
              </div>
              <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {XR_STUDY_COPY.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                {XR_STUDY_COPY.intro}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/8 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Step 1</p>
                  <p className="mt-2 text-sm font-semibold text-white">Keep one code</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Reuse the same participant code for all four surveys.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/8 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Step 2</p>
                  <p className="mt-2 text-sm font-semibold text-white">Launch the survey</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    The student code is prefilled automatically when a survey opens.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/8 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Step 3</p>
                  <p className="mt-2 text-sm font-semibold text-white">Return here</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Submit the Google Form, then close the survey modal to continue.
                  </p>
                </div>
              </div>
            </section>

            <aside className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.45)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Participant code
              </p>
              <div className="mt-4 rounded-3xl border border-science-teal/30 bg-slate-950/80 p-5">
                <label className="block text-sm font-medium text-slate-200" htmlFor="participant-code">
                  Participant code
                </label>
                <input
                  id="participant-code"
                  type="text"
                  value={participantCode}
                  onChange={(event) => setParticipantCode(normalizeParticipantCode(event.target.value))}
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 font-mono text-lg tracking-[0.18em] text-white outline-none transition focus:border-science-teal/70"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setParticipantCode(generateParticipantCode())}
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-science-teal/40 hover:text-white"
                  >
                    Generate new code
                  </button>
                  <button
                    type="button"
                    onClick={copyParticipantCode}
                    className="inline-flex items-center justify-center rounded-full bg-science-teal px-4 py-2 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                  >
                    {copyState === 'copied' ? 'Code copied' : copyState === 'failed' ? 'Copy failed' : 'Copy code'}
                  </button>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-300">{XR_STUDY_COPY.privacy}</p>
            </aside>
          </div>

          <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {XR_SURVEYS.map((survey) => (
              <article
                key={survey.key}
                className="group rounded-[1.75rem] border border-white/10 bg-slate-900/65 p-6 transition duration-300 hover:-translate-y-1 hover:border-science-teal/40 hover:bg-slate-900/80"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {survey.title}
                </p>
                <p className="mt-4 min-h-[4.5rem] text-sm leading-6 text-slate-300">{survey.description}</p>
                <button
                  type="button"
                  onClick={() => openSurvey(survey)}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 transition group-hover:bg-science-teal"
                >
                  {survey.shortLabel}
                </button>
              </article>
            ))}
          </section>
        </div>
      </main>

      {activeSurvey ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-6">
          <div className="flex h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-[0_30px_90px_rgba(2,6,23,0.8)]">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 bg-slate-950/95 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Active survey
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">{activeSurvey.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{XR_STUDY_COPY.modalHint}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={activeSurveyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-science-teal/40 hover:text-white"
                >
                  Open in new tab
                </a>
                <button
                  type="button"
                  onClick={() => setActiveSurvey(null)}
                  className="inline-flex items-center justify-center rounded-full bg-science-teal px-4 py-2 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  Close survey
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-900/80 p-2 sm:p-4">
              <iframe
                key={`${activeSurvey.key}-${participantCode}`}
                title={activeSurvey.title}
                src={activeSurveyUrl}
                className="h-full w-full rounded-[1.5rem] border border-white/10 bg-white"
              />
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-white/10 bg-slate-950/95 px-5 py-4 sm:px-6">
              <p className="text-sm text-slate-300">
                Participant code: <span className="font-mono font-semibold tracking-[0.18em] text-white">{participantCode}</span>
              </p>
              <button
                type="button"
                onClick={() => setActiveSurvey(null)}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-science-teal/40 hover:text-white"
              >
                Done, return to landing page
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default XRStudyPage;
