export type XRSurveyKey = 'pre' | 'xr-station' | 'table-station' | 'final';

export type XRSurveyDefinition = {
  key: XRSurveyKey;
  title: string;
  shortLabel: string;
  description: string;
  responderUrl: string;
  participantEntryId: string;
  prefills?: Record<string, string>;
};

export const XR_STUDY_STORAGE_KEY = 'xr-study-participant-code';

export const XR_STUDY_COPY = {
  title: 'XR Structural Biology Study',
  intro:
    'Use one participant code across all four surveys. The code stays in this browser so students can move between the pre-survey, the two station surveys, and the final survey without retyping it each time.',
  privacy:
    'This page stores only the participant code in local browser storage. It does not send responses anywhere except the Google Forms you open.',
  modalHint:
    'Submit the Google Form inside the modal, then close the survey window here to return to the landing page.',
};

export const XR_SURVEYS: XRSurveyDefinition[] = [
  {
    key: 'pre',
    title: 'Pre-Survey',
    shortLabel: 'Start pre-survey',
    description: 'Baseline experience and knowledge before the lesson starts.',
    responderUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSfzr-rdN7sou6LVd3TovzVVTV6Pbx2IqdlXOgKPQAw4Zyt8jw/viewform',
    participantEntryId: '110202008',
  },
  {
    key: 'xr-station',
    title: 'XR Station Survey',
    shortLabel: 'Start XR station survey',
    description: 'Station survey with the completed station prefilled as XR lesson.',
    responderUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSdZI_7VwP3BOZXPsbluHzQCM17-Q1HWmqXQh1RjYNzNbpuh3A/viewform',
    participantEntryId: '1668278834',
    prefills: {
      'entry.1592057304': 'XR lesson',
    },
  },
  {
    key: 'table-station',
    title: 'Table Station Survey',
    shortLabel: 'Start table station survey',
    description: 'Same station survey, prefilled as the 3D printed table activity.',
    responderUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSdZI_7VwP3BOZXPsbluHzQCM17-Q1HWmqXQh1RjYNzNbpuh3A/viewform',
    participantEntryId: '1668278834',
    prefills: {
      'entry.1592057304': '3D printed table activity',
    },
  },
  {
    key: 'final',
    title: 'Final Survey',
    shortLabel: 'Start final survey',
    description: 'End-of-lesson comparison and wrap-up survey.',
    responderUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSci_nvYtQwp5DfOshNoaHkSpgwoOx_V7vc7eDDRVF4evB71Tg/viewform',
    participantEntryId: '653352900',
  },
];
