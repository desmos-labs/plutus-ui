import {ApolloClient, gql, InMemoryCache, NormalizedCacheObject} from "@apollo/client";
import {DesmosProfile} from "../types";

const GRAPHQL_ENDPOINT = process.env.REACT_APP_CHAIN_GRAPHQL_ENDPOINT as string;
const addressQuery = gql`
query Address($application: String, $username: String) {
  application_link(where: {application: {_ilike: $application}, username: {_ilike: $username}}) {
    profile {
      address
    }
    state
  }
}`

const profileQuery = gql`
query Profile($address: String) {
  profile(where: {address: {_eq: $address}}) {
    address
    dtag
    nickname
    cover_pic
    profile_pic
  }
}`

/**
 * Represents the client to be used when interacting with the GraphQL endpoint.
 */
class GraphQL {
  private static client?: ApolloClient<NormalizedCacheObject>;

  /**
   * Returns the ApolloClient instance initializing it if it has not yet been initialized.
   * @private
   */
  private static requireClient(): ApolloClient<NormalizedCacheObject> {
    if (!this.client) {
      this.client = new ApolloClient({
        uri: GRAPHQL_ENDPOINT,
        cache: new InMemoryCache()
      });
    }
    return this.client;
  }

  /**
   * Returns the list of Desmos profile addresses that are connected to the given application and username.
   */
  public static async getAddresses(application: string, username: string): Promise<string[] | undefined> {
    const client = this.requireClient();
    const res = await client.query({
      query: addressQuery,
      variables: {
        application: application,
        username: username,
      }
    })

    const links: { profile: { address: string }, state: string }[] = res.data.application_link;
    if (links.length == 0) {
      return undefined;
    }

    return links
      .filter((link) => link.state == 'APPLICATION_LINK_STATE_VERIFICATION_SUCCESS')
      .map((link) => link.profile.address);
  }

  /**
   * Tries getting the profile associated with the given address, if any.
   * @param desmosAddress {string}: Desmos address of the supposed owner of the profile.
   */
  public static async getProfile(desmosAddress: string): Promise<DesmosProfile> {
    const client = this.requireClient();
    const res = await client.query({
      query: profileQuery,
      variables: {
        address: desmosAddress,
      }
    })

    if (!res.data.profile.length) {
      return {address: desmosAddress};
    }

    const profile = res.data.profile[0];
    return {
      address: profile.address,
      dtag: profile.dtag,
      nickname: profile.nickname,
      coverPicture: profile.cover_pic,
      profilePicture: profile.profile_pic,
    }
  }
}

export default GraphQL;