import Long from "long";
import {
  Account,
  DeliverTxResponse, GasPrice,
  StdFee
} from "@cosmjs/stargate";
import {Fee} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {DesmosClient} from "types/cosmos/client";
import {SendAuthorization} from "cosmjs-types/cosmos/bank/v1beta1/authz";
import {Coin} from "cosmjs-types/cosmos/base/v1beta1/coin";
import {Uint64} from "@cosmjs/math";

const EXPLORER_URL = process.env.REACT_APP_CHAIN_EXPLORER_ENDPOINT as string;

const RPC_ENDPOINT = process.env.REACT_APP_CHAIN_RPC_ENDPOINT as string;
const GAS_PRICE = process.env.REACT_APP_CHAIN_GAS_PRICE as string;

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
      this._client = await DesmosClient.connect(RPC_ENDPOINT);
    }
    return this._client;
  }

  /**
   * Returns the id of the chain.
   */
  public static async getID(): Promise<string> {
    const client = await this.requireClient();
    return client.getChainId();
  }

  private static computeFeeAmount(gasAmount: number): Coin {
    const gasPrice = GasPrice.fromString(GAS_PRICE);
    const amount = Math.round(gasPrice.amount.multiply(Uint64.fromNumber(gasAmount)).toFloatApproximation()).toString();
    return {amount: amount, denom: gasPrice.denom}
  }

  /**
   * Returns the fee denom to be used inside transactions.
   */
  static getFeeDenom(): string {
    const gasPrice = GasPrice.fromString(GAS_PRICE);
    return gasPrice.denom;
  }

  /**
   * Returns the default amount of fees to be used for a transaction.
   */
  static getFee(gasAmount: number, payer: string): Fee {
    return {
      amount: [this.computeFeeAmount(gasAmount)],
      gasLimit: Long.fromNumber(gasAmount),
      payer: "",
      granter: payer
    };
  }

  static getStdFee(gasAmount: number): StdFee {
    return {
      amount: [this.computeFeeAmount(gasAmount)],
      gas: gasAmount.toString(),
    }
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