import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState, AppThunk } from "../index";
import { DesmosAppLink } from "../../types";
import { HomeState, SearchStep } from "./state";
import { GraphQL } from "../../apis/graphql";

export * from "./state";

const initialState: HomeState = {
  searchState: {
    search: "",
    step: SearchStep.INITIAL,
    searchResults: [],
  },
};

// --- SLICE ---
const homeSlice = createSlice({
  name: "tips",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchState.search = action.payload;
    },
    setSearchStep(state, action: PayloadAction<SearchStep>) {
      state.searchState.step = action.payload;
    },
    setSearchResults(state, action: PayloadAction<DesmosAppLink[]>) {
      state.searchState.searchResults = action.payload;
    },
    clearSearch(state) {
      state.searchState = initialState.searchState;
    },
  },
});

// --- ACTIONS ---
const { setSearchQuery, setSearchStep, setSearchResults } = homeSlice.actions;
export const { clearSearch } = homeSlice.actions;

/**
 * Allows searching for profiles using the provided search string.
 * The profiles are searched either by address of by any associated app link using the search
 * term as the application username.
 * @param search
 * @constructor
 */
export function searchProfiles(search: string): AppThunk {
  return async (dispatch) => {
    dispatch(setSearchQuery(search));
    if (search.trim().length === 0) {
      dispatch(setSearchStep(SearchStep.INITIAL));
      return;
    }

    // Search the data
    dispatch(setSearchStep(SearchStep.LOADING));
    const results = await GraphQL.search(search, 5);
    dispatch(setSearchStep(SearchStep.COMPLETED));
    dispatch(setSearchResults(results));
  };
}

// --- SELECTORS ---
export function getHomeState(state: RootState) {
  return state.home;
}

export function getSearchState(state: RootState) {
  return state.home.searchState;
}

export default homeSlice.reducer;
