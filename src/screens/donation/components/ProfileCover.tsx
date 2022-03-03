import * as React from "react";

import defaultProfilePic from 'assets/default-icon.svg';
import defaultCover from 'assets/default-cover.png';
import {DesmosProfile} from "../../../types";
import {getApplicationIconSrc, getDisplayName} from "../../../components/utils";

type ProfileCoverProps = React.HTMLAttributes<HTMLDivElement> & {
  application: string,
  username: string,
  profile: DesmosProfile
}

function ProfileCover({application, username, profile, ...props}: ProfileCoverProps) {
  const profilePic = profile?.profilePicture || defaultProfilePic;
  const coverPicture = profile?.coverPicture || defaultCover;

  const coverStyle = {
    backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${coverPicture})`,
  }

  return (
    <div
      {...props}
      className={`bg-cover bg-center rounded-3xl relative ${props.className}`}
      style={coverStyle}>
      <div className="absolute bottom-8 left-8 flex flex-row">
        <img className="h-20 w-20 rounded-xl" src={profilePic} alt="Profile picture"/>
        <div className="text-white text-left ml-4 inline-block">
          <h2>{getDisplayName(profile)}</h2>
          <div className="flex flex-row">
            <img
              className="h-8"
              alt={`${application} icon`}
              src={getApplicationIconSrc(application)}
            />
            <h3 className="ml-2">{username}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCover;