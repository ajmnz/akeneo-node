export type ClientConfig = {
  /**
   * Connector auth details
   */
  auth: {
    username: string;
    password: string;
    clientId: string;
    clientSecret: string;
  };

  /**
   * PIM API base URL
   * ex. https://example.com
   */
  apiBaseUrl: string;

  debug?: boolean;
};
