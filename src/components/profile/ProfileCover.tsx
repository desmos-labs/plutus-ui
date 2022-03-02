import * as React from "react";

import defaultProfilePic from 'assets/default-icon.svg';
import defaultCover from 'assets/default-cover.png';
import {DesmosProfile} from "../../types";
import {getDisplayName} from "../utils";

type ProfileCoverProps = {
  application: string,
  username: string,
  profile: DesmosProfile
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
      <div className="absolute bottom-8 left-8 flex flex-row">
        <img className="h-20 w-20 rounded-xl" src={profilePic} alt="Profile picture"/>
        <div className="text-white text-left ml-4">
          <div className="flex flex-row">
            <h2>{getDisplayName(props.profile)}</h2>

            {props.profile.nickname &&
              <h3 className="ml-2 my-auto">(@{props.profile.dtag})</h3>
            }
          </div>

          <h5>
            <a className="opacity-70" target="_blank" href={fullLink}>{displayLink}</a>
          </h5>
        </div>
      </div>
    </div>
  );
}

export default ProfileCover;