export enum TipsStep {
  HIDDEN,
  INPUT_DATA,
  CONFIRMATION_REQUIRED,
  SUCCESS,
  ERROR,
}

export type TipsState = {
  step: TipsStep;
  grantDenom: string;
  grantAmount: string;
  txHash?: string;
  error?: string;
};
