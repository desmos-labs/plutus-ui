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
    <div className="xl:flex xl:flex-row">
      <h1 className="font-extrabold md:uppercase">Trustless Donations</h1>
      <p className="mt-2">
        Send tips on every supported{" "}
        <span className="font-bold">social network</span> without intermediary.
      </p>
      <p>
        Receive donations to see the corresponding amount in any currency
        instantly.
      </p>

      <div className="mt-6 md:w-2/3 lg:w-2/5 xl:w-1/5">
        <SearchBar
          placeholder="Who would you like to donate to?"
          value={state.search}
          onSearchChange={handleSearchChange}
        />
        <ProfileSearchResults />
      </div>
    </div>
  );
}

export default HomePage;
