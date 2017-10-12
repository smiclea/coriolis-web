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

export const loginButtons = [
  {
    name: 'Google',
    id: 'google',
    url: '',
  },
  // {
  //   name: 'Microsoft',
  //   id: 'microsoft',
  //   url: '',
  // },
  // {
  //   name: 'Facebook',
  //   id: 'facebook',
  //   url: '',
  // },
  // {
  //   name: 'Github',
  //   id: 'github',
  //   url: '',
  // },
]

export const env = {
  name: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',
  isBrowser: typeof window !== 'undefined',
}

export const basename = process.env.PUBLIC_PATH
