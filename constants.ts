
import { TeamMember, NavItem, Publication, ResearchArea, Software, SoftwareType, Affiliation } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Research', href: '#research' },
  { label: 'Software', href: '#software' },
  { label: 'Team', href: '#team' },
  { label: 'Publications', href: '#publications' },
];

export const RESEARCH_AREAS: ResearchArea[] = [
  {
    id: '1',
    title: 'Integrative Modeling',
    icon: '🧬',
    description: 'Combining data from various experimental sources to build comprehensive structural models of macromolecular assemblies.',
  },
  {
    id: '2',
    title: 'GPU Computing',
    icon: '⚡',
    description: 'Leveraging the power of modern Graphics Processing Units to accelerate simulation and visualization of cellular environments.',
  },
  {
    id: '3',
    title: 'Molecular Graphics',
    icon: '🎨',
    description: 'Developing novel rendering techniques to illustrate the complex and crowded nature of the biological mesoscale.',
  },
];

export const AFFILIATIONS: Affiliation[] = [
  {
    id: 'scripps',
    name: 'Scripps Research',
    url: 'https://www.scripps.edu/',
    role: 'Home Institution',
    logo: 'assets/logo_scripps.png' 
  },
  {
    id: 'nih',
    name: 'NIH',
    url: 'https://www.nih.gov/',
    role: 'Funding Agency',
    logo: 'https://www.nih.gov/sites/default/files/about-nih/2012-logo.png'
  },
  {
    id: 'bhive',
    name: 'BHIVE Center',
    url: 'https://bhive.scripps.edu/', 
    role: 'Collaborative Center'
  }
];

export const SOFTWARE_TOOLS: Software[] = [
  {
    id: 'mesoscale-explorer',
    name: 'Mesoscale Explorer',
    description: 'A unified tool for exploring and visualizing mesoscale biological models, built on the high-performance Mol* framework.',
    type: SoftwareType.WEB_APP,
    url: 'https://molstar.org/me/',
    embedUrl: 'https://molstar.org/me/',
    imageUrl: 'https://molstar.org/img/viewer.jpg', 
    features: ['Mol* Core', 'Mesoscale', 'Interactive', 'High Performance']
  },
  {
    id: 'cellpaint',
    name: 'CellPaint',
    description: 'A digital painting tool for creating molecular landscapes. Paint with proteins, lipids, and DNA to create scientifically accurate illustrations of cellular environments directly in your browser.',
    type: SoftwareType.WEB_APP,
    url: 'https://mesoscope.scripps.edu/beta/cellPAINT_dev/',
    embedUrl: 'https://mesoscope.scripps.edu/beta/cellPAINT_dev/',
    imageUrl: 'https://mesoscope.scripps.edu/data/cellPAINT/cellpaint.jpg', 
    features: ['Brush-based modeling', 'Real-time rendering', 'PDB integration', 'Interactive Painting']
  },
  {
    id: 'illustrate',
    name: 'Illustrate',
    description: 'Web application for non-photorealistic rendering of biomolecules. Turn complex PDB structures into clear, publication-ready diagrams with custom shaders and outlines.',
    type: SoftwareType.WEB_APP,
    url: 'https://mesoscope.scripps.edu/beta/illustrate.html',
    embedUrl: 'https://mesoscope.scripps.edu/beta/illustrate.html',
    imageUrl: 'https://mesoscope.scripps.edu/data/illustrate/illustrate.jpg',
    features: ['NPR Rendering', 'Outline generation', 'Ambient occlusion', 'Custom shaders']
  },
  {
    id: 'mesoscope',
    name: 'Mesoscope',
    description: 'A web-based explorer for mesoscale biological models. Dive into HIV, Influenza, and blood plasma models directly in your browser.',
    type: SoftwareType.WEB_APP,
    url: 'https://mesoscope.scripps.edu/beta/',
    embedUrl: 'https://mesoscope.scripps.edu/beta/', 
    imageUrl: 'https://mesoscope.scripps.edu/images/mesoscope_preview.jpg',
    features: ['WebGL visualization', 'Interactive annotations', 'Whole-cell models']
  },
  {
    id: 'cellpackgpu',
    name: 'CellPackGPU',
    description: 'High-performance algorithm for packing molecular structures into defined volumes using GPU acceleration. Essential for creating dense, realistic cytoplasmic models.',
    type: SoftwareType.LIBRARY,
    url: 'https://github.com/mesoscope/cellPACK',
    imageUrl: 'https://media.springernature.com/full/springer-static/image/art%3A10.1038%2Fnmeth.3204/MediaObjects/41592_2015_Article_BFnmeth3204_Fig1_HTML.jpg',
    features: ['CUDA acceleration', 'Mesoscopic scale', 'Python API']
  },
  {
    id: 'virus-lesson',
    name: 'Virus Lesson',
    description: 'Interactive educational modules explaining viral structures, lifecycles, and vaccine mechanisms.',
    type: SoftwareType.EDUCATIONAL,
    url: 'https://mesoscope.scripps.edu/',
    imageUrl: 'https://picsum.photos/seed/virus/400/300',
    features: ['Gamified learning', '3D exploration', 'Curriculum aligned']
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'ludo',
    name: 'Ludovic Autin, PhD',
    role: 'Institute Investigator',
    bio: 'Principal Investigator specializing in integrative structural modeling and visualization. The mind behind CellPack and Mesoscope, creating bridges between biological data and 3D graphics.',
    imageUrl: 'https://avatars.githubusercontent.com/u/1666763?v=4', 
    links: {
      scholar: 'https://scholar.google.com/citations?user=LQzd0s4AAAAJ&hl=en&oi=ao',
      github: 'https://github.com/autinlab'
    }
  },
  {
    id: 'quentin',
    name: 'Quentin Tallon, PhD',
    role: 'Postdoctoral Researcher',
    bio: 'Expert in AI, high-performance computing, and software engineering. Driving the development of next-generation molecular simulation tools and GPU acceleration.',
    imageUrl: 'https://avatars.githubusercontent.com/u/44683759?v=4' 
  }
];

export const PUBLICATIONS: Publication[] = [
  {
    id: 'mesoscale-explorer-2024',
    title: 'Mesoscale explorer: Visual exploration of large‐scale molecular models',
    authors: ['Rose, Alexander', 'Sehnal, David', 'Goodsell, David S', 'Autin, Ludovic'],
    journal: 'Protein Science',
    volume: '33',
    issue: '10',
    pages: 'e5177',
    year: 2024,
    publisher: 'John Wiley & Sons, Inc. Hoboken, USA',
    link: 'https://doi.org/10.1002/pro.5177'
  },
  {
    id: 'organelle-2022',
    title: 'Integrative structural modelling and visualisation of a cellular organelle',
    authors: ['Autin, Ludovic', 'Barbaro, Brett A', 'Jewett, Andrew I', 'Ekman, Axel', 'Verma, Shruti', 'Olson, Arthur J', 'Goodsell, David S'],
    journal: 'QRB discovery',
    volume: '3',
    pages: 'e11',
    year: 2022,
    publisher: 'Cambridge University Press',
    link: 'https://doi.org/10.1017/qrd.2022.9'
  },
  {
    id: 'mycoplasma-2022',
    title: 'Building structural models of a whole mycoplasma cell',
    authors: ['Maritan, Martina', 'Autin, Ludovic', 'Karr, Jonathan', 'Covert, Markus W', 'Olson, Arthur J', 'Goodsell, David S'],
    journal: 'Journal of molecular biology',
    volume: '434',
    issue: '2',
    pages: '167351',
    year: 2022,
    publisher: 'Academic Press',
    link: 'https://doi.org/10.1016/j.jmb.2021.167351'
  },
  {
    id: 'cellpaint-2021',
    title: 'CellPAINT: Turnkey illustration of molecular cell biology',
    authors: ['Gardner, Adam', 'Autin, Ludovic', 'Fuentes, Daniel', 'Maritan, Martina', 'Barad, Benjamin A', 'Medina, Michaela', 'Olson, Arthur J', 'Grotjahn, Danielle A', 'Goodsell, David S'],
    journal: 'Frontiers in bioinformatics',
    volume: '1',
    pages: '660936',
    year: 2021,
    publisher: 'Frontiers Media SA',
    link: 'https://doi.org/10.3389/fbinf.2021.660936'
  },
  {
    id: 'mesoscope-2020',
    title: 'Mesoscope: A web-based tool for mesoscale data integration and curation',
    authors: ['Autin, Ludovic', 'Maritan, Martina', 'Barbaro, Brett A', 'Gardner, Adam', 'Olson, Arthur J', 'Sanner, Michel', 'Goodsell, David S'],
    journal: 'MolVa: Workshop on Molecular Graphics and Visual Analysis of Molecular Data 2020',
    pages: '23',
    year: 2020,
    link: 'https://doi.org/10.2312/molva.20201103'
  },
  {
    id: 'illustrate-2019',
    title: 'Illustrate: software for biomolecular illustration',
    authors: ['Goodsell, David S', 'Autin, Ludovic', 'Olson, Arthur J'],
    journal: 'Structure',
    volume: '27',
    issue: '11',
    pages: '1716-1720. e1',
    year: 2019,
    publisher: 'Elsevier',
    link: 'https://doi.org/10.1016/j.str.2019.09.001'
  }
];
