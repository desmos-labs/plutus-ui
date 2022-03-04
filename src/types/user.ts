import {Coin} from "cosmjs-types/cosmos/base/v1beta1/coin";
import {Platform} from "./oauth";
import {DesmosProfile} from "./desmos";

export interface UserData {
  /**
   * Desmos profile associated with the user.
   */
  readonly profile: DesmosProfile;

  /**
   * Amount granted to the bot that is left for the social tips.
   */
  readonly grantedAmount: Coin[];

  /**
   * List of integrations the user has enabled.
   */
  readonly enabledIntegrations: Platform[];
}