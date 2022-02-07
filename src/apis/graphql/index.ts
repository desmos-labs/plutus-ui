import {ApolloClient, gql, InMemoryCache, NormalizedCacheObject} from "@apollo/client";

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT as string;
const addressQuery = gql`
query Address($application: String, $username: String) {
  application_link(where: {application: {_ilike: $application}, username: {_ilike: $username}}) {
    profile {
      address
    }
    state
  }
}`

class GraphQL {
  private static client?: ApolloClient<NormalizedCacheObject>;

  private static requireClient(): ApolloClient<NormalizedCacheObject> {
    if (!this.client) {
      this.client = new ApolloClient({
        uri: GRAPHQL_ENDPOINT,
        cache: new InMemoryCache()
      });
    }
    return this.client;
  }

  public static async getAddresses(platform: string, username: string): Promise<string[] | null> {
    const client = this.requireClient();
    const res = await client.query({
      query: addressQuery,
      variables: {
        application: platform,
        username: username,
      }
    })

    const links: { profile: { address: string }, state: string }[] = res.data.application_link;
    return links
      .filter((link) => link.state == 'APPLICATION_LINK_STATE_VERIFICATION_SUCCESS')
      .map((link) => link.profile.address);
  }
}

export default GraphQL;