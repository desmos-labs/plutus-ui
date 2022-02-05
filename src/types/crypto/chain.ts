import Long from "long";
import {Account, StargateClient, StdFee} from "@cosmjs/stargate";
import {Fee} from "cosmjs-types/cosmos/tx/v1beta1/tx";

const LCD_ENDPOINT = process.env.REACT_APP_CHAIN_LCD_ENDPOINT as string;
const FEE_DENOM = process.env.REACT_APP_CHAIN_COIN_DENOM as string;
const DEFAULT_FEE_AMOUNT = process.env.REACT_APP_CHAIN_FEE_AMOUNT as string;

/**
 * Allows performing common operations on the chain.
 */
export class Chain {
  private static _client?: StargateClient;

  private static async requireClient(): Promise<StargateClient> {
    if (!this._client) {
      this._client = await StargateClient.connect(LCD_ENDPOINT);
    }
    return this._client;
  }


  /**
   * Returns the id of the chain.
   */
  static async getID(): Promise<string> {
    const client = await this.requireClient();
    return client.getChainId();
  }

  /**
   * Returns the default amount of fees to be used for a transaction.
   * TODO: Simulate the tx and get the real amount of gas. From there, get the gas price and compute the fees.
   */
  static getFee(payer: string): Fee {
    return {
      amount: [{denom: FEE_DENOM, amount: DEFAULT_FEE_AMOUNT}],
      gasLimit: Long.fromNumber(200_000),
      payer: "",
      granter: payer
    };
  }

  static getStdFee(payer: string): StdFee {
    return {
      amount: [{denom: FEE_DENOM, amount: DEFAULT_FEE_AMOUNT}],
      gas: '200000',
    };
  }

  static async getAccount(address: string): Promise<Account | null> {
    const client = await this.requireClient();
    return client.getAccount(address);
  }
}