import {Chain} from "types/crypto/chain";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import {AuthInfo, Fee, SignDoc, SignerInfo, TxBody, TxRaw} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {Any} from "cosmjs-types/google/protobuf/any";
import {SignMode} from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import Long from "long";
import {Account} from "@cosmjs/stargate";
import {sign} from "crypto";

const connector = new WalletConnect({
  bridge: 'https://bridge.walletconnect.org',
  qrcodeModal: QRCodeModal,
});

type WalletConnectSignResponse = {
  // Hex-encoded account number
  accountNumber: string;

  // Hex-encoded auth info bytes used during the signature
  authInfoBytes: string;

  // Hex-encoded body bytes used during the signature
  bodyBytes: string;

  // Plain text chain id
  chainId: string;

  // Hex-encoded signature
  signature: string;
}

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
  private static stringifySignDocValues(signDoc: SignDoc) {
    return {
      ...signDoc,
      bodyBytes: Buffer.from(signDoc.bodyBytes).toString('hex'),
      authInfoBytes: Buffer.from(signDoc.authInfoBytes).toString('hex'),
      accountNumber: signDoc.accountNumber.toString(16),
    };
  }

  /**
   * Parses the field values of the given object returning a `SignDoc` instance which values
   * are byte arrays instead of hex-encoded strings.
   */
  private static parseSignDocValues(signDoc: any): SignDoc {
    return {
      accountNumber: Long.fromString(signDoc.accountNumber, 16),
      authInfoBytes: Uint8Array.from(Buffer.from(signDoc.authInfoBytes, 'hex')),
      bodyBytes: Uint8Array.from(Buffer.from(signDoc.bodyBytes, 'hex')),
      chainId: signDoc.chainId,
    }
  }

  /**
   * Parses the given WalletConnectSignResponse and returns the contained SignDoc, public key and signature.
   * Returns an error if anything goes wrong.
   * @param response {WalletConnectSignResponse}: Response returned from WalletConnect upon signing a transaction.
   * @private
   */
  private static parseWalletConnectResponse(response: WalletConnectSignResponse): {
    signedSignDoc: SignDoc,
    publicKey: Any,
    signature: Uint8Array
  } | Error {
    // Parse the returned transaction
    const signedSignDoc = this.parseSignDocValues(response);

    // Get the public key used for signing
    const returnedAuthInfo = AuthInfo.decode(signedSignDoc.authInfoBytes);
    const publicKey = returnedAuthInfo.signerInfos[0].publicKey;
    if (!publicKey) {
      return new Error("Returned public key is null");
    }

    // Get the signature bytes
    const signatureBytes = Uint8Array.from(Buffer.from(response.signature, 'hex'))
    return {
      signedSignDoc: signedSignDoc,
      publicKey: publicKey,
      signature: signatureBytes,
    }
  }

  /**
   * Sends a WalletConnect request to sign the given request.
   * @param chainID {string}: ID of the chain for which the transaction is being signed.
   * @param account {Account}: Signer account.
   * @param authInfo {AuthInfo}: Authentication info used to sign the transaction.
   * @param transaction {TxBody}: Body of the transaction to be sent.
   * @private
   */
  private static async sendWalletConnectRequest(
    chainID: string,
    account: Account,
    authInfo: AuthInfo,
    transaction: TxBody,
  ): Promise<SignatureResult | Error> {
    try {
      // Build the WalletConnect params
      const authInfoBytes = AuthInfo.encode(authInfo).finish();
      const bodyBytes = TxBody.encode(transaction).finish();
      const signDoc: SignDoc = {
        bodyBytes: bodyBytes,
        accountNumber: Long.fromNumber(account.accountNumber),
        authInfoBytes: authInfoBytes,
        chainId: chainID,
      }

      const params = [{
        signerAddress: account.address,
        signDoc: this.stringifySignDocValues(signDoc),
      }];

      // Send the request to WalletConnect
      const response = await connector.sendCustomRequest({
        jsonrpc: "2.0",
        method: "cosmos_signDirect",
        params: params,
      }) as WalletConnectSignResponse;
      console.log(response);

      const parsedResponse = this.parseWalletConnectResponse(response);
      if (parsedResponse instanceof Error) {
        return parsedResponse;
      }

      // Build the signed tx raw
      const txRaw: TxRaw = {
        authInfoBytes: parsedResponse.signedSignDoc.authInfoBytes,
        bodyBytes: parsedResponse.signedSignDoc.bodyBytes,
        signatures: [parsedResponse.signature]
      }

      // Return the raw transaction data
      return {
        signDocBytes: SignDoc.encode(parsedResponse.signedSignDoc).finish(),
        pubKeyBytes: Any.encode(parsedResponse.publicKey).finish(),
        signatureBytes: parsedResponse.signature,
        signedTxBytes: TxRaw.encode(txRaw).finish(),
      };

    } catch (e) {
      console.log(e);
      return new Error("Request refused by the user");
    }
  }

  /**
   * Signs the given transaction using the signer address, and returns the signed transaction as the result.
   * If something goes wrong, returns `false` instead.
   * @param transaction {TxBody}: Body of the transaction to be signed.
   */
  static async signTransaction(transaction: TxBody): Promise<SignatureResult | Error> {
    // Get the chain id
    const chainID = await Chain.getID();

    // Get the signer address
    const signer = await this.getAddress();
    if (signer == null) {
      return new Error("Wallet is not connected");
    }

    // Get the signer account
    const account = await Chain.getAccount(signer);
    if (account == null) {
      return new Error(`Account ${signer} not found on chain`);
    }

    // Build the signer info
    const signerInfo: SignerInfo = {
      modeInfo: {single: {mode: SignMode.SIGN_MODE_DIRECT}},
      sequence: Long.fromNumber(account.sequence)
    };

    // Build the fee info
    const feeValue: Fee = Chain.getFee(signer);

    // Build the auth info
    const authInfo: AuthInfo = {
      signerInfos: [signerInfo],
      fee: feeValue
    };

    return this.sendWalletConnectRequest(chainID, account, authInfo, transaction)
  }
}