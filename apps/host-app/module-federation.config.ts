import { ModuleFederationConfig } from '@nx/module-federation';

const isProd = process.env.NODE_ENV === 'production';

export const environment = {
  production: isProd,
  mfUrl: isProd ? process.env['NG_APP_MF_URL'] as string : 'http://localhost:4201',
};

const config: ModuleFederationConfig = {
  name: 'host-app',
  remotes: [['resume-account-mf', environment.mfUrl]],
};

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NG_APP_MF_URL:', process.env['NG_APP_MF_URL']);

export default config;
