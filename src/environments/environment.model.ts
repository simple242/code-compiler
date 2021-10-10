export interface Environment {
  production: boolean
  fbUser: {
    id: string
    email: string
  },
  fbConfig: {
    apiKey: string,
    authDomain: string,
    databaseURL?: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string,
    measurementId?: string
  },
  compiler: {
    apiUrl: string
  }
}
