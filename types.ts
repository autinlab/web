
export interface ResearchArea {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export enum SoftwareType {
  WEB_APP = 'Web App',
  LIBRARY = 'Library',
  EDUCATIONAL = 'Educational'
}

export interface Software {
  id: string;
  name: string;
  description: string;
  type: SoftwareType;
  url: string;
  embedUrl?: string;
  imageUrl: string;
  features: string[];
  githubUrl?: string; // Optional GitHub repository link
  buttonLabel?: string; // Optional custom label for the primary button
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  links?: {
    scholar?: string;
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  volume?: string;
  issue?: string;
  pages?: string;
  year: number;
  publisher?: string;
  link?: string; // DOI URL
}

export interface Affiliation {
  id: string;
  name: string;
  url: string;
  role: string;
  logo?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface IntegrativeModel {
  id: string;
  name: string;
  description: string;
  year?: string;
  viewerUrl: string;
  imageUrl?: string;
}
