export enum Platform {
  STREAMLABS = "Streamlabs",
  STREAMELEMENTS = "StreamElements",
  UNKNOWN = "unknown"
}

export function parsePlatform(value: string): Platform {
  switch (value.toLowerCase()) {
    case "streamlabs":
      return Platform.STREAMLABS;
    case "streamelements":
      return Platform.STREAMELEMENTS;
    default:
      return Platform.UNKNOWN;
  }
}

export type OAuthParams = {
  oAuthCode?: string,
  oAuthState?: string,
}