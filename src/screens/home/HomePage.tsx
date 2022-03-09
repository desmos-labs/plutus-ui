import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { ReactComponent as HeroImage } from "../../assets/images/hero.svg";
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
    <div className="py-16 xl:flex xl:flex-row">
      <div>
        <h1 className="font-bold uppercase">Trustless Donations</h1>
        <p className="mt-1">
          Send tips on every supported{" "}
          <span className="font-bold">social network</span> without
          intermediary.
        </p>
        <p>
          Receive donations to see the corresponding amount in any currency
          instantly.
        </p>

        <div className="mt-5 w-max md:w-2/3">
          <SearchBar
            placeholder="Who would you like to donate to?"
            value={state.search}
            onSearchChange={handleSearchChange}
          />
          <ProfileSearchResults />
        </div>
      </div>

      <HeroImage />
    </div>
  );
}

export default HomePage;
