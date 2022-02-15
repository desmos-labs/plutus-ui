import {PageRequest} from "cosmjs-types/cosmos/base/query/v1beta1/pagination";
import {QueryClientImpl} from "cosmjs-types/cosmos/authz/v1beta1/query";
import {Account, accountFromAny, createProtobufRpcClient, QueryClient, StargateClient} from "@cosmjs/stargate";
import {Tendermint34Client} from "@cosmjs/tendermint-rpc";
import {Grant} from "cosmjs-types/cosmos/authz/v1beta1/authz";
import {Profile} from "@desmoslabs/proto/desmos/profiles/v1beta1/models_profile";
import {Any} from "cosmjs-types/google/protobuf/any";
import {assert} from "@cosmjs/utils";

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

function profileFromAny(input: Any): Account {
  const {typeUrl, value} = input;
  switch (typeUrl) {
    case "/desmos.profiles.v1beta1.Profile":
      const baseAccount = Profile.decode(value)?.account;
      assert(baseAccount);
      return accountFromAny(baseAccount);

    default:
      return accountFromAny(input);
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

  override async getAccount(searchAddress: string): Promise<Account | null> {
    const account = await this.forceGetQueryClient().auth.account(searchAddress);
    return account ? profileFromAny(account) : null;
  }

  protected getAuthzQueryClient(): (QueryClient & AuthzExtension) {
    return QueryClient.withExtensions(this.forceGetTmClient(), setupAuthzExtension);
  }

  public async getGrants(granter: string, grantee: string): Promise<Grant[] | undefined> {
    const authzClient = this.getAuthzQueryClient();
    return await authzClient.authz.grants(granter, grantee);
  }
}