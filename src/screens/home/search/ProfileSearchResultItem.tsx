import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { DesmosAppLink } from "../../../types";
import {
  getApplicationIconSrc,
  getDisplayName,
  getShortAddress,
  isAppSupported,
} from "../../../components/utils";
import { clearSearch } from "../../../store/home";

interface ProfileSearchResultItemProps {
  link: DesmosAppLink;
}

/**
 * Represents the component to render a single application link search result.
 */
function ProfileSearchResultItem({ link }: ProfileSearchResultItemProps) {
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

  return (
    <button
      type="button"
      key={link.profile.address}
      onClick={handleClickExample}
      className="flex flex-row hover:bg-primary-light rounded-md p-2 w-full text-left"
    >
      <img
        className="h-11 my-auto"
        src={getApplicationIconSrc(link.application)}
        alt="Application icon"
      />
      <div className="ml-2">
        <p>{link.username}</p>
        <div className="flex flex-col md:flex-row">
          <p>{getDisplayName(link.profile)}</p>
          <p className="m-0 md:ml-1 text-sm">
            ({getShortAddress(link.profile)})
          </p>
        </div>
      </div>
    </button>
  );
}

export default ProfileSearchResultItem;
