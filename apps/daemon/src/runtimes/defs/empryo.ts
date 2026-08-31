import { DEFAULT_MODEL_OPTION } from './shared.js';
import type { RuntimeAgentDef } from '../types.js';

/**
 * Empryo — graph-powered coding agent with a headless CLI.
 *
 * OpenDesign delegates the full agent loop to Empryo. The composed OD prompt
 * is delivered on stdin so large DESIGN.md / SKILL.md payloads do not hit
 * platform argv limits. Empryo owns model routing, tool use, repository
 * intelligence, sub-agents, permissions, and edits.
 *
 * Empryo supports structured JSONL via `--events`, but the initial adapter uses
 * its stable plain stdout contract. This keeps the integration small and
 * reliable while still preserving Empryo's complete headless agent behavior.
 */
export const empryoAgentDef = {
  id: 'empryo',
  name: 'Empryo',
  bin: 'empryo',
  versionArgs: ['--version'],
  helpArgs: ['--help'],
  fallbackModels: [DEFAULT_MODEL_OPTION],
  supportsCustomModel: true,
  buildArgs: (
    _prompt,
    _imagePaths,
    _extraAllowedDirs = [],
    options = {},
    runtimeContext = {},
  ) => {
    const args = ['--headless', '--quiet'];

    if (runtimeContext.cwd) {
      args.push('--cwd', runtimeContext.cwd);
    }

    if (options.model && options.model !== DEFAULT_MODEL_OPTION.id) {
      args.push('--model', options.model);
    }

    return args;
  },
  promptViaStdin: true,
  streamFormat: 'plain',
  installUrl: 'https://empryo.com/download',
  docsUrl: 'https://empryo.com',
} satisfies RuntimeAgentDef;
