import { ModuleFederationConfig } from '@nx/module-federation';
import { environment } from './src/environments/environment';

const config: ModuleFederationConfig = {
  name: 'host-app',
  remotes: [['resume-account-mf', environment.mfUrl]],
};

export default config;
