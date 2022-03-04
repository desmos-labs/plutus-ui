import { Platform } from "../../types";

export enum IntegrationPopupStep {
  NOTHING,
  CONFIRMATION_REQUESTED,
  TX_REQUEST_SENT,
  DISCONNECTING,
  ERROR,
  DISCONNECTED,
}

export type IntegrationPopupState = {
  step: IntegrationPopupStep;
  platform: Platform;
  error?: string;
};
