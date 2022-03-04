import { UserData } from "../../types";

export enum LoginStep {
  LOADING,
  LOGGED_OUT,
  LOGGED_IN,
}

export interface Loading {
  step: LoginStep.LOADING;
}

export interface LoggedOut {
  step: LoginStep.LOGGED_OUT;
  message?: string;
}

export interface LoggedIn {
  step: LoginStep.LOGGED_IN;
  account: UserData;
}

export type UserState = Loading | LoggedOut | LoggedIn;
