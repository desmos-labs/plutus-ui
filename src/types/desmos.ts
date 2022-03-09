import { Profile } from "@desmoslabs/desmjs-types/desmos/profiles/v1beta1/models_profile";

export type DesmosProfile = Partial<Omit<Profile, "account">> & {
  readonly address: string;
  readonly coverPicture?: string;
  readonly profilePicture?: string;
};

export function convertProfile(
  address: string,
  profile: Profile | null
): DesmosProfile {
  return {
    address,
    dtag: profile?.dtag?.length ? profile.dtag : undefined,
    nickname: profile?.nickname?.length ? profile.nickname : undefined,
    bio: profile?.bio?.length ? profile.bio : undefined,
    profilePicture: profile?.pictures?.profile?.length
      ? profile.pictures.profile
      : undefined,
    coverPicture: profile?.pictures?.cover?.length
      ? profile.pictures.cover
      : undefined,
  };
}

export interface DesmosAppLink {
  readonly profile: DesmosProfile;
  readonly application: string;
  readonly username: string;
}
