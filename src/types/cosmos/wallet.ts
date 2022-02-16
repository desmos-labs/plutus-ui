import {Chain} from "types/cosmos/chain";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import {DeliverTxResponse, StdFee} from "@cosmjs/stargate";
import {EncodeObject} from "@cosmjs/proto-signing";
import {Signer, SigningMode, WalletConnectSigner, SignerObserver, SignatureResult} from "@desmoslabs/desmjs";
import {ChainClient} from "types/cosmos/client";
import {SignDoc, TxRaw} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {AccountData, StdSignDoc} from "@cosmjs/amino";

const RPC_ENDPOINT = process.env.REACT_APP_CHAIN_RPC_ENDPOINT as string;

export function isSignDoc(value: StdSignDoc | SignDoc): value is SignDoc {
  return (<SignDoc>value).bodyBytes !== undefined &&
    (<SignDoc>value).authInfoBytes !== undefined &&
    (<SignDoc>value).chainId !== undefined &&
    (<SignDoc>value).accountNumber !== undefined
}

export function isStdSignDoc(value: StdSignDoc | SignDoc): value is StdSignDoc {
  return (<StdSignDoc>value).memo !== undefined &&
    (<StdSignDoc>value).msgs !== undefined &&
    (<StdSignDoc>value).fee !== undefined &&
    (<StdSignDoc>value).account_number !== undefined &&
    (<StdSignDoc>value).chain_id !== undefined &&
    (<StdSignDoc>value).account_number !== undefined;
}

export type TxOptions = {
  memo?: string
}

/**
 * Represents a generic wallet that allows to perform on-chain operations.
 */
export class UserWallet {
  private static connector = new WalletConnect({
    bridge: 'https://bridge.walletconnect.org',
    qrcodeModal: QRCodeModal,
  });

  // @ts-ignore
  private static signer: Signer = new WalletConnectSigner(this.connector, {
    signingMode: SigningMode.AMINO,
  });

  private static client?: ChainClient;

  /**
   * Returns a non null ChainClient, creating it if required.
   * @private
   */
  private static async requireClient(): Promise<ChainClient> {
    if (!this.client) {
      this.client = await ChainClient.withSigner(RPC_ENDPOINT, this.signer);
    }
    return this.client!
  }

  /**
   * Adds a status observer.
   * @param observer {SignerObserver}: Observer for the signer status.
   */
  public static addStatusObserver(observer: SignerObserver) {
    this.signer.addStatusListener(observer)
  }

  /**
   * Checks if the wallet is connected.
   */
  public static isConnected(): boolean {
    return this.signer.isConnected;
  }

  /**
   * Connects the wallet.
   */
  public static async connect(): Promise<Error | undefined> {
    try {
      await this.signer.connect();
    } catch (e: any) {
      return new Error(e.message);
    }
  }

  /**
   * Disconnects the current wallet session.
   */
  public static disconnect() {
    this.signer.disconnect();
  }

  /**
   * Returns the currently used account.
   */
  public static async getAccount(): Promise<AccountData | undefined> {
    const accounts = await this.signer.getAccounts();
    if (!accounts) {
      return undefined;
    }
    return accounts[0];
  }

  /**
   * Signs the transaction with the specified data.
   * @param sender {string}: Address of the transaction sender.
   * @param messages {EncodeObject[]}: List of messages to be included inside the transaction.
   * @param options {TxOptions | undefined}: Options for the transaction.
   */
  static async signTransaction(sender: string, messages: EncodeObject[], options?: TxOptions): Promise<SignatureResult | Error> {
    try {
      // Get the client
      const client = await this.requireClient();

      // Build the fee info
      const feeValue: StdFee = Chain.getStdFee(200_000);

      // Sign the transaction
      return await client.signTx(sender, messages, feeValue, options?.memo || '')
    } catch (e: any) {
      return new Error(e.message);
    }
  }

  /**
   * Broadcasts the given transaction bytes.
   * @param tx {TxRaw}: Signed transaction bytes.
   */
  static async broadcastTx(tx: TxRaw): Promise<DeliverTxResponse> {
    const client = await this.requireClient();
    return client.broadcastTx(TxRaw.encode(tx).finish())
  }
}