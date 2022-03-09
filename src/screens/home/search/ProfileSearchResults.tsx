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
    <div {...props} className="drop-shadow-xl bg-white rounded-xl mt-2">
      {state.searchResults.length === 0 && (
        <div className="p-2">
          <p className="font-bold">No results found</p>
          <p className="mt-1">
            Looks like this use has not yet created a Desmos Profile and
            connected it with their social accounts yet
          </p>
        </div>
      )}

      {state.searchResults.map((link) => {
        const isFirst = state.searchResults.indexOf(link) === 0;
        const isLast =
          state.searchResults.indexOf(link) === state.searchResults.length - 1;
        return (
          <ProfileSearchResultItem
            link={link}
            isFirst={isFirst}
            isLast={isLast}
          />
        );
      })}
    </div>
  );
}

export default ProfileSearchResults;
