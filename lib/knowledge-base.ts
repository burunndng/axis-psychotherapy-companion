/**
 * Knowledge Base for AXIS
 * Integrated clinical resources for RAG (Retrieval-Augmented Generation)
 *
 * Contains:
 * 1. The Mechanics of Insight (Psychodynamic + Transactional Analysis)
 * 2. ACT Techniques (Acceptance & Commitment Therapy)
 *
 * Used to augment system prompt and provide evidence-based context
 */

export interface KnowledgeEntry {
  id: string;
  source: string;
  topic: string;
  technique: string;
  description: string;
  implementation: string;
  keywords: string[];
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // ════════════════════════════════════════════════════════════════
  // PSYCHODYNAMIC THERAPY (PDT) TECHNIQUES
  // ════════════════════════════════════════════════════════════════

  {
    id: 'pdt-001',
    source: 'The Mechanics of Insight',
    topic: 'Free Association & Reverie',
    technique: 'Free Association and Even-Hovering Attention',
    description: 'Accessing unconscious material by bypassing secondary-process thinking (logic) to reach primary-process thinking (affect, symbol, unconscious conflict).',
    implementation: '1) Set frame: verbalize thoughts without censorship. 2) Cultivate reverie: listen without agenda. 3) Track nodes: shifts in affect, topic changes, stammering. 4) Intervene at resistance: point out process, not content.',
    keywords: ['unconscious', 'primary-process', 'resistance', 'defense', 'reverie']
  },

  {
    id: 'pdt-002',
    source: 'The Mechanics of Insight',
    topic: 'Transference Analysis',
    technique: 'Transference and Countertransference Analysis',
    description: 'Using the Core Conflictual Relationship Theme (CCRT) and Triangles of Conflict to connect present dynamics with historical blueprint.',
    implementation: '1) Identify CCRT: wish, expected response, self-response. 2) Monitor somatic countertransference. 3) Link triangles: point out present defense → link to transference → genetic origin. 4) Work through: analyze defense against interpretation.',
    keywords: ['transference', 'countertransference', 'CCRT', 'triangles', 'genetic-origin', 'working-alliance']
  },

  {
    id: 'pdt-003',
    source: 'The Mechanics of Insight',
    topic: 'Defense Analysis',
    technique: 'Defense Analysis and Confrontation (TFP)',
    description: 'Integrating split ego states (all-good vs. all-bad) through phenomenological clarification and tactful confrontation of discrepancies.',
    implementation: '1) Phenomenological clarification: elicit granular details. 2) Identify split/discrepancy: verbal vs. non-verbal. 3) Tactful confrontation: bring contradictions into consciousness. 4) Interpret function: why the defense is necessary.',
    keywords: ['split-objects', 'borderline', 'confrontation', 'integration', 'discrepancy', 'defense-function']
  },

  {
    id: 'pdt-004',
    source: 'The Mechanics of Insight',
    topic: 'Mentalization',
    technique: 'Mentalization Enhancement (MBT)',
    description: 'Restoring capacity to understand behavior in terms of intentional mental states (vs. psychic equivalence or teleological mode).',
    implementation: '1) Detect mentalizing break: rigidification, certainty about malice. 2) Stop, Rewind, Explore: interrupt and isolate trigger. 3) Micro-analyze the ouch: exact trigger. 4) Model not-knowing: generate alternatives.',
    keywords: ['mentalization', 'trauma', 'psychic-equivalence', 'teleological', 'rupture', 'repair']
  },

  {
    id: 'pdt-005',
    source: 'The Mechanics of Insight',
    topic: 'Alliance Rupture',
    technique: 'Alliance Rupture and Repair',
    description: 'Detecting and repairing therapeutic relationship breaks through metacommunication and validation.',
    implementation: '1) Detect rupture: withdrawal (silence, compliance) or confrontation (criticism). 2) Metacommunication: shift from content to process. 3) Validate patient experience: own mistakes without defensiveness. 4) Explore dynamic: link to broader patterns.',
    keywords: ['rupture', 'repair', 'metacommunication', 'alliance', 'working-relationship', 'vulnerability']
  },

  // ════════════════════════════════════════════════════════════════
  // TRANSACTIONAL ANALYSIS (TA) TECHNIQUES
  // ════════════════════════════════════════════════════════════════

  {
    id: 'ta-001',
    source: 'The Mechanics of Insight',
    topic: 'Structural Analysis',
    technique: 'Structural Analysis and Ego State Decontamination',
    description: 'Strengthening Adult ego state by removing contamination from Parent (introjected beliefs) and Child (archaic feelings).',
    implementation: '1) Structural diagnosis: assess which ego state is executive. 2) Identify contamination: prejudice (Parent) or delusion (Child). 3) Boundary clarification: whose voice is that? 4) Adult re-cathexis: reality-test with evidence.',
    keywords: ['ego-states', 'parent', 'adult', 'child', 'contamination', 'introjection']
  },

  {
    id: 'ta-002',
    source: 'The Mechanics of Insight',
    topic: 'Script Analysis',
    technique: 'Script Analysis and the Script Matrix',
    description: 'Uncovering unconscious life plans through Injunctions (covert messages) and Drivers (overt, conditional messages).',
    implementation: '1) Elicit protocol: childhood memories, fairy tales, dreams. 2) Map injunctions/drivers: what to do to get attention; unspoken rules. 3) Identify somatic script: how held in body. 4) Script release: design antitheses.',
    keywords: ['script', 'injunction', 'driver', 'life-plan', 'redecision', 'antithesis']
  },

  {
    id: 'ta-003',
    source: 'The Mechanics of Insight',
    topic: 'Game Analysis',
    technique: 'Game Analysis and Interruption',
    description: 'Disrupting repetitive, unconscious transaction sequences (games) that result in negative payoffs (rackets).',
    implementation: '1) Map Formula G: Con + Gimmick = Response → Switch → Crossup → Payoff. 2) Locate Drama Triangle position. 3) Cross the transaction: refuse to play. 4) Expose existential payoff: what feeling is it protecting?',
    keywords: ['game', 'racket', 'drama-triangle', 'transactional-analysis', 'payoff', 'ulterior-motive']
  },

  {
    id: 'ta-004',
    source: 'The Mechanics of Insight',
    topic: 'Redecision',
    technique: 'Redecision Therapy and Impasse Resolution',
    description: 'Enabling the Child ego state to re-decide archaic survival strategies made in childhood.',
    implementation: '1) Establish contract: specific, observable. 2) Identify impasse: trace to early scene. 3) Two-chair work: dialogue between Child and introjected Parent. 4) Facilitate redecision: at height of affect, support rebellion.',
    keywords: ['redecision', 'impasse', 'two-chair', 'gestalt', 'introjected-parent', 'affective-breakthrough']
  },

  {
    id: 'ta-005',
    source: 'The Mechanics of Insight',
    topic: 'Stroke Economy',
    technique: 'Stroke Economy Modification',
    description: 'Altering restrictive patterns of how the client accepts recognition (strokes).',
    implementation: '1) Assess stroke quotient: how recognized? Accept positive or provoke negative? 2) Identify stroke filters: discounting compliments. 3) Prescribe behavioral experiments: ask for strokes, accept without qualifier. 4) Analyze resistance: what anxiety arises?',
    keywords: ['stroke', 'recognition', 'stroke-economy', 'discount', 'self-worth', 'behavioral-change']
  },

  // ════════════════════════════════════════════════════════════════
  // ACT (ACCEPTANCE & COMMITMENT THERAPY) TECHNIQUES
  // ════════════════════════════════════════════════════════════════

  {
    id: 'act-001',
    source: 'ACT_techniques.md',
    topic: 'Acceptance & Willingness',
    technique: 'Creative Hopelessness',
    description: 'Disrupting the workability of avoidance repertoires by inducing functional aporia (dead-end realization).',
    implementation: '1) Elicit control agenda: what have you tried to get rid of it? 2) Assess topography: how much effort? 3) Assess outcome: did it work long-term? 4) Validate paradox: trying harder makes it worse. 5) Avoid offering new control strategies.',
    keywords: ['acceptance', 'experiential-avoidance', 'workability', 'control-agenda', 'dead-end']
  },

  {
    id: 'act-002',
    source: 'ACT_techniques.md',
    topic: 'Acceptance & Willingness',
    technique: 'The Tug-of-War with a Monster',
    description: 'Shifting from oppositional (away-move) to dropping the struggle metaphorically.',
    implementation: 'Clinician mimes holding rope. Client imagines pathology as monster on other end of pit. Pulling harder = closer to pit. Protocol: What happens if you drop the rope? Monster remains, but struggle ceases, freeing hands for values-based action.',
    keywords: ['metaphor', 'struggle', 'acceptance', 'willingness', 'let-go']
  },

  {
    id: 'act-003',
    source: 'ACT_techniques.md',
    topic: 'Cognitive Defusion',
    technique: 'Titchener\'s Word Repetition',
    description: 'Achieving semantic satiation by rapidly repeating fused thoughts until they become merely sounds.',
    implementation: '1) Client identifies single-word negative self-evaluation (e.g., "Stupid"). 2) Clinician and client rapidly repeat word 45-60 seconds. 3) Debrief: What happened to the meaning? Did it become just a sound?',
    keywords: ['defusion', 'semantic-satiation', 'literalization', 'thought-as-sound', 'AARR']
  },

  {
    id: 'act-004',
    source: 'ACT_techniques.md',
    topic: 'Cognitive Defusion',
    technique: 'The Lemon Exercise',
    description: 'Demonstrating AARR (Arbitrarily Applicable Relational Responding) through direct sensory experience.',
    implementation: 'Clinician guides vivid visualization of slicing and biting lemon. Client notices salivation. Highlight: Words alone made your body react as if lemon were real. Mind cannot distinguish literal from verbal reality. Treat thoughts as words, not facts.',
    keywords: ['AARR', 'stimulus-transformation', 'relational-frame', 'verbally-constructed']
  },

  {
    id: 'act-005',
    source: 'ACT_techniques.md',
    topic: 'Cognitive Defusion',
    technique: 'Externalizing / Naming the Mind',
    description: 'Creating distinction between self and the mind\'s output through naming.',
    implementation: '1) Client assigns name to mind (e.g., "The Dictator," "Radio Doom"). 2) When fused thought occurs, prompt: What is Radio Doom broadcasting? 3) Client responds: I thank my mind for that interesting hypothesis.',
    keywords: ['distinction-frame', 'externalization', 'observer', 'mind-naming', 'separation']
  },

  {
    id: 'act-006',
    source: 'ACT_techniques.md',
    topic: 'Cognitive Defusion',
    technique: 'Syntactic Distancing',
    description: 'Inserting deictic frames (I/Here/Now) between observer and cognition through syntax shift.',
    implementation: 'Shift: "I am broken" → "I am having the thought that I am broken" → "I notice I am having the thought that I am broken." Each step increases distance.',
    keywords: ['syntax', 'deictic-frame', 'distancing', 'observer-position']
  },

  {
    id: 'act-007',
    source: 'ACT_techniques.md',
    topic: 'Present Moment Awareness',
    technique: '5-5-5 Sensory Grounding',
    description: 'Shifting attention from derived verbal networks to direct environmental contingencies.',
    implementation: 'Client audibly names: 5 things they see + 5 they touch/feel + 5 they hear. Actively shifts attention away from internal rumination.',
    keywords: ['grounding', 'present-moment', 'sensory', 'attentional-control']
  },

  {
    id: 'act-008',
    source: 'ACT_techniques.md',
    topic: 'Self-as-Context',
    technique: 'The Chessboard Metaphor',
    description: 'Reframing self as context (board) rather than content (pieces) to insulate identity from fluctuating psychological content.',
    implementation: 'Map good thoughts/feelings as white pieces, bad as black. Client tries to make white pieces win. Reframe: You are the board, not the pieces. Board is in contact with all pieces but not threatened by the war.',
    keywords: ['observing-self', 'context', 'self-as-perspective', 'invariant', 'deictic']
  },

  {
    id: 'act-009',
    source: 'ACT_techniques.md',
    topic: 'Self-as-Context',
    technique: 'The Sky and the Weather',
    description: 'Metaphorical distinction between unchanging self and fluctuating emotions/thoughts.',
    implementation: 'Self = Sky. Emotions/Thoughts = Weather. Sky has room for hurricanes and sunshine. Weather cannot damage the sky. You are the sky; notice weather passing through.',
    keywords: ['metaphor', 'self-as-context', 'emotions-as-temporary', 'acceptance']
  },

  {
    id: 'act-010',
    source: 'ACT_techniques.md',
    topic: 'Values Clarification',
    technique: 'Values vs. Goals Discrimination',
    description: 'Distinguishing finite outcomes (goals) from continuous behavioral trajectories (values).',
    implementation: 'Goal: driving to New York. Value: driving East (can always go further). Client reframes "I want to be married" (Goal) to "I want to be a loving, vulnerable partner" (Value).',
    keywords: ['values', 'goals', 'motivational', 'direction', 'trajectory']
  },

  {
    id: 'act-011',
    source: 'ACT_techniques.md',
    topic: 'Values Clarification',
    technique: 'The 80th Birthday Party / Funeral Exercise',
    description: 'Utilizing temporal framing to generate motivational clarity about life direction.',
    implementation: 'Client visualizes funeral or 80th birthday. Ask: If you lived as you wanted from now on, what would partner/child/colleague say you stood for?',
    keywords: ['values', 'temporal-framing', 'meaning-making', 'legacy']
  },

  {
    id: 'act-012',
    source: 'ACT_techniques.md',
    topic: 'Committed Action',
    technique: 'The Bold Move',
    description: 'Building behavioral activation linked to values through specific, achievable actions.',
    implementation: '1) Identify value. 2) Identify specific, measurable action in next 24 hours. 3) Ask: What will your mind say to stop you? (Anticipatory defusion). 4) Commit to action with expected anxiety.',
    keywords: ['behavior-activation', 'shaping', 'committed-action', 'values-driven']
  },

  {
    id: 'act-013',
    source: 'ACT_techniques.md',
    topic: 'Clean vs. Dirty Discomfort',
    technique: 'Clean vs. Dirty Discomfort Discrimination',
    description: 'Isolating primary respondent distress from secondary derived distress (evaluative framing).',
    implementation: 'Map primary pain (physiological grief) as "Clean Discomfort." Secondary evaluations ("I shouldn\'t feel this way") as "Dirty Discomfort." Target cessation of Dirty via acceptance of Clean.',
    keywords: ['discomfort', 'primary', 'secondary', 'evaluation', 'suffering']
  },

  {
    id: 'act-014',
    source: 'ACT_techniques.md',
    topic: 'ACT Matrix',
    technique: 'The ACT Matrix',
    description: 'Spatial, cross-contextual heuristic for rapid functional analysis and values mapping.',
    implementation: 'Draw intersecting axes: Bottom=Internal, Top=External; Left=Away, Right=Toward. Client answers 4 Qs: Bottom-Right (Who/what is important?), Bottom-Left (What inner stuff gets in way?), Top-Left (What do you do to move away?), Top-Right (What could you do to move toward?)',
    keywords: ['matrix', 'functional-analysis', 'spatial-mapping', 'values-clarification']
  },

  {
    id: 'act-015',
    source: 'ACT_techniques.md',
    topic: 'ACT for Psychosis',
    technique: 'Voices as Passengers on the Bus',
    description: 'Externalizing and defusing from psychotic imperatives (hallucinations/delusions).',
    implementation: 'Client is bus driver (their life). Voices are unruly passengers. You cannot throw passengers off, but don\'t have to steer where they tell you. Keep driving toward values while they yell from back.',
    keywords: ['psychosis', 'hallucinations', 'delusions', 'defusion', 'externalization']
  },

  {
    id: 'act-016',
    source: 'ACT_techniques.md',
    topic: 'DNA-v (Developmental)',
    technique: 'Training the Discoverer, Noticer, Advisor (DNA-v)',
    description: 'Developmental ACT for adolescents and neurodivergent populations using evolutionary language.',
    implementation: 'Discoverer (D): Expand behavioral repertoires via trial-and-error. Noticer (N): Physical signals of emotions. Advisor (A): Inner rule-maker (validate but don\'t follow). Values (V): What makes you feel alive?',
    keywords: ['developmental', 'adolescent', 'neurodivergent', 'ADHD', 'autism', 'vitality']
  },

  // ════════════════════════════════════════════════════════════════
  // INTEGRATION WISDOM
  // ════════════════════════════════════════════════════════════════

  {
    id: 'integration-001',
    source: 'The Mechanics of Insight',
    topic: 'Integrated Practice',
    technique: 'Macro-Integration Trajectory',
    description: 'Phased approach combining TA stabilization with PDT depth and TA redecision for structural change.',
    implementation: 'Phase 1 (Stabilization): TA Structural Analysis + Decontamination. Phase 2 (Depth): PDT Transference + TA Redecision. Phase 3 (Working-Through): PDT Dominant, free association, dream analysis, mourning.',
    keywords: ['integration', 'phasing', 'stabilization', 'depth', 'working-through', 'structural-change']
  },

  {
    id: 'integration-002',
    source: 'The Mechanics of Insight',
    topic: 'Clinical Posture',
    technique: 'Oscillating Between Phenomenological & Hermeneutic Stances',
    description: 'Flexibility between interactive (TA) and exploratory (PDT) approaches based on patient need.',
    implementation: 'Phenomenological (TA): Sit forward, interactive, psychoeducational, explicit contracts. Hermeneutic (PDT): Sit back, embrace silence, tolerance for ambiguity, reverie, transference.',
    keywords: ['clinical-posture', 'flexibility', 'phenomenological', 'hermeneutic', 'stance-oscillation']
  }
];

/**
 * Retrieve relevant knowledge entries based on keywords
 */
export function retrieveRelevantKnowledge(keywords: string[]): KnowledgeEntry[] {
  const keywordSet = new Set(keywords.map(k => k.toLowerCase()));

  return KNOWLEDGE_BASE.filter(entry =>
    entry.keywords.some(k => keywordSet.has(k.toLowerCase()))
  ).slice(0, 5); // Return top 5 most relevant
}

/**
 * Search knowledge base by source
 */
export function getKnowledgeBySource(source: string): KnowledgeEntry[] {
  return KNOWLEDGE_BASE.filter(entry => entry.source.includes(source));
}

/**
 * Search knowledge base by topic
 */
export function getKnowledgeByTopic(topic: string): KnowledgeEntry[] {
  return KNOWLEDGE_BASE.filter(entry =>
    entry.topic.toLowerCase().includes(topic.toLowerCase())
  );
}

/**
 * Format knowledge entries for augmenting system prompt
 */
export function formatKnowledgeForPrompt(entries: KnowledgeEntry[]): string {
  if (entries.length === 0) return '';

  return `
\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLINICAL KNOWLEDGE BASE (Evidence-Based Context)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${entries.map((entry, idx) => `
[${idx + 1}] ${entry.technique} (${entry.source})
Topic: ${entry.topic}
Description: ${entry.description}
Implementation: ${entry.implementation}
`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
}

export default KNOWLEDGE_BASE;
