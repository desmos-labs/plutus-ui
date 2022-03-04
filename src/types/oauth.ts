export enum Platform {
  STREAMLABS = "Streamlabs",
  STREAMELEMENTS = "StreamElements",
  UNKNOWN = "unknown",
}

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

export function getPlatforms(): Platform[] {
  return enumKeys(Platform)
    .map((value) => Platform[value])
    .filter((platform) => platform !== Platform.UNKNOWN);
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
  oAuthCode: string | null;
  oAuthState: string | null;
  oAuthError: string | null;
};
