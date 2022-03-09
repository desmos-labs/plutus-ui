import { DesmosProfile } from "../types";
import twitterSrc from "../assets/icons/twitter.svg";
import twitchSrc from "../assets/icons/twitch.svg";
import githubSrc from "../assets/icons/github.svg";
import discordSrc from "../assets/icons/discord.svg";

const EXPLORER_URL = process.env.REACT_APP_CHAIN_EXPLORER_ENDPOINT as string;

/**
 * Returns the explorer link to the transaction having the given hash.
 * @param txHash {string | undefined}: Hash of the transaction.
 */
export function getTxLink(txHash: string | undefined): string {
  return `${EXPLORER_URL}/transactions/${txHash || ""}`;
}

export function getDTag(profile: DesmosProfile): string {
  return profile.dtag ? `@${profile.dtag}` : "";
}

export function getDisplayName(profile: DesmosProfile): string {
  return profile.nickname || `@${profile.dtag}` || profile.address;
}

export function getShortAddress(profile: DesmosProfile): string {
  return `${profile.address.substring(0, 14)}...${profile.address.substring(
    profile.address.length - 10
  )}`;
}

// TODO: Move this somewhere else (maybe get it from the APIs).
const supportedApps = ["twitch", "twitter", "github", "discord"];

export function isAppSupported(application: string): boolean {
  return supportedApps.includes(application.toLowerCase());
}

// TODO: Maybe get this from the API config?
export function getApplicationIconSrc(application: string): string {
  switch (application.toLowerCase()) {
    case "twitter":
      return twitterSrc;
    case "twitch":
      return twitchSrc;
    case "github":
      return githubSrc;
    case "discord":
      return discordSrc;
    default:
      return "";
  }
}
