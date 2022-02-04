import {CosmosBaseAccount, CosmosCoin, CosmosFee, Network} from 'desmosjs';

const LCD_ENDPOINT = process.env.REACT_APP_CHAIN_LCD_ENDPOINT as string;
const FEE_DENOM = process.env.REACT_APP_CHAIN_COIN_DENOM as string;
const DEFAULT_FEE_AMOUNT = process.env.REACT_APP_CHAIN_FEE_AMOUNT as string;

const network = new Network(LCD_ENDPOINT)

/**
 * Allows performing common operations on the chain.
 */
export class Chain {
  /**
   * Returns the id of the chain.
   */
  static async getID(): Promise<string | null> {
    const res = await fetch(`${LCD_ENDPOINT}/node_info`)
    if (!res.ok) {
      return null;
    }

    const body = await res.json();
    return body?.node_info?.network;
  }

  /**
   * Returns the default amount of fees to be used for a transaction.
   * TODO: Simulate the tx and get the real amount of gas. From there, get the gas price and compute the fees.
   */
  static getFee(payer: string): CosmosFee {
    return {
      amount: [{denom: FEE_DENOM, amount: DEFAULT_FEE_AMOUNT}],
      gasLimit: 200_000,
      payer: "",
      granter: payer
    };
  }

  static async getAccount(address: string): Promise<CosmosBaseAccount | false> {
    return network.getAccount(address);
  }
}