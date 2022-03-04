import {AppThunk} from "../index";
import {SearchStep, setSearchQuery, setSearchResults, setSearchStep} from "./index";
import GraphQL from "../../apis/graphql";

/**
 * Allows searching for profiles using the provided search string.
 * The profiles are searched either by address of by any associated app link using the search
 * term as the application username.
 * @param search
 * @constructor
 */
export function searchProfiles(search: string): AppThunk {
  return async dispatch => {
    dispatch(setSearchQuery(search));
    if (search.trim().length == 0) {
      dispatch(setSearchStep(SearchStep.INITIAL));
      return;
    }

    // Search the data
    dispatch(setSearchStep(SearchStep.LOADING));
    const results = await GraphQL.search(search, 5);
    dispatch(setSearchStep(SearchStep.COMPLETED));
    dispatch(setSearchResults(results));
  }
}