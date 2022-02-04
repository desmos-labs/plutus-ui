import {
  Any,
  CosmosAuthInfo, CosmosBaseAccount,
  CosmosFee, CosmosSignDoc,
  CosmosSignerInfo,
  CosmosSignMode,
  CosmosTxBody, CosmosTxRaw,
} from "desmosjs";
import {Chain} from "types/crypto/chain";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import {TransactionBody} from "types/crypto/cosmos";

const connector = new WalletConnect({
  bridge: 'https://bridge.walletconnect.org',
  qrcodeModal: QRCodeModal,
});

type SignatureResult = {
  // Value that has been signed
  signDocBytes: Uint8Array;

  // Public key associated to the private key used to sign the sign doc
  pubKeyBytes: Uint8Array;

  // Result of the signature
  signatureBytes: Uint8Array;

  // Complete transaction after being signed
  signedTxBytes: Uint8Array;
}

/**
 * Represents a generic wallet that allows to perform on-chain operations.
 */
export class UserWallet {

  /**
   * Returns whether the wallet is connected or not.
   */
  static isConnected(): boolean {
    return connector.connected;
  }

  /**
   * Starts the process that can lead to the connection of the wallet.
   */
  static createSession() {
    return connector.createSession();
  }

  /**
   * Sets the callback function to be called when the wallet is connected.
   */
  static setOnConnect(callback: (error: Error | null, address: string) => void) {
    connector.on('connected', (error, payload) => {
      if (error != null) {
        callback(error, '');
        return
      }

      const {accounts, chainId} = payload.params[0];
      const desmosAddress = accounts[chainId];
      callback(null, desmosAddress);
    })
  }

  /**
   * Sets the callback to be called when the session is updated.
   */
  static setOnSessionUpdate(callback: (error: Error | null, address: string) => void) {
    connector.on('session_update', (error, payload) => {
      if (error != null) {
        callback(error, '');
        return
      }

      const {accounts, chainId} = payload.params[0];
      const desmosAddress = accounts[chainId];
      callback(null, desmosAddress);
    })
  }

  /**
   * Sets the callback to be called when the user disconnects the wallet from the app.
   */
  static setOnDisconnect(callback: (error: Error | null) => void) {
    connector.on('disconnect', callback);
  }

  /**
   * Disconnects the wallet from the current session.
   */
  static disconnect() {
    connector.killSession();
  }

  /**
   * Returns the address associated with this account.
   */
  static getAddress(): string | null {
    if (!this.isConnected()) {
      return null
    }
    return connector.accounts[0];
  }

  /**
   * Converts the given `SignDoc` field values to string by hex-encoding them.
   */
  private static stringifySignDocValues(signDoc: CosmosSignDoc) {
    return {
      ...signDoc,
      bodyBytes: Buffer.from(signDoc.bodyBytes).toString('hex'),
      authInfoBytes: Buffer.from(signDoc.authInfoBytes).toString('hex'),
      accountNumber: Math.abs(signDoc.accountNumber).toString(16),
    };
  }

  /**
   * Parses the field values of the given object returning a `SignDoc` instance which values
   * are byte arrays instead of hex-encoded strings.
   */
  private static parseSignDocValues(signDoc: any) {
    return {
      ...signDoc,
      bodyBytes: Uint8Array.from(Buffer.from(signDoc.bodyBytes, 'hex')),
      authInfoBytes: Uint8Array.from(Buffer.from(signDoc.authInfoBytes, 'hex')),
      accountNumber: parseInt(signDoc.accountNumber, 16),
    };
  }

  /**
   * Sends a WalletConnect request to sign the given request.
   * @param chainID {string}: ID of the chain for which the transaction is being signed.
   * @param account {CosmosBaseAccount}: Signer account.
   * @param authInfo {CosmosAuthInfo}: Authentication info used to sign the transaction.
   * @param transaction {CosmosTxBody}: Body of the transaction to be sent.
   * @private
   */
  private static async sendWalletConnectRequest(
    chainID: string,
    account: CosmosBaseAccount,
    authInfo: CosmosAuthInfo,
    transaction: CosmosTxBody,
  ): Promise<SignatureResult | Error> {
    try {
      // Build the WalletConnect params
      const authInfoBytes = CosmosAuthInfo.encode(authInfo).finish();
      const bodyBytes = CosmosTxBody.encode(transaction).finish();
      const signDoc: CosmosSignDoc = {
        bodyBytes: bodyBytes,
        accountNumber: account.accountNumber,
        authInfoBytes: authInfoBytes,
        chainId: chainID,
      }

      const params = [{
        signerAddress: account.address,
        signDoc: this.stringifySignDocValues(signDoc),
      }];

      // Send the request to WalletConnect
      const signedTxRaw = await connector.sendCustomRequest({
        jsonrpc: "2.0",
        method: "cosmos_signDirect",
        params: params,
      });

      // Parse the returned transaction
      const signedTx = this.parseSignDocValues(signedTxRaw);
      const signatureBytes = Buffer.from(signedTx.signature, 'hex');

      // Build the raw transaction data from the returned value
      const txRaw = {
        bodyBytes: signedTx.bodyBytes,
        authInfoBytes: signedTx.authInfoBytes,
        signatures: [signatureBytes],
      } as CosmosTxRaw;

      const returnedAuthInfo = CosmosAuthInfo.decode(txRaw.authInfoBytes);
      const publicKey = returnedAuthInfo.signerInfos[0].publicKey;
      if (!publicKey) {
        return new Error("Returned public key is null");
      }

      // Return the raw transaction data
      return {
        signDocBytes: CosmosSignDoc.encode(signDoc).finish(),
        pubKeyBytes: Any.encode(publicKey).finish(),
        signatureBytes: signatureBytes,
        signedTxBytes: CosmosTxRaw.encode(txRaw).finish(),
      };

    } catch (e) {
      console.log(e);
      return new Error("Request refused by the user");
    }
  }

  /**
   * Signs the given transaction using the signer address, and returns the signed transaction as the result.
   * If something goes wrong, returns `false` instead.
   * @param transaction {CosmosTxBody}: Body of the transaction to be signed.
   */
  static async signTransaction(transaction: TransactionBody): Promise<SignatureResult | Error> {
    // Get the chain id
    const chainID = await Chain.getID();
    if (chainID == null) {
      return new Error("Chain id not found, cannot fetch from LCD");
    }

    // Get the signer address
    const signer = await this.getAddress();
    if (signer == null) {
      return new Error("Wallet is not connected");
    }

    // Get the signer account
    const account = await Chain.getAccount(signer);
    if (!account) {
      return new Error(`Account ${signer} not found on chain`);
    }

    // Build the signer info
    const signerInfo: CosmosSignerInfo = {
      modeInfo: {single: {mode: CosmosSignMode.SIGN_MODE_DIRECT}},
      sequence: account.sequence
    };

    // Build the fee info
    const feeValue: CosmosFee = Chain.getFee(signer);

    // Build the auth info
    const authInfo: CosmosAuthInfo = {
      signerInfos: [signerInfo],
      fee: feeValue
    };

    return this.sendWalletConnectRequest(chainID, account, authInfo, transaction)
  }
}