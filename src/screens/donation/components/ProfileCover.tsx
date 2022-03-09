import * as React from "react";

import defaultProfilePic from "../../../assets/default-icon.svg";
import defaultCover from "../../../assets/default-cover.png";
import { DesmosProfile } from "../../../types";
import {
  getApplicationIconSrc,
  getDisplayName,
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
  const profilePic = profile?.profilePicture || defaultProfilePic;
  const coverPicture = profile?.coverPicture || defaultCover;

  const coverStyle = {
    backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${coverPicture})`,
  };

  return (
    <div
      {...props}
      className={`bg-cover bg-center rounded-3xl relative ${props.className}`}
      style={coverStyle}
    >
      <div className="absolute bottom-8 left-8 flex flex-col md:flex-row">
        <img
          className="h-12 w-12 md:h-20 md:w-20 rounded-xl"
          src={profilePic}
          alt="Profile"
        />
        <div className="text-white text-left md:ml-4">
          <h2>{getDisplayName(profile)}</h2>
          <div className="flex flex-row">
            <img
              className="h-6"
              alt={`${application} icon`}
              src={getApplicationIconSrc(application)}
            />
            <p className="ml-2 my-auto">{username}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCover;
