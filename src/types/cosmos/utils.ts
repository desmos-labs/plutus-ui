import {TxResult} from "cosmjs-types/tendermint/abci/types";
import {AuthInfo, SignDoc} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {setError} from "../../store/oauth";
import {Any} from "cosmjs-types/google/protobuf/any";
import {isSignDoc} from "./wallet";
import {serializeSignDoc} from "@cosmjs/amino";
import {SignatureResult} from "@desmoslabs/desmjs";

export interface SignatureData {
  readonly signedBytes: Uint8Array;
  readonly pubKeyBytes: Uint8Array;
  readonly signatureBytes: Uint8Array;
}

export function getSignatureData(result: SignatureResult): SignatureData | Error {
  // Get the auth bytes
  const authInfo = AuthInfo.decode(result.txRaw.authInfoBytes);
  const pubKey = authInfo.signerInfos[0].publicKey;
  if (!pubKey) {
    return new Error("Invalid returned public key")
  }
  const pubKeyBytes = Any.encode(pubKey).finish();

  // Get the signed bytes
  const signedBytes = isSignDoc(result.signDoc) ?
    SignDoc.encode(result.signDoc).finish() :
    serializeSignDoc(result.signDoc);

  // Get the signature bytes
  const signatureBytes = result.txRaw.signatures[0];

  return {
    signedBytes: signedBytes,
    pubKeyBytes: pubKeyBytes,
    signatureBytes: signatureBytes,
  }
}