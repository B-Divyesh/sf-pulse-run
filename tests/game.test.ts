import { describe, expect, it } from 'vitest';
import { PulseGame, RUN_DURATION_MS, TRACK_COUNT } from '../src/game';

describe('PulseGame deterministic simulation', () => {
  it('creates the same note chart for the same seed', () => {
    const first = new PulseGame('test-seed');
    const second = new PulseGame('test-seed');
    const other = new PulseGame('another-seed');

    expect(first.notes.map(({ lane, at }) => ({ lane, at }))).toEqual(second.notes.map(({ lane, at }) => ({ lane, at })));
    expect(first.notes.map((note) => note.lane)).not.toEqual(other.notes.map((note) => note.lane));
  });

  it('plays all six tracks and five choices before a win', () => {
    const game = new PulseGame('winning-seed');
    game.start();
    game.finishPerfectRun();

    expect(game.status).toBe('won');
    expect(game.track).toBe(TRACK_COUNT - 1);
    expect(game.runTime).toBe(RUN_DURATION_MS);
    expect(game.modifiers).toHaveLength(TRACK_COUNT - 1);
    expect(game.score).toBeGreaterThan(0);
    expect(game.missedPhrases).toBe(0);
  });

  it('ends on exactly the third missed phrase', () => {
    const game = new PulseGame('losing-seed');
    game.start();
    game.finishMissedRun();

    expect(game.status).toBe('lost');
    expect(game.missedPhrases).toBe(3);
    expect(game.runTime).toBe(6_000);
    expect(game.track).toBe(0);
  });

  it('rejects an unknown choice without changing the run', () => {
    const game = new PulseGame('choice-seed');
    game.start();
    game.finishPerfectRun();
    game.restart();
    game.start();
    while (game.status === 'playing') {
      for (const note of game.notes) {
        if (!note.resolved && note.at <= game.trackTime + 10) game.hitLane(note.lane);
      }
      game.step(10);
    }

    expect(game.status).toBe('choice');
    expect(game.choose('not-a-modifier')).toBe(false);
    expect(game.track).toBe(0);
    expect(game.modifiers).toEqual([]);
  });

  it('restores the exact in-progress state from a snapshot', () => {
    const game = new PulseGame('recovery-seed');
    game.start();
    game.step(2_750);
    game.pause();
    const restored = PulseGame.fromSnapshot(game.toSnapshot());

    expect(restored.toSnapshot()).toEqual(game.toSnapshot());
    restored.start();
    restored.step(250);
    expect(restored.runTime).toBe(3_000);
  });
});
