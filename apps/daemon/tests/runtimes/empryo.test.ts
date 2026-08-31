import { describe, expect, test } from 'vitest';

import { empryoAgentDef } from '../../src/runtimes/defs/empryo.js';
import { getAgentDef } from '../../src/runtimes/registry.js';

describe('Empryo runtime adapter', () => {
  test('is registered as a shipped runtime', () => {
    expect(getAgentDef('empryo')).toBe(empryoAgentDef);
  });

  test('uses headless stdin mode by default', () => {
    expect(empryoAgentDef.promptViaStdin).toBe(true);
    expect(empryoAgentDef.streamFormat).toBe('plain');
    expect(empryoAgentDef.buildArgs('', [], [], {}, {})).toEqual([
      '--headless',
      '--quiet',
    ]);
  });

  test('passes the OpenDesign project cwd to Empryo', () => {
    const args = empryoAgentDef.buildArgs('', [], [], {}, { cwd: '/tmp/design-project' });
    expect(args).toEqual([
      '--headless',
      '--quiet',
      '--cwd',
      '/tmp/design-project',
    ]);
  });

  test('passes a custom provider/model id through unchanged', () => {
    const args = empryoAgentDef.buildArgs(
      '',
      [],
      [],
      { model: 'openrouter/anthropic/claude-sonnet-4.6' },
      { cwd: '/tmp/design-project' },
    );

    expect(args).toEqual([
      '--headless',
      '--quiet',
      '--cwd',
      '/tmp/design-project',
      '--model',
      'openrouter/anthropic/claude-sonnet-4.6',
    ]);
  });

  test('does not emit a model flag for the default model', () => {
    const args = empryoAgentDef.buildArgs(
      '',
      [],
      [],
      { model: 'default' },
      {},
    );

    expect(args).toEqual(['--headless', '--quiet']);
  });
});
