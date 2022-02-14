import Long from "long";
import {
  Account,
  DeliverTxResponse,
  StdFee
} from "@cosmjs/stargate";
import {Fee} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {DesmosClient} from "types/crypto/client";
import {SendAuthorization} from "cosmjs-types/cosmos/bank/v1beta1/authz";
import {Coin} from "cosmjs-types/cosmos/base/v1beta1/coin";

const EXPLORER_URL = process.env.REACT_APP_EXPLORER_ENDPOINT as string;

const LCD_ENDPOINT = process.env.REACT_APP_CHAIN_RPC_ENDPOINT as string;
const FEE_DENOM = process.env.REACT_APP_CHAIN_COIN_DENOM as string;
const DEFAULT_FEE_AMOUNT = process.env.REACT_APP_CHAIN_FEE_AMOUNT as string;

/**
 * Returns the explorer link to the transaction having the given hash.
 * @param txHash {string | undefined}: Hash of the transaction.
 */
export function getTxLink(txHash: string | undefined): string {
  return `${EXPLORER_URL}/transactions/${txHash || ''}`;
}

/**
 * Allows performing common operations on the chain.
 */
export class Chain {
  private static _client?: DesmosClient;

  private static async requireClient(): Promise<DesmosClient> {
    if (!this._client) {
      this._client = await DesmosClient.connect(LCD_ENDPOINT);
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
   * Returns the fee denom to be used inside transactions.
   */
  static getFeeDenom(): string {
    return FEE_DENOM;
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

  static getStdFee(): StdFee {
    return {
      amount: [{denom: FEE_DENOM, amount: DEFAULT_FEE_AMOUNT}],
      gas: '200000',
    };
  }

  /**
   * Broadcasts the given transaction bytes.
   * @param txBytes {Uint8Array}: Signed transaction bytes.
   */
  static async broadcastTx(txBytes: Uint8Array): Promise<DeliverTxResponse> {
    const client = await this.requireClient();
    return client.broadcastTx(txBytes)
  }

  /**
   * Tries getting the account associated with the given Desmos address.
   * @param address {string}: Address of the account owner.
   */
  static async getAccount(address: string): Promise<Account | null> {
    const client = await this.requireClient();
    return client.getAccount(address)
  }

  /**
   * Get the amount granted from the granter to the grantee.
   * @param granter {string}: Address of the user that granted a SendAuthorization.
   * @param grantee {string}: Address of the user who has been granted a SendAuthorization.
   */
  static async getGrantAmount(granter: string, grantee: string): Promise<Coin[] | undefined> {
    const client = await this.requireClient();
    const grants = await client.getGrants(granter, grantee);
    if (!grants) {
      return undefined;
    }

    const grant = grants.find(grant => grant.authorization?.typeUrl == '/cosmos.bank.v1beta1.SendAuthorization');
    const authorization = grant?.authorization;
    if (!authorization) {
      return undefined;
    }

    const sendAuth = SendAuthorization.decode(authorization.value);
    return sendAuth.spendLimit.length ? sendAuth.spendLimit : undefined;
  }
}