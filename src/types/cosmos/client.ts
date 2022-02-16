import {Tendermint34Client} from "@cosmjs/tendermint-rpc";
import {Grant} from "cosmjs-types/cosmos/authz/v1beta1/authz";
import {DesmosClient, Signer} from "@desmoslabs/desmjs";

/**
 * Represents the client used to interact with the Desmos chain.
 */
export class ChainClient extends DesmosClient {
  public static async connect(endpoint: string): Promise<ChainClient> {
    const tmClient = await Tendermint34Client.connect(endpoint);
    return new ChainClient(tmClient);
  }

  public static async withSigner(endpoint: string, signer: Signer): Promise<ChainClient> {
    const tmClient = await Tendermint34Client.connect(endpoint);
    return new ChainClient(tmClient, signer);
  }

  protected constructor(client: Tendermint34Client, signer?: Signer) {
    super(client, signer);
  }

  public async getGrants(granter: string, grantee: string): Promise<Grant[] | undefined> {
    const authzClient = this.getQueryClient();
    return authzClient?.authz.grants(granter, grantee);
  }
}