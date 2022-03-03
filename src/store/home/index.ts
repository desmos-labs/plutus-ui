import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";
import {DesmosAppLink} from "../../types";

export * from "./actions";

export enum SearchStep {
  INITIAL,
  LOADING,
  COMPLETED,
}

export interface SearchState {
  readonly search: string;
  readonly step: SearchStep;
  readonly searchResults: DesmosAppLink[];
}

export interface HomeState {
  readonly searchState: SearchState;
}

const initialState: HomeState = {
  searchState: {
    search: "",
    step: SearchStep.INITIAL,
    searchResults: [],
  }
}

// --- SLICE ---
const homeSlice = createSlice({
  name: 'tips',
  initialState: initialState,
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
    clearSearch(state, action: PayloadAction) {
      state.searchState = initialState.searchState;
    }
  }
})

// --- ACTIONS ---
export const {
  setSearchQuery,
  setSearchStep,
  setSearchResults,
  clearSearch,
} = homeSlice.actions;

// --- SELECTORS ---
export function getHomeState(state: RootState) {
  return state.home;
}

export function getSearchState(state: RootState) {
  return state.home.searchState;
}

export default homeSlice.reducer