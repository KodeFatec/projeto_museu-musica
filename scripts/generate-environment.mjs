import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const parentRoot = resolve(root, '..');

const localEnvPath = resolve(root, '.env');
const parentEnvPath = resolve(parentRoot, '.env');

const parentEnv = existsSync(parentEnvPath) ? dotenv.parse(readFileSync(parentEnvPath)) : {};
const localEnv = existsSync(localEnvPath) ? dotenv.parse(readFileSync(localEnvPath)) : {};

const env = { ...parentEnv, ...localEnv, ...process.env };

const backendUrl = (env.BACKEND_URL || 'http://localhost:3000').replace(/\/+$/, '');
const apiBaseUrl = (env.API_BASE_URL || `${backendUrl}/api`).replace(/\/+$/, '');
const useMocks = String(env.USE_MOCKS || 'false').toLowerCase() === 'true';

const outputDirectory = resolve(root, 'src', 'environments');
mkdirSync(outputDirectory, { recursive: true });

const output = `export interface FrontendEnvironment {
  backendUrl: string;
  apiBaseUrl: string;
  useMocks: boolean;
}

export const generatedEnvironment: FrontendEnvironment = {
  backendUrl: ${JSON.stringify(backendUrl)},
  apiBaseUrl: ${JSON.stringify(apiBaseUrl)},
  useMocks: ${useMocks},
};
`;

writeFileSync(resolve(outputDirectory, 'environment.generated.ts'), output);

const proxy = {
  '/api': {
    target: backendUrl,
    secure: false,
    changeOrigin: true,
  },
};

writeFileSync(resolve(root, 'proxy.conf.json'), `${JSON.stringify(proxy, null, 2)}\n`);
