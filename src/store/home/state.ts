import { DesmosAppLink } from "../../types";

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
