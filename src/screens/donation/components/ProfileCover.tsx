import * as React from "react";

import defaultCover from "../../../assets/default-cover.png";
import { DesmosProfile } from "../../../types";
import {
  getApplicationIconSrc,
  getDisplayName,
  getProfilePic,
} from "../../../components/utils";

interface ProfileCoverProps extends React.HTMLAttributes<HTMLDivElement> {
  application: string;
  username: string;
  profile: DesmosProfile;
}

function ProfileCover({
  application,
  username,
  profile,
  ...props
}: ProfileCoverProps) {
  const coverPicture = profile?.coverPicture || defaultCover;

  const coverStyle = {
    backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${coverPicture})`,
  };

  return (
    <div
      {...props}
      className={`bg-cover bg-center rounded-xl relative ${props.className}`}
      style={coverStyle}
    >
      <div className="absolute bottom-4 left-4 flex md:flex-row">
        <img
          className="h-14 w-14 md:h-20 md:w-20 rounded-xl"
          src={getProfilePic(profile)}
          alt="Profile"
        />
        <div className="text-white text-left ml-3">
          <h4 className="font-medium">{getDisplayName(profile)}</h4>
          <div className="flex flex-row">
            <img
              className="h-4 my-auto"
              alt={`${application} icon`}
              src={getApplicationIconSrc(application)}
            />
            <p className="text-sm ml-1 my-auto">{username}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCover;
