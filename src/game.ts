export const TRACK_COUNT = 6;
export const TRACK_DURATION_MS = 30_000;
export const RUN_DURATION_MS = TRACK_COUNT * TRACK_DURATION_MS;
export const LANES = 4;

export type GameStatus = 'ready' | 'playing' | 'paused' | 'choice' | 'won' | 'lost';
export type Judgement = 'perfect' | 'good' | 'miss';

export interface Note {
  id: number;
  lane: number;
  at: number;
  phrase: number;
  resolved: boolean;
  hit: boolean;
}

export interface Modifier {
  id: string;
  name: string;
  description: string;
  premium?: boolean;
}

export const FREE_MODIFIERS: Modifier[] = [
  { id: 'wide', name: 'Wide window', description: 'Adds 40 ms to every timing window.' },
  { id: 'shield', name: 'Phrase shield', description: 'Blocks the next missed phrase.' },
  { id: 'boost', name: 'Score push', description: 'Adds 35% score with a tighter window.' },
  { id: 'rotate', name: 'Lane turn', description: 'Rotates the note lanes each track.' },
  { id: 'dense', name: 'Extra taps', description: 'Adds off-beat notes worth more points.' },
  { id: 'steady', name: 'Steady count', description: 'Keeps each phrase to four clear beats.' },
];

export const GROOVE_SETS = [
  { id: 'circuit', name: 'Circuit', premium: false, kick: [0, 8], snare: [4, 12], hat: [2, 6, 10, 14], tone: 0 },
  { id: 'copper', name: 'Copper', premium: true, kick: [0, 6, 10], snare: [4, 12], hat: [2, 5, 8, 11, 14], tone: -110 },
  { id: 'paper', name: 'Paper', premium: true, kick: [0, 7, 11], snare: [3, 8, 12], hat: [1, 5, 9, 13, 15], tone: 190 },
  { id: 'glass', name: 'Glass', premium: true, kick: [0, 5, 8, 13], snare: [4, 11], hat: [2, 6, 7, 10, 14, 15], tone: 360 },
] as const;

export type GrooveId = typeof GROOVE_SETS[number]['id'];

export interface GameSnapshot {
  version: 1;
  seed: number;
  status: GameStatus;
  track: number;
  trackTime: number;
  runTime: number;
  score: number;
  streak: number;
  bestStreak: number;
  missedPhrases: number;
  shield: number;
  notes: Note[];
  phraseResults: Record<string, boolean>;
  modifiers: string[];
  choices: string[];
  lastJudgement: Judgement | null;
}

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function hashSeed(value: string | number): number {
  if (typeof value === 'number') return value >>> 0;
  let hash = 2_166_136_261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16_777_619);
  }
  return hash >>> 0;
}

export class PulseGame {
  readonly seed: number;
  status: GameStatus = 'ready';
  track = 0;
  trackTime = 0;
  runTime = 0;
  score = 0;
  streak = 0;
  bestStreak = 0;
  missedPhrases = 0;
  shield = 0;
  notes: Note[] = [];
  phraseResults: Record<string, boolean> = {};
  modifiers: string[] = [];
  choices: string[] = [];
  lastJudgement: Judgement | null = null;
  assistMode = false;

  constructor(seed: string | number) {
    this.seed = hashSeed(seed);
    this.prepareTrack();
  }

  static fromSnapshot(snapshot: GameSnapshot): PulseGame {
    const game = new PulseGame(snapshot.seed);
    Object.assign(game, structuredClone(snapshot));
    return game;
  }

  get timingWindow(): number {
    const assist = (this.modifiers.includes('wide') ? 40 : 0) + (this.assistMode ? 95 : 0);
    const penalty = this.modifiers.includes('boost') ? 20 : 0;
    return 145 + assist - penalty;
  }

  get multiplier(): number {
    return this.modifiers.includes('boost') ? 1.35 : 1;
  }

  start(): void {
    if (this.status === 'ready' || this.status === 'paused') this.status = 'playing';
  }

  pause(): void {
    if (this.status === 'playing') this.status = 'paused';
  }

  step(deltaMs: number): void {
    if (this.status !== 'playing') return;
    const remaining = TRACK_DURATION_MS - this.trackTime;
    const applied = Math.min(Math.max(0, deltaMs), remaining);
    this.trackTime += applied;
    this.runTime += applied;
    this.resolveExpiredNotes();
    this.resolvePhrases();

    if (this.missedPhrases >= 3) return;
    if (this.trackTime >= TRACK_DURATION_MS) {
      if (this.track === TRACK_COUNT - 1) {
        this.status = 'won';
      } else {
        this.status = 'choice';
        this.choices = this.makeChoices();
      }
    }
  }

  hitLane(lane: number): Judgement | null {
    if (this.status !== 'playing' || lane < 0 || lane >= LANES) return null;
    const target = this.notes
      .filter((note) => !note.resolved && note.lane === this.displayLane(lane))
      .map((note) => ({ note, distance: Math.abs(note.at - this.trackTime) }))
      .filter(({ distance }) => distance <= this.timingWindow)
      .sort((left, right) => left.distance - right.distance)[0];

    if (!target) return null;
    target.note.resolved = true;
    target.note.hit = true;
    const judgement: Judgement = target.distance <= 60 ? 'perfect' : 'good';
    this.lastJudgement = judgement;
    this.streak += 1;
    this.bestStreak = Math.max(this.bestStreak, this.streak);
    const points = judgement === 'perfect' ? 120 : 80;
    this.score += Math.round((points + this.streak * 3) * this.multiplier);
    return judgement;
  }

  choose(modifierId: string): boolean {
    if (this.status !== 'choice' || !this.choices.includes(modifierId)) return false;
    this.modifiers.push(modifierId);
    if (modifierId === 'shield') this.shield += 1;
    this.track += 1;
    this.trackTime = 0;
    this.lastJudgement = null;
    this.choices = [];
    this.prepareTrack();
    this.status = 'playing';
    return true;
  }

  restart(): void {
    this.status = 'ready';
    this.track = 0;
    this.trackTime = 0;
    this.runTime = 0;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.missedPhrases = 0;
    this.shield = 0;
    this.phraseResults = {};
    this.modifiers = [];
    this.choices = [];
    this.lastJudgement = null;
    this.prepareTrack();
  }

  toSnapshot(): GameSnapshot {
    return {
      version: 1,
      seed: this.seed,
      status: this.status,
      track: this.track,
      trackTime: this.trackTime,
      runTime: this.runTime,
      score: this.score,
      streak: this.streak,
      bestStreak: this.bestStreak,
      missedPhrases: this.missedPhrases,
      shield: this.shield,
      notes: structuredClone(this.notes),
      phraseResults: { ...this.phraseResults },
      modifiers: [...this.modifiers],
      choices: [...this.choices],
      lastJudgement: this.lastJudgement,
    };
  }

  finishPerfectRun(): void {
    if (this.status === 'ready' || this.status === 'paused') this.start();
    let guard = 0;
    while (this.status !== 'won' && this.status !== 'lost' && guard < 30_000) {
      if (this.status === 'choice') {
        this.choose(this.choices[0]);
      } else {
        for (const note of this.notes) {
          if (!note.resolved && note.at <= this.trackTime + 10) this.hitLane(this.inputLane(note.lane));
        }
        this.step(10);
      }
      guard += 1;
    }
  }

  finishMissedRun(): void {
    if (this.status === 'ready' || this.status === 'paused') this.start();
    let guard = 0;
    while (this.status !== 'lost' && guard < 10_000) {
      this.step(20);
      guard += 1;
    }
  }

  private prepareTrack(): void {
    const random = mulberry32(this.seed + this.track * 7_919);
    const beat = 400;
    const dense = this.modifiers.includes('dense');
    const notes: Note[] = [];
    let id = this.track * 1_000;
    for (let phrase = 0; phrase < 15; phrase += 1) {
      for (let beatIndex = 0; beatIndex < 4; beatIndex += 1) {
        const lane = Math.floor(random() * LANES);
        notes.push({ id: id++, lane, at: phrase * 2_000 + beatIndex * beat + 350, phrase, resolved: false, hit: false });
        if (dense && beatIndex % 2 === 1) {
          notes.push({ id: id++, lane: (lane + 2) % LANES, at: phrase * 2_000 + beatIndex * beat + 550, phrase, resolved: false, hit: false });
        }
      }
    }
    this.notes = notes;
  }

  private resolveExpiredNotes(): void {
    for (const note of this.notes) {
      if (!note.resolved && this.trackTime > note.at + this.timingWindow) {
        note.resolved = true;
        note.hit = false;
      }
    }
  }

  private resolvePhrases(): void {
    for (let phrase = 0; phrase < 15; phrase += 1) {
      const key = `${this.track}:${phrase}`;
      if (key in this.phraseResults || this.trackTime < (phrase + 1) * 2_000) continue;
      const phraseNotes = this.notes.filter((note) => note.phrase === phrase);
      const needed = this.modifiers.includes('dense') ? 3 : 2;
      const passed = phraseNotes.filter((note) => note.hit).length >= needed;
      this.phraseResults[key] = passed;
      if (!passed) {
        this.streak = 0;
        this.lastJudgement = 'miss';
        if (this.shield > 0) {
          this.shield -= 1;
        } else {
          this.missedPhrases += 1;
        }
        if (this.missedPhrases >= 3) this.status = 'lost';
      }
    }
  }

  private makeChoices(): string[] {
    const available = FREE_MODIFIERS.map((modifier) => modifier.id).filter((id) => !this.modifiers.includes(id));
    const random = mulberry32(this.seed + this.track * 97 + 31);
    const first = available.splice(Math.floor(random() * available.length), 1)[0] ?? 'wide';
    const second = available.splice(Math.floor(random() * available.length), 1)[0] ?? 'shield';
    return [first, second];
  }

  private displayLane(inputLane: number): number {
    return this.modifiers.includes('rotate') ? (inputLane + this.track) % LANES : inputLane;
  }

  private inputLane(noteLane: number): number {
    return this.modifiers.includes('rotate') ? (noteLane - this.track + LANES * 2) % LANES : noteLane;
  }
}
