import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import SearchBar from "../../components/SearchBar";
import { getSearchState, searchProfiles } from "../../store/home";
import ProfileSearchResults from "./search/ProfileSearchResults";

/**
 * Represents the home page of the application.
 */
function HomePage() {
  const dispatch = useDispatch();
  const state = useSelector(getSearchState);

  const handleSearchChange = useCallback((search: string) => {
    dispatch(searchProfiles(search));
  }, []);

  return (
    <div className="py-16">
      <h1 className="font-bold">Trustless Donations</h1>
      <h2>on Twitch, Twitter and Reddit</h2>
      <p className="mt-3">
        DesmosTipBot allows you to send tips to every account on supported
        social networks without the need of any intermediary.
      </p>

      <div className="mt-5 w-2/3">
        <SearchBar
          placeholder="Who would you like to donate to?"
          value={state.search}
          onSearchChange={handleSearchChange}
        />
        <ProfileSearchResults />
      </div>

      <h3 className="text-orange mt-5">Instant DSM Donation Alerts</h3>
      <p>
        Receive DSM donations and see the corresponding amount in any currency
        instantly.
      </p>
    </div>
  );
}

export default HomePage;
