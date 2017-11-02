export const coriolisUrl = process.env.CORIOLIS_URL || '/'

export const servicesUrl = {
  identity: `${coriolisUrl}identity/auth/tokens`,
  projects: `${coriolisUrl}identity/auth/projects`,
  users: `${coriolisUrl}identity/users`,
  endpoints: `${coriolisUrl}coriolis/endpoints`,
  coriolis: `${coriolisUrl}coriolis`,
  migrations: `${coriolisUrl}coriolis/migrations`,
  barbican: `${coriolisUrl}barbican`,
  openId: `${coriolisUrl}identity/OS-FEDERATION/identity_providers/google/protocols/openid/auth`,
}

export const useSecret = true // use secret_ref when creating and endpoint

export const requestPollTimeout = 5000

export const loginButtons = [
  // {
  //   name: 'Google',
  //   id: 'google',
  //   url: '',
  // },
]

export const env = {
  name: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',
  isBrowser: typeof window !== 'undefined',
}

export const wizardConfig = {
  pages: ['type', 'source', 'target', 'vms', 'networks', 'options', 'schedule', 'summary'],
}

export const basename = process.env.PUBLIC_PATH
