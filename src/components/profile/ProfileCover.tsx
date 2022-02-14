import * as React from "react";
import {getDisplayName, Profile} from "types/desmos";

import defaultProfilePic from 'assets/default-icon.svg';
import defaultCover from 'assets/default-cover.png';

type ProfileCoverProps = {
  application: string,
  username: string,
  profile: Profile
}

function ProfileCover(props: ProfileCoverProps & React.HTMLAttributes<HTMLDivElement>) {
  const profilePic = props.profile?.profilePicture || defaultProfilePic;
  const coverPicture = props.profile?.coverPicture || defaultCover;

  const coverStyle = {
    backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${coverPicture})`,
  }

  function getLink(application: string, username: string): string {
    switch (application.toLowerCase()) {
      case "twitch":
        return `https://twitch.tv/${username}`
      case "twitter":
        return `https://twitter.com/${username}`
      default:
        return username
    }
  }

  const fullLink = getLink(props.application, props.username);
  const displayLink = fullLink.replace("https://", "");

  return (
    <div className={`bg-cover bg-center rounded-3xl relative ${props.className}`} style={coverStyle}>
      <div className="absolute bottom-5 left-5 flex flex-row">
        <img className="h-16 w-16 rounded-xl" src={profilePic} alt="Profile picture"/>
        <div className="text-white text-left ml-4">
          <div className="flex flex-row">
            <h2 className="text-3xl font-bold">{getDisplayName(props.profile)}</h2>

            {props.profile.nickname &&
              <h4 className="ml-2 mt-auto">(@{props.profile.dTag})</h4>
            }
          </div>

          <a className="text-lg font-bold opacity-70" target="_blank" href={fullLink}>
            {displayLink}
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProfileCover;