export enum Platform {
  STREAMLABS = "Streamlabs",
  STRAMELEMENTS = "StreamElements"
}

export type OAuthParams = {
  oAuthCode?: string,
  oAuthState?: string,
}