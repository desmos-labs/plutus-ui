import React from "react";
import { useSelector } from "react-redux";
import { getSearchState, SearchStep } from "../../../store/home";
import ProfileSearchResultItem from "./ProfileSearchResultItem";

/**
 * Represents the component that is used to list all the search results.
 */
function ProfileSearchResults({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const state = useSelector(getSearchState);

  if (state.step !== SearchStep.COMPLETED) {
    return null;
  }

  return (
    <div
      {...props}
      className="drop-shadow-2xl bg-white rounded-md absolute w-2/3 mt-2 p-2"
    >
      {state.searchResults.length === 0 && (
        <div className="p-2">
          <p className="font-bold">No results found</p>
          <p className="mt-1">
            Looks like this use has not yet created a Desmos Profile and
            connected it with their social accounts yet
          </p>
        </div>
      )}

      {state.searchResults.map((link) => (
        <ProfileSearchResultItem link={link} />
      ))}
    </div>
  );
}

export default ProfileSearchResults;
