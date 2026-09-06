import './styles.css';
import { PercussionAudio } from './audio';
import {
  FREE_MODIFIERS,
  PulseGame,
  TRACK_COUNT,
  TRACK_DURATION_MS,
  type GameSnapshot,
} from './game';

type PlayMode = 'demo' | 'real';

interface Settings {
  sound: boolean;
  assist: boolean;
  reduceEffects: boolean;
  keys: string[];
}

interface Stats {
  bestScore: number;
  completedRuns: number;
  startedRuns: number;
}

interface QaApi {
  finishRun: () => void;
  loseRun: () => void;
  placeNote: (lane: number) => void;
  snapshot: () => GameSnapshot | null;
  fps: () => number;
}

declare global {
  interface Window {
    __PULSE_QA__?: QaApi;
  }
}

const STORAGE = {
  settings: 'pulse-run:settings',
  stats: 'pulse-run:stats',
  run: 'pulse-run:run',
};

const DEFAULT_SETTINGS: Settings = {
  sound: true,
  assist: false,
  reduceEffects: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  keys: ['KeyD', 'KeyF', 'KeyJ', 'KeyK'],
};

const KEY_OPTIONS = [
  ['KeyA', 'A'], ['KeyS', 'S'], ['KeyD', 'D'], ['KeyF', 'F'], ['KeyG', 'G'],
  ['KeyH', 'H'], ['KeyJ', 'J'], ['KeyK', 'K'], ['KeyL', 'L'], ['Semicolon', ';'],
] as const;

const rootElement = document.querySelector<HTMLDivElement>('#app');
if (!rootElement) throw new Error('The app root is missing.');
const appRoot: HTMLDivElement = rootElement;

class PulseRunApp {
  private game: PulseGame | null = null;
  private mode: PlayMode;
  private settings: Settings;
  private readonly audio = new PercussionAudio();
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private accumulator = 0;
  private lastFrame = performance.now();
  private lastSave = 0;
  private lastStatus = '';
  private handledEnd = false;
  private frameTimes: number[] = [];
  private route = window.location.pathname;

  constructor() {
    this.mode = this.isDemoPath() ? 'demo' : 'real';
    this.settings = this.mode === 'demo' ? structuredClone(DEFAULT_SETTINGS) : this.loadSettings();
    this.audio.setEnabled(this.settings.sound);
    this.renderRoute(false);
    this.bindGlobalEvents();
    requestAnimationFrame((time) => this.frame(time));
    this.installQaApi();
  }

  private isDemoPath(): boolean {
    return window.location.pathname === '/demo' || new URLSearchParams(window.location.search).get('demo') === '1';
  }

  private header(): string {
    const current = this.route;
    return `
      <a class="skip-link" href="#main">Skip to main content</a>
      <header class="site-header">
        <a class="wordmark" href="/" data-route><span class="wordmark-mark" aria-hidden="true"></span><span>Pulse Run</span></a>
        <nav class="site-nav" aria-label="Main navigation">
          <ul>
            <li><a href="/" data-route ${current === '/' ? 'aria-current="page"' : ''}>Play</a></li>
            <li><a href="/demo" data-route ${current === '/demo' ? 'aria-current="page"' : ''}>Sample</a></li>
            <li><a href="/#how">How it works</a></li>
            <li><a href="/privacy" data-route ${current === '/privacy' ? 'aria-current="page"' : ''}>Privacy</a></li>
          </ul>
        </nav>
      </header>`;
  }

  private footer(): string {
    return `
      <footer class="site-footer">
        <div>
          <p>Pulse Run is a three-minute single-player rhythm game.</p>
          <p>Original procedural visuals and percussion by Param Factory.</p>
        </div>
        <div class="footer-links">
          <a href="/privacy" data-route>Privacy</a>
          <a href="/terms" data-route>Terms</a>
          <a href="https://sociobot.in" rel="external">Built by Param Factory <span class="visually-hidden">(external site)</span></a>
          <span>v1.0.0</span>
        </div>
      </footer>
      <div class="route-announcement" aria-live="polite" aria-atomic="true" id="route-announcement"></div>`;
  }

  private gameMarkup(): string {
    const labels = this.settings.keys.map((key) => this.keyLabel(key));
    return `
      <section class="game-shell" aria-labelledby="game-panel-title">
        <h2 class="visually-hidden" id="game-panel-title">Active rhythm run</h2>
        <div class="game-topbar">
          <div class="metric"><span>Track</span><strong id="track-value">1 / ${TRACK_COUNT}</strong></div>
          <div class="metric"><span>Time</span><strong id="time-value">0:30</strong></div>
          <div class="metric"><span>Seed</span><strong id="seed-value">PR-0000</strong></div>
          <div class="metric"><span>Score</span><strong id="score-value">0</strong></div>
          <button class="icon-button" type="button" data-settings aria-label="Open game settings">Settings</button>
        </div>
        <div class="game-stage">
          <canvas id="game-canvas" width="720" height="390" role="img" aria-label="Four rhythm lanes. Notes move toward the marked line near the bottom."></canvas>
          <div class="game-overlay" id="game-overlay"></div>
        </div>
        <div class="touch-controls" aria-label="Rhythm lane controls">
          ${labels.map((label, lane) => `<button class="lane-button" type="button" data-lane="${lane}" aria-label="Play lane ${lane + 1}, key ${label}">${label}</button>`).join('')}
        </div>
        <div class="game-note" id="game-note" aria-live="polite"><strong>Goal:</strong> finish six tracks. Three missed phrases end the run.</div>
      </section>
      ${this.settingsDialog()}`;
  }

  private settingsDialog(): string {
    return `
      <dialog id="settings-dialog" aria-labelledby="settings-title">
        <form method="dialog" id="settings-form">
          <h2 id="settings-title">Game settings</h2>
          <p>Changes apply to this run. Real-run settings stay in this browser.</p>
          <label class="setting-row"><span>Play percussion</span><input type="checkbox" name="sound" ${this.settings.sound ? 'checked' : ''}></label>
          <label class="setting-row"><span>Use wider timing</span><input type="checkbox" name="assist" ${this.settings.assist ? 'checked' : ''}></label>
          <label class="setting-row"><span>Reduce visual movement</span><input type="checkbox" name="reduceEffects" ${this.settings.reduceEffects ? 'checked' : ''}></label>
          ${this.settings.keys.map((key, lane) => `
            <label class="setting-row"><span>Lane ${lane + 1} key</span>
              <select name="key${lane}">${KEY_OPTIONS.map(([value, label]) => `<option value="${value}" ${value === key ? 'selected' : ''}>${label}</option>`).join('')}</select>
            </label>`).join('')}
          <div class="dialog-actions">
            <button class="secondary" type="button" data-close-settings>Cancel</button>
            <button value="save" type="submit">Save settings</button>
          </div>
        </form>
      </dialog>`;
  }

  private homePage(): string {
    return `
      <main id="main" tabindex="-1">
        <section class="hero">
          <div class="hero-copy">
            <p class="eyebrow">Single-player browser game</p>
            <h1>Play a three-minute rhythm run</h1>
            <p class="lead">For keyboard players who want a short run with original percussion and no account setup.</p>
            <div class="actions">
              <button type="button" data-start-demo>Try it with sample data</button>
              <button class="secondary" type="button" data-start-real>Start a real run</button>
              <span class="action-note">The sample opens a seeded run with notes already moving.</span>
            </div>
            <ul class="facts">
              <li>Play data stays in this browser.</li>
              <li>Use four keys or the four touch controls.</li>
              <li>Complete costs $5 once. No subscription.</li>
            </ul>
          </div>
          ${this.gameMarkup()}
        </section>
        <section class="content-section" id="how" aria-labelledby="how-title">
          <div class="section-heading">
            <p class="eyebrow">How it works</p>
            <h2 id="how-title">Finish six 30-second tracks</h2>
            <p class="lead">Each choice changes the next note pattern, timing window, or score.</p>
          </div>
          <ol class="steps">
            <li><h3>Match the notes</h3><p>Press D, F, J, and K when notes reach the line. You can remap every key.</p></li>
            <li><h3>Protect each phrase</h3><p>Hit at least two notes in each phrase. Three missed phrases end the run.</p></li>
            <li><h3>Choose the next change</h3><p>Pick one change after each track. Your five changes form the final build.</p></li>
          </ol>
        </section>
        <section class="content-section" aria-labelledby="limits-title">
          <div class="limits-grid">
            <div>
              <p class="eyebrow">Scope and privacy</p>
              <h2 id="limits-title">A finite game with local records</h2>
              <p class="lead">Best scores and settings use browser storage. The sample uses a separate temporary run.</p>
            </div>
            <div>
              <h3>Pulse Run does not include</h3>
              <ul class="plain-list">
                <li>Imported songs or copyrighted recordings</li>
                <li>User-made charts or competitive rankings</li>
                <li>Accounts, advertising, or multiplayer modes</li>
                <li>Analytics, tracking pixels, or third-party scripts</li>
              </ul>
            </div>
          </div>
        </section>
        <section class="content-section" aria-labelledby="price-title">
          <div class="price-grid">
            <div>
              <p class="eyebrow">One-time offer</p>
              <h2 id="price-title">Get every percussion set</h2>
              <p class="lead">The free game includes one complete run, one percussion set, and six run changes.</p>
            </div>
            <div class="price-panel">
              <p class="price"><strong>$5</strong><span>one time</span></p>
              <p class="price-copy">Pulse Run Complete adds the Copper, Paper, and Glass percussion sets. It never adds ads.</p>
              <a class="button-link secondary" href="/license" data-route>View Complete availability</a>
              <span class="availability">Checkout and license activation are not available yet.</span>
            </div>
          </div>
        </section>
      </main>`;
  }

  private demoPage(): string {
    return `
      <div class="demo-banner" role="status">
        <span>Demo — sample data, nothing is saved</span>
        <button type="button" data-reset-demo>Reset demo</button>
        <button class="secondary" type="button" data-start-real>Start for real</button>
      </div>
      <main id="main" class="demo-page" tabindex="-1">
        <div class="demo-heading">
          <div>
            <p class="eyebrow">Seeded sample run</p>
            <h1>Play a three-minute rhythm run</h1>
            <p class="lead">Match the moving notes, then choose a change after each 30-second track.</p>
          </div>
          <div class="sample-record" aria-label="Sample previous result">Sample previous score<strong>18,420</strong>Wide window · 74-note streak</div>
        </div>
        ${this.gameMarkup()}
      </main>`;
  }

  private privacyPage(): string {
    return `
      <main id="main" class="legal-page" tabindex="-1">
        <p class="eyebrow">Privacy</p>
        <h1>Your play data stays on this device</h1>
        <p>Pulse Run has no accounts, analytics, advertising, or tracking pixels.</p>
        <h2>Data stored in your browser</h2>
        <p>Real runs store settings, the current run, completed-run counts, and the best score in local storage. This data does not leave your browser.</p>
        <p>Sample runs stay in memory. They do not read or change real-run storage.</p>
        <h2>Audio and network use</h2>
        <p>The browser creates percussion after you press a play control or rhythm key. No recording is made. No gameplay request is sent to a server.</p>
        <h2>Delete your data</h2>
        <p>Use the button below to delete Pulse Run settings, records, and any saved run from this browser.</p>
        <button class="secondary" type="button" data-delete-data>Delete my play data</button>
        <p id="delete-result" role="status"></p>
      </main>`;
  }

  private termsPage(): string {
    return `
      <main id="main" class="legal-page" tabindex="-1">
        <p class="eyebrow">Terms</p>
        <h1>Terms for playing Pulse Run</h1>
        <p>These terms apply when you use Pulse Run. Last updated 6 September 2026.</p>
        <h2>Free game</h2>
        <p>You may play the free game for personal use. It includes a complete three-minute run, one percussion set, and six run changes.</p>
        <h2>Pulse Run Complete</h2>
        <p>Pulse Run Complete costs $5 USD once. It adds the Copper, Paper, and Glass percussion sets. It is not a subscription.</p>
        <p>Checkout and license activation are not available yet. No purchase can be completed until the Sociobot billing offer is registered.</p>
        <h2>Fair use and availability</h2>
        <p>Do not attempt to disrupt the site or distribute its paid content. The game is provided without a promise of uninterrupted availability.</p>
        <h2>Contact</h2>
        <p>Questions can be sent to <a href="mailto:hello@sociobot.in">hello@sociobot.in</a>.</p>
      </main>`;
  }

  private licensePage(): string {
    return `
      <main id="main" class="legal-page" tabindex="-1">
        <p class="eyebrow">Pulse Run Complete</p>
        <h1>Get the complete rhythm set</h1>
        <p>Pulse Run Complete costs $5 USD once. It is not a subscription.</p>
        <h2>Included after activation</h2>
        <ul>
          <li>Copper, Paper, and Glass original percussion sets</li>
          <li>The same local-only scores and settings</li>
        </ul>
        <h2>Current availability</h2>
        <p>Checkout and license activation are not available yet. The billing operator still needs to register this public offer.</p>
        <p>No payment or activation has been tested. You can play the complete free run now.</p>
        <a class="button-link" href="/" data-route>Play the free run</a>
      </main>`;
  }

  private notFoundPage(): string {
    return `
      <main id="main" class="legal-page" tabindex="-1">
        <p class="eyebrow">404</p>
        <h1>This page is not part of the run</h1>
        <p>The address does not match a Pulse Run page.</p>
        <a class="button-link" href="/" data-route>Return to the game</a>
      </main>`;
  }

  private renderRoute(moveFocus: boolean): void {
    this.route = window.location.pathname;
    this.mode = this.isDemoPath() ? 'demo' : 'real';
    if (this.mode === 'demo') {
      this.settings = structuredClone(DEFAULT_SETTINGS);
      this.audio.setEnabled(this.settings.sound);
    }

    let body: string;
    switch (this.route) {
      case '/':
        this.setMetadata('Pulse Run — Play a three-minute rhythm run', 'Play a three-minute keyboard rhythm run with original percussion and choices that change each track.');
        body = this.homePage();
        break;
      case '/demo':
        this.setMetadata('Demo — Pulse Run', 'Play the seeded Pulse Run sample without changing real play data.');
        body = this.demoPage();
        break;
      case '/privacy':
        this.setMetadata('Privacy — Pulse Run', 'Read what Pulse Run stores in your browser and delete your play data.');
        body = this.privacyPage();
        break;
      case '/terms':
        this.setMetadata('Terms — Pulse Run', 'Read the terms for the free game and the $5 one-time Complete offer.');
        body = this.termsPage();
        break;
      case '/license':
        this.setMetadata('Complete offer — Pulse Run', 'See the $5 one-time Pulse Run Complete content and its current availability.');
        body = this.licensePage();
        break;
      default:
        this.setMetadata('Page not found — Pulse Run', 'Return to the Pulse Run rhythm game.');
        body = this.notFoundPage();
        break;
    }

    appRoot.innerHTML = `${this.header()}${body}${this.footer()}`;
    this.bindPageEvents();

    if (this.route === '/' || this.route === '/demo') {
      this.canvas = document.querySelector<HTMLCanvasElement>('#game-canvas');
      this.context = this.canvas?.getContext('2d') ?? null;
      if (this.route === '/demo') {
        if (!this.game || this.mode !== 'demo') this.createGame('demo');
        if (this.game?.status === 'ready') this.game.start();
      } else if (!this.game || this.mode !== 'real') {
        this.restoreOrCreateRealGame();
      }
      this.applySettingsToGame();
      this.lastStatus = '';
      this.syncGameDom();
    } else {
      this.canvas = null;
      this.context = null;
      if (this.game?.status === 'playing') this.game.pause();
      this.saveRun();
    }

    if (moveFocus) {
      const heading = document.querySelector<HTMLElement>('h1');
      heading?.setAttribute('tabindex', '-1');
      heading?.focus();
      const announcement = document.querySelector('#route-announcement');
      if (announcement && heading) announcement.textContent = heading.textContent;
      window.scrollTo({ top: 0, behavior: this.settings.reduceEffects ? 'auto' : 'smooth' });
    }
  }

  private setMetadata(title: string, description: string): void {
    document.title = title;
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `https://pulse-run.sociobot.in${this.route === '/' ? '/' : this.route}`);
  }

  private bindGlobalEvents(): void {
    window.addEventListener('popstate', () => this.renderRoute(true));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.game?.status === 'playing') {
        this.game.pause();
        this.saveRun();
        this.syncGameDom();
      }
    });
    window.addEventListener('keydown', (event) => this.handleKey(event));
  }

  private bindPageEvents(): void {
    document.querySelectorAll<HTMLAnchorElement>('a[data-route]').forEach((link) => {
      link.addEventListener('click', (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const target = new URL(link.href);
        if (target.origin !== window.location.origin) return;
        event.preventDefault();
        if (target.pathname === '/demo') {
          void this.audio.unlock();
          this.createGame('demo');
          this.game?.start();
        }
        this.navigate(target.pathname);
      });
    });

    document.querySelectorAll<HTMLElement>('[data-start-demo]').forEach((button) => button.addEventListener('click', () => {
      void this.audio.unlock();
      this.createGame('demo');
      this.game?.start();
      this.navigate('/demo');
    }));

    document.querySelectorAll<HTMLElement>('[data-start-real]').forEach((button) => button.addEventListener('click', () => {
      void this.audio.unlock();
      this.createGame('real');
      this.game?.start();
      this.saveRun();
      if (this.route !== '/') this.navigate('/'); else this.syncGameDom();
    }));

    document.querySelectorAll<HTMLElement>('[data-reset-demo]').forEach((button) => button.addEventListener('click', () => {
      void this.audio.unlock();
      this.createGame('demo');
      this.game?.start();
      this.syncGameDom();
      document.querySelector<HTMLCanvasElement>('#game-canvas')?.focus();
    }));

    document.querySelectorAll<HTMLButtonElement>('[data-lane]').forEach((button) => {
      button.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        const lane = Number(button.dataset.lane);
        void this.audio.unlock();
        this.playLane(lane);
      });
      button.addEventListener('click', () => {
        if (button.matches(':focus-visible')) this.playLane(Number(button.dataset.lane));
      });
    });

    document.querySelector<HTMLElement>('[data-settings]')?.addEventListener('click', () => this.openSettings());
    document.querySelector<HTMLElement>('[data-close-settings]')?.addEventListener('click', () => {
      document.querySelector<HTMLDialogElement>('#settings-dialog')?.close();
    });
    document.querySelector<HTMLFormElement>('#settings-form')?.addEventListener('submit', (event) => this.saveSettingsForm(event));

    document.querySelector<HTMLElement>('[data-delete-data]')?.addEventListener('click', () => {
      Object.values(STORAGE).forEach((key) => localStorage.removeItem(key));
      const result = document.querySelector('#delete-result');
      if (result) result.textContent = 'Pulse Run play data was deleted from this browser.';
    });
  }

  private navigate(path: string): void {
    if (this.route === path) {
      this.renderRoute(true);
      return;
    }
    history.pushState({}, '', path);
    this.renderRoute(true);
  }

  private createGame(mode: PlayMode): void {
    this.mode = mode;
    this.settings = mode === 'demo' ? structuredClone(DEFAULT_SETTINGS) : this.loadSettings();
    const seed = mode === 'demo' ? 'pulse-run-sample-2026' : Math.floor(Date.now() / 1_000);
    this.game = new PulseGame(seed);
    this.applySettingsToGame();
    this.audio.setEnabled(this.settings.sound);
    this.audio.resetBeat();
    this.handledEnd = false;
    this.lastStatus = '';
    if (mode === 'real') {
      this.incrementStartedRuns();
      this.saveRun();
    }
  }

  private restoreOrCreateRealGame(): void {
    this.mode = 'real';
    this.settings = this.loadSettings();
    try {
      const stored = localStorage.getItem(STORAGE.run);
      if (stored) {
        const snapshot = JSON.parse(stored) as GameSnapshot;
        this.game = PulseGame.fromSnapshot(snapshot);
        if (this.game.status === 'playing') this.game.pause();
        this.applySettingsToGame();
        return;
      }
    } catch {
      localStorage.removeItem(STORAGE.run);
    }
    this.game = new PulseGame('pulse-run-preview');
    this.applySettingsToGame();
  }

  private applySettingsToGame(): void {
    if (this.game) this.game.assistMode = this.settings.assist;
  }

  private handleKey(event: KeyboardEvent): void {
    if (document.querySelector<HTMLDialogElement>('dialog[open]')) return;
    if (event.key === 'Escape' && this.game) {
      if (this.game.status === 'playing') this.game.pause();
      else if (this.game.status === 'paused') this.game.start();
      this.syncGameDom();
      return;
    }
    const lane = this.settings.keys.indexOf(event.code);
    if (lane === -1 || !this.game || (this.route !== '/' && this.route !== '/demo')) return;
    event.preventDefault();
    void this.audio.unlock();
    this.playLane(lane);
  }

  private playLane(lane: number): void {
    if (!this.game) return;
    if (this.game.status === 'ready' || this.game.status === 'paused') this.game.start();
    const result = this.game.hitLane(lane);
    if (result) {
      this.audio.hit(lane, result === 'perfect');
      const note = document.querySelector('#game-note');
      if (note) note.textContent = `${result === 'perfect' ? 'Perfect' : 'Good'} hit. Streak ${this.game.streak}.`;
    }
    this.syncGameDom();
  }

  private openSettings(): void {
    if (this.game?.status === 'playing') this.game.pause();
    this.syncGameDom();
    document.querySelector<HTMLDialogElement>('#settings-dialog')?.showModal();
  }

  private saveSettingsForm(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    this.settings = {
      sound: data.get('sound') === 'on',
      assist: data.get('assist') === 'on',
      reduceEffects: data.get('reduceEffects') === 'on',
      keys: [0, 1, 2, 3].map((lane) => String(data.get(`key${lane}`))),
    };
    const unique = new Set(this.settings.keys);
    if (unique.size !== 4) {
      const note = form.querySelector('p');
      if (note) note.textContent = 'Choose a different key for each lane.';
      return;
    }
    if (this.mode === 'real') localStorage.setItem(STORAGE.settings, JSON.stringify(this.settings));
    this.audio.setEnabled(this.settings.sound);
    this.applySettingsToGame();
    document.querySelector<HTMLDialogElement>('#settings-dialog')?.close();
    this.renderRoute(false);
  }

  private loadSettings(): Settings {
    try {
      const stored = localStorage.getItem(STORAGE.settings);
      if (!stored) return structuredClone(DEFAULT_SETTINGS);
      const parsed = JSON.parse(stored) as Partial<Settings>;
      return {
        sound: typeof parsed.sound === 'boolean' ? parsed.sound : true,
        assist: typeof parsed.assist === 'boolean' ? parsed.assist : false,
        reduceEffects: typeof parsed.reduceEffects === 'boolean' ? parsed.reduceEffects : DEFAULT_SETTINGS.reduceEffects,
        keys: Array.isArray(parsed.keys) && parsed.keys.length === 4 ? parsed.keys : [...DEFAULT_SETTINGS.keys],
      };
    } catch {
      return structuredClone(DEFAULT_SETTINGS);
    }
  }

  private incrementStartedRuns(): void {
    const stats = this.loadStats();
    stats.startedRuns += 1;
    localStorage.setItem(STORAGE.stats, JSON.stringify(stats));
  }

  private loadStats(): Stats {
    try {
      const stored = localStorage.getItem(STORAGE.stats);
      if (!stored) return { bestScore: 0, completedRuns: 0, startedRuns: 0 };
      const parsed = JSON.parse(stored) as Partial<Stats>;
      return {
        bestScore: parsed.bestScore ?? 0,
        completedRuns: parsed.completedRuns ?? 0,
        startedRuns: parsed.startedRuns ?? 0,
      };
    } catch {
      return { bestScore: 0, completedRuns: 0, startedRuns: 0 };
    }
  }

  private saveRun(): void {
    if (this.mode !== 'real' || !this.game) return;
    if (this.game.status === 'won' || this.game.status === 'lost' || this.game.status === 'ready') {
      localStorage.removeItem(STORAGE.run);
      return;
    }
    localStorage.setItem(STORAGE.run, JSON.stringify(this.game.toSnapshot()));
  }

  private handleEnd(): void {
    if (!this.game || this.handledEnd || (this.game.status !== 'won' && this.game.status !== 'lost')) return;
    this.handledEnd = true;
    if (this.mode === 'real') {
      const stats = this.loadStats();
      stats.bestScore = Math.max(stats.bestScore, this.game.score);
      if (this.game.status === 'won') stats.completedRuns += 1;
      localStorage.setItem(STORAGE.stats, JSON.stringify(stats));
      localStorage.removeItem(STORAGE.run);
    }
  }

  private frame(time: number): void {
    const rawDelta = Math.min(100, Math.max(0, time - this.lastFrame));
    this.lastFrame = time;
    this.frameTimes.push(time);
    this.frameTimes = this.frameTimes.filter((frame) => time - frame <= 2_000);

    if (this.game?.status === 'playing' && !document.hidden) {
      this.accumulator += rawDelta;
      const fixedStep = 1_000 / 60;
      while (this.accumulator >= fixedStep) {
        this.game.step(fixedStep);
        this.accumulator -= fixedStep;
      }
      this.audio.tick(this.game.trackTime, this.game.track);
      if (time - this.lastSave > 1_000) {
        this.saveRun();
        this.lastSave = time;
      }
    }

    this.handleEnd();
    this.syncGameDom();
    this.drawGame(time);
    requestAnimationFrame((next) => this.frame(next));
  }

  private syncGameDom(): void {
    if (!this.game || !this.canvas) return;
    const trackValue = document.querySelector('#track-value');
    const timeValue = document.querySelector('#time-value');
    const seedValue = document.querySelector('#seed-value');
    const scoreValue = document.querySelector('#score-value');
    if (trackValue) trackValue.textContent = `${this.game.track + 1} / ${TRACK_COUNT}`;
    if (timeValue) timeValue.textContent = this.formatTime(Math.max(0, TRACK_DURATION_MS - this.game.trackTime));
    if (seedValue) seedValue.textContent = `PR-${String(this.game.seed % 10_000).padStart(4, '0')}`;
    if (scoreValue) scoreValue.textContent = this.game.score.toLocaleString('en-US');

    const overlay = document.querySelector<HTMLDivElement>('#game-overlay');
    if (!overlay) return;
    const choiceKey = this.game.status === 'choice' ? this.game.choices.join('-') : '';
    const overlayKey = `${this.game.status}:${choiceKey}:${this.game.score}:${this.game.missedPhrases}`;
    if (overlayKey === this.lastStatus) return;
    this.lastStatus = overlayKey;

    if (this.game.status === 'playing') {
      overlay.hidden = true;
      overlay.innerHTML = '';
      return;
    }

    overlay.hidden = false;
    if (this.game.status === 'ready') {
      overlay.innerHTML = `<h2>Start at track one</h2><p>Match four lanes for 30 seconds, then choose one change.</p><button type="button" data-overlay-start>Start the run</button>`;
      overlay.querySelector('[data-overlay-start]')?.addEventListener('click', () => {
        void this.audio.unlock();
        if (this.mode === 'real') this.incrementStartedRuns();
        this.game?.start();
        this.saveRun();
        this.syncGameDom();
      });
    } else if (this.game.status === 'paused') {
      overlay.innerHTML = `<h2>Run paused</h2><p>Your place is saved on this device${this.mode === 'demo' ? ' only until you leave the sample' : ''}.</p><button type="button" data-resume>Resume the run</button>`;
      overlay.querySelector('[data-resume]')?.addEventListener('click', () => {
        void this.audio.unlock();
        this.game?.start();
        this.syncGameDom();
      });
    } else if (this.game.status === 'choice') {
      const choices = this.game.choices.map((id) => FREE_MODIFIERS.find((modifier) => modifier.id === id)).filter(Boolean);
      overlay.innerHTML = `<h2>Choose the next track change</h2><p>Track ${this.game.track + 1} is complete. Pick one change for track ${this.game.track + 2}.</p><div class="choice-grid">${choices.map((choice) => `<button class="choice-button" type="button" data-choice="${choice?.id}">${choice?.name}<span>${choice?.description}</span></button>`).join('')}</div>`;
      overlay.querySelectorAll<HTMLButtonElement>('[data-choice]').forEach((button) => button.addEventListener('click', () => {
        this.game?.choose(String(button.dataset.choice));
        this.audio.resetBeat();
        this.saveRun();
        this.lastStatus = '';
        this.syncGameDom();
      }));
      if (document.activeElement === document.body) overlay.querySelector<HTMLButtonElement>('[data-choice]')?.focus();
    } else {
      const won = this.game.status === 'won';
      overlay.innerHTML = `<h2>${won ? 'Run complete' : 'Run ended'}</h2><p>${won ? 'You finished all six tracks.' : 'Three missed phrases ended this run.'}</p><p><strong>${this.game.score.toLocaleString('en-US')} points</strong> · ${this.game.bestStreak}-note best streak · ${this.formatTime(this.game.runTime)} played</p><button type="button" data-restart>Play again</button>`;
      overlay.querySelector('[data-restart]')?.addEventListener('click', () => {
        this.game?.restart();
        this.game?.start();
        this.applySettingsToGame();
        this.audio.resetBeat();
        this.handledEnd = false;
        if (this.mode === 'real') this.incrementStartedRuns();
        this.saveRun();
        this.lastStatus = '';
        this.syncGameDom();
      });
    }
  }

  private drawGame(time: number): void {
    if (!this.canvas || !this.context || !this.game) return;
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(rect.width * dpr);
    const height = Math.round(rect.height * dpr);
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    const context = this.context;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = rect.width;
    const h = rect.height;
    const laneWidth = w / 4;
    const judgeY = h - 62;
    context.clearRect(0, 0, w, h);
    context.fillStyle = '#090e15';
    context.fillRect(0, 0, w, h);

    for (let lane = 0; lane < 4; lane += 1) {
      context.fillStyle = lane % 2 === 0 ? '#101a25' : '#0d151f';
      context.fillRect(lane * laneWidth, 0, laneWidth, h);
      context.strokeStyle = '#2b4150';
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(lane * laneWidth, 0);
      context.lineTo(lane * laneWidth, h);
      context.stroke();
    }

    context.strokeStyle = '#f5f1df';
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(0, judgeY);
    context.lineTo(w, judgeY);
    context.stroke();

    const displayedTime = this.game.status === 'ready' ? (time % 4_000) : this.game.trackTime;
    const notes = this.game.status === 'ready'
      ? this.game.notes.map((note) => ({ ...note, at: ((note.at - displayedTime + 4_000) % 4_000) + displayedTime, resolved: false }))
      : this.game.notes;
    const colors = ['#ff735e', '#f7cf66', '#66e3e0', '#7ae49c'];
    for (const note of notes) {
      if (note.resolved && !this.settings.reduceEffects) continue;
      const delta = note.at - displayedTime;
      if (delta < -180 || delta > 2_400) continue;
      const y = judgeY - (delta / 2_400) * (h - 92);
      const x = note.lane * laneWidth + laneWidth * 0.18;
      context.fillStyle = note.hit ? '#7ae49c' : colors[note.lane];
      context.globalAlpha = note.resolved ? 0.28 : 1;
      context.fillRect(x, y - 9, laneWidth * 0.64, 18);
      context.globalAlpha = 1;
    }

    const labels = this.settings.keys.map((key) => this.keyLabel(key));
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = '700 14px ui-monospace, monospace';
    for (let lane = 0; lane < 4; lane += 1) {
      context.fillStyle = colors[lane];
      context.fillRect(lane * laneWidth + 5, judgeY + 12, laneWidth - 10, 38);
      context.fillStyle = '#081015';
      context.fillText(labels[lane], lane * laneWidth + laneWidth / 2, judgeY + 31);
    }

    context.textAlign = 'left';
    context.fillStyle = '#b9c2c7';
    context.font = '600 12px system-ui, sans-serif';
    context.fillText(`MISSED PHRASES ${this.game.missedPhrases} / 3`, 12, 18);
    context.textAlign = 'right';
    context.fillText(`${this.game.modifiers.length} CHANGES`, w - 12, 18);
  }

  private installQaApi(): void {
    const query = new URLSearchParams(window.location.search);
    const local = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
    if (!local || query.get('qa') !== '1') return;
    window.__PULSE_QA__ = {
      finishRun: () => {
        this.game?.finishPerfectRun();
        this.handleEnd();
        this.lastStatus = '';
        this.syncGameDom();
      },
      loseRun: () => {
        this.game?.finishMissedRun();
        this.handleEnd();
        this.lastStatus = '';
        this.syncGameDom();
      },
      placeNote: (lane: number) => {
        if (!this.game) return;
        if (this.game.status === 'ready' || this.game.status === 'paused') this.game.start();
        const note = this.game.notes.find((candidate) => !candidate.resolved);
        if (!note) return;
        note.lane = lane;
        note.at = this.game.trackTime;
        this.syncGameDom();
      },
      snapshot: () => this.game?.toSnapshot() ?? null,
      fps: () => this.measuredFps(),
    };
  }

  private measuredFps(): number {
    if (this.frameTimes.length < 2) return 0;
    const elapsed = this.frameTimes.at(-1)! - this.frameTimes[0];
    return elapsed > 0 ? (this.frameTimes.length - 1) * 1_000 / elapsed : 0;
  }

  private formatTime(milliseconds: number): string {
    const totalSeconds = Math.round(milliseconds / 1_000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  private keyLabel(code: string): string {
    return KEY_OPTIONS.find(([value]) => value === code)?.[1] ?? code.replace('Key', '');
  }
}

new PulseRunApp();
