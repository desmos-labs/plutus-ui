/**
 * Represents the state of the user when they are logged out of the application.
 */
export interface LoggedOut {
  isLoggedIn: false
  message?: string;
}

/**
 * Represents the state of the user when they are logged into the application.
 */
export interface LoggedIn {
  isLoggedIn: true
  desmosAddress: string;
}

export type UserState = LoggedOut | LoggedIn
