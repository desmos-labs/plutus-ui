import {PageRequest} from "cosmjs-types/cosmos/base/query/v1beta1/pagination";
import {QueryClientImpl, QueryGrantsResponse} from "cosmjs-types/cosmos/authz/v1beta1/query";
import {createProtobufRpcClient, QueryClient, StargateClient} from "@cosmjs/stargate";
import {Tendermint34Client} from "@cosmjs/tendermint-rpc";
import {Grant} from "cosmjs-types/cosmos/authz/v1beta1/authz";

export interface AuthzExtension {
  readonly authz: {
    readonly grants: (
      granter: string,
      grantee: string,
      msgTypeUrl?: string,
      pagination?: PageRequest
    ) => Promise<Grant[] | undefined>;
  }
}

function setupAuthzExtension(base: QueryClient): AuthzExtension {
  const rpc = createProtobufRpcClient(base);
  // Use this service to get easy typed access to query methods
  // This cannot be used for proof verification
  const queryService = new QueryClientImpl(rpc);

  return {
    authz: {
      grants: async (granter: string, grantee: string, msgTypeUrl?: string, pagination?: PageRequest) => {
        try {
          const {grants} = await queryService.Grants({
            granter: granter,
            grantee: grantee,
            msgTypeUrl: msgTypeUrl || "",
            pagination: pagination,
          });
          return grants;
        } catch (e) {
          console.error(e);
          return undefined;
        }
      },
    },
  }
}

/**
 * Represents the client used to interact with the Desmos chain.
 */
export class DesmosClient extends StargateClient {
  public static async connect(endpoint: string): Promise<DesmosClient> {
    const tmClient = await Tendermint34Client.connect(endpoint);
    return new DesmosClient(tmClient);
  }

  protected constructor(client: Tendermint34Client) {
    super(client);
  }

  public getAuthzQueryClient(): (QueryClient & AuthzExtension) {
    return QueryClient.withExtensions(this.forceGetTmClient(), setupAuthzExtension);
  }
}