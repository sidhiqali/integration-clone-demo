export type OAuth2Options = {
  integrationName: string;
  clientID: string;
  clientSecret: string;
  authorizationURL: string;
  tokenURL: string;
  callbackURL: string;
  scope: string | string[];
  response_type?: string;
};
export interface basicAuth {
  username: string;
  password: string;
}
