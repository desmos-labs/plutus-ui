import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { DesmosAppLink } from "../../../types";
import {
  getApplicationIconSrc,
  getDTag,
  getShortAddress,
  isAppSupported,
} from "../../../components/utils";
import { clearSearch } from "../../../store/home";

interface ProfileSearchResultItemProps {
  isFirst: boolean;
  isLast: boolean;
  link: DesmosAppLink;
}

/**
 * Represents the component to render a single application link search result.
 */
function ProfileSearchResultItem({
  isFirst,
  isLast,
  link,
}: ProfileSearchResultItemProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // If the app is not supported, return null
  if (!isAppSupported(link.application)) {
    return null;
  }

  const handleClickExample = useCallback(() => {
    dispatch(clearSearch());
    navigate(
      `/donate/${link.application}/${encodeURIComponent(link.username)}`,
      { replace: false }
    );
  }, []);

  let rounded;
  if (isFirst) {
    rounded = "rounded-t-lg";
  } else if (isLast) {
    rounded = "rounded-b-lg";
  }

  return (
    <button
      type="button"
      key={link.profile.address}
      onClick={handleClickExample}
      className={`flex flex-row hover:bg-ultra-light-gray px-3 py-2 w-full text-left ${rounded}`}
    >
      <img
        className="h-[40px] w-[40px] my-auto"
        src={getApplicationIconSrc(link.application)}
        alt="Application icon"
      />
      <div className="ml-2 w-full">
        <div className="flex flex-row">
          <p className="text font-medium">{link.username}</p>
          <p className="text-sm text-light-gray flex-grow text-right pt-1">
            {getShortAddress(link.profile)}
          </p>
        </div>
        <p className="text-sm text-light-gray">{getDTag(link.profile)}</p>
      </div>
    </button>
  );
}

export default ProfileSearchResultItem;
