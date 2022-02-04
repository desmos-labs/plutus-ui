import {CosmosMsgSend, CosmosTxBody, CosmosTxRaw} from "desmosjs";

/**
 * Aliases types used to mask the implementations and easily change them if needed.
 * TODO: Migrate to use CosmJS when possible
 */

export type TransactionBody = CosmosTxBody
export type SignedTransaction = CosmosTxRaw
export const MsgSend = CosmosMsgSend