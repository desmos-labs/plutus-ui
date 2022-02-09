/**
 * Contains the data of a Desmos profile.
 */
export type Profile = {
  address: string;
  dTag?: string;
  nickname?: string;
  coverPicture?: string;
  profilePicture?: string;
}

export function getDisplayName(profile: Profile): string {
  return profile.nickname || profile.dTag || profile.address;
}