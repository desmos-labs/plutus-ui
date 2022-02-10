import * as React from "react";
import {Profile} from "types/desmos";

type ProfileCoverProps = {
  application: string,
  username: string,
  profile: Profile
}

function ProfileCover(props: ProfileCoverProps & React.HTMLAttributes<HTMLDivElement>) {
  const profilePic = props.profile?.profilePicture || 'https://desmos.network/images/background-desktop.png';
  const coverPicture = props.profile?.coverPicture || 'https://desmos.network/images/background-desktop.png';

  const coverStyle = {
    backgroundImage: `url(${coverPicture})`,
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
        <img className="h-auto w-20 rounded-xl" src={profilePic} alt="Profile picture"/>
        <div className="text-left ml-4">
          <div className="text-white flex flex-row">
            <h2 className="text-3xl font-bold">
              {props.profile.nickname || props.profile.dTag || props.profile.address}
            </h2>
            {props.profile.nickname &&
              <h4 className="ml-2 mt-auto">(@{props.profile.dTag})</h4>
            }
          </div>
          <a className="text-xl font-bold opacity-70" target="_blank" href={fullLink}>
            {displayLink}
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProfileCover;