export interface PrintedModel {
  id: string;
  name: string;
  description: string;
  imageUrl?: string; // relative to public/
  credit?: string;
  group: string;
}

export interface PrinterSection {
  id: string;
  printer: string;
  model: string;
  status: 'active' | 'retired';
  tagline: string;
  printerImageUrl?: string;
  models: PrintedModel[];
}

export const PRINTER_SECTIONS: PrinterSection[] = [
  {
    id: 'bambu',
    printer: 'Bambu Lab',
    model: 'P2S',
    status: 'active',
    tagline: 'FDM multi-material printer — current workhorse for structural models and educational kits.',
    printerImageUrl: 'assets/3dprinting/bambulab.jpg',
    models: [
      // ── Caspar-Klug Quasi-Symmetry Kit ────────────────────────────
      {
        id: 'ck-kit',
        name: 'Caspar-Klug Kit — T1 to T7 Icosahedra',
        description: 'Full assembly of the Caspar-Klug quasi-symmetry series: seven icosahedral shells from T=1 to T=7, illustrating how viruses achieve size diversity from a single protein fold.',
        imageUrl: 'assets/3dprinting/ico_kit.jpg',
        group: 'Caspar-Klug Quasi-Symmetry Kit',
      },
      {
        id: 'ck-self-assembly',
        name: 'Self-Assembly Sequence',
        description: 'Step-by-step assembly demonstration of the Caspar-Klug icosahedral subunits, showing how quasi-equivalent contacts build the closed shell.',
        imageUrl: 'assets/3dprinting/self_assembly.jpg',
        group: 'Caspar-Klug Quasi-Symmetry Kit',
      },
      {
        id: 'ck-capsid-string',
        name: 'Capsid + String',
        description: 'Capsid assembly with string connector — illustrates how protein subunits link together to close the icosahedral shell.',
        imageUrl: 'assets/3dprinting/virus_string.jpg',
        group: 'Caspar-Klug Quasi-Symmetry Kit',
      },
      {
        id: 'ck-floating-capsid',
        name: 'Floating Capsid',
        description: 'Open, suspended capsid design demonstrating an airy presentation of the icosahedral architecture.',
        imageUrl: 'assets/3dprinting/floating_capsid.png',
        credit: 'Julie Poon',
        group: 'Caspar-Klug Quasi-Symmetry Kit',
      },
      // ── Tomograms & Structures ─────────────────────────────────────
      {
        id: 'mito-tomogram',
        name: 'Mitochondria Tomogram',
        description: 'Physical replica derived from a cryo-ET tomogram, preserving the intricate inner membrane cristae architecture.',
        imageUrl: 'assets/3dprinting/mitochondria.jpg',
        group: 'Tomograms & Structures',
      },
      {
        id: 'hiv-capsid-blocks',
        name: 'HIV Capsid Building Blocks',
        description: 'Individual CA hexamer and pentamer subunits that tile into the fullerene-cone HIV capsid lattice.',
        imageUrl: 'assets/3dprinting/capsid_core.jpg',
        group: 'Tomograms & Structures',
      },
    ],
  },
  {
    id: 'projet',
    printer: 'ProJet 660 Pro',
    model: '660 Pro',
    status: 'retired',
    tagline: 'Full-color binder-jetting printer — currently non-functional. These models were crafted by Art Olson.',
    models: [
      {
        id: 'art-collection',
        name: 'Classic Collection',
        description: 'Overview of full-color molecular models produced on the ProJet 660 Pro — some of the earliest physical representations of mesoscale integrative models.',
        imageUrl: 'assets/3dprinting/3dmodels_projet.jpg',
        credit: 'Art Olson',
        group: 'Classic Collection',
      },
      {
        id: 'art-influenza',
        name: 'Influenza A',
        description: 'Full-color printed model of the Influenza A virion, showcasing the surface glycoproteins in the ProJet\'s characteristic vivid palette.',
        imageUrl: 'assets/3dprinting/influenza_projet.jpg',
        credit: 'Art Olson',
        group: 'Classic Collection',
      },
    ],
  },
];
