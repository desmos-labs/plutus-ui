import {ApolloClient, gql, InMemoryCache, NormalizedCacheObject} from "@apollo/client";
import {DesmosAppLink, DesmosProfile} from "../types";

const GRAPHQL_ENDPOINT = process.env.REACT_APP_CHAIN_GRAPHQL_ENDPOINT as string;


const PROFILE_FIELDS = gql`
fragment ProfileFields on profile {
  address
  dtag
  nickname
  cover_pic
  profile_pic
}
`

const APPLICATION_LINK_FIELDS = gql`
  ${PROFILE_FIELDS}
  fragment ApplicationLinkFields on application_link {
    state
    application
    username
    profile {
      ...ProfileFields
    }
  }
`;

const applicationLinksByUsernameAndApplicationQuery = gql`
  ${APPLICATION_LINK_FIELDS}
  query Address($application: String, $username: String) {
    application_link(where: {
      application: {_ilike: $application}, 
      username: {_ilike: $username}
    }) {
      ...ApplicationLinkFields
    }
  }
`;

const applicationLinksByUsernameQuery = gql`
  ${APPLICATION_LINK_FIELDS}
  query ApplicationLinkByUsername($username: String, $limit: Int = 50) {
    application_link(
      where: {
        username: {_ilike: $username}, 
        state: {_eq: "APPLICATION_LINK_STATE_VERIFICATION_SUCCESS"}
      },
      limit: $limit
    ) {
      ...ApplicationLinkFields
    }
  }
`;


const profileByAddressQuery = gql`
  ${PROFILE_FIELDS}
  query Profile($address: String) {
    profile(where: {address: {_eq: $address}}) {
      ...ProfileFields
    }
  }
`;

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
    console.log(application, username)

    const client = this.requireClient();
    const res = await client.query({
      query: applicationLinksByUsernameAndApplicationQuery,
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

  private static mapProfile(profile: any): DesmosProfile {
    return {
      address: profile.address,
      dtag: profile.dtag,
      nickname: profile.nickname,
      coverPicture: profile.cover_pic,
      profilePicture: profile.profile_pic,
    }
  }

  /**
   * Tries getting the profile associated with the given address, if any.
   * @param desmosAddress {string}: Desmos address of the supposed owner of the profile.
   */
  public static async getProfile(desmosAddress: string): Promise<DesmosProfile> {
    const client = this.requireClient();
    const res = await client.query({
      query: profileByAddressQuery,
      variables: {
        address: desmosAddress,
      }
    })

    if (!res.data.profile.length) {
      return {address: desmosAddress};
    }

    return this.mapProfile(res.data.profile[0]);
  }

  private static mapAppLink(chainLink: any): DesmosAppLink {
    return {
      profile: this.mapProfile(chainLink.profile),
      username: chainLink.username,
      application: chainLink.application,
    }
  }

  /**
   * Searches inside the GraphQL for Desmos Profiles by either address of application links by username.
   * @param search {string}: Value that is going to be used to search by address or by application link username.
   * @param limit {number}: Number of results to be returned.
   */
  public static async search(search: string, limit: number = 100): Promise<DesmosAppLink[]> {
    const client = this.requireClient();

    const linksRes = await client.query({
      query: applicationLinksByUsernameQuery,
      variables: {
        username: `${search}%`,
        limit: limit,
      }
    })

    return linksRes.data.application_link
      .map((link: any) => this.mapAppLink(link));
  }
}

export default GraphQL;