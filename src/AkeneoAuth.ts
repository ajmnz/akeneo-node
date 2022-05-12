import axios, { AxiosResponse } from "axios";
import { ClientConfig } from "./types/client";
import { AuthResponse } from "./types/response";

export class AkeneoAuth {
  /**
   * The client config
   */
  private config: ClientConfig;

  /**
   * The base64 encoded client id & secret
   */
  private authHeader: string;

  /**
   * The access-refresh token pair
   */
  private tokens: {
    access: { value: string; expires: number } | null;
    refresh: { value: string } | null;
  } | null;

  constructor(config: ClientConfig) {
    this.config = config;
    this.authHeader = this.getAuthorizationHeader();
    this.tokens = null;
  }

  /**
   * Base64 encode the client id and secret
   * for use in the Authorization header
   */
  private getAuthorizationHeader() {
    return Buffer.from(
      `${this.config.auth.clientId}:${this.config.auth.clientSecret}`,
      "utf-8"
    ).toString("base64");
  }

  /**
   * Obtain a new access and refresh token pair
   * either by using the password or refresh_token grant types
   */
  private async getAuthTokens(isRefresh = false): Promise<AuthResponse> {
    const data = isRefresh
      ? {
          grant_type: "refresh_token",
          refresh_token: this.tokens?.refresh,
        }
      : {
          grant_type: "password",
          username: this.config.auth.username,
          password: this.config.auth.password,
        };

    // Request token pair

    try {
      const response: AxiosResponse<AuthResponse> = await axios(
        `${this.config.apiBaseUrl}/oauth/v1/token`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${this.authHeader}`,
            "Content-Type": "application/json",
          },
          data,
        }
      );

      return response.data;
    } catch (error: any) {
      if (isRefresh) {
        // Try to get the tokens again by using the password grant type
        return this.getAuthTokens();
      }

      throw error;
    }
  }

  /**
   * Store auth tokens
   */
  private setTokens(authResponse: AuthResponse) {
    if (!authResponse) {
      return {
        access: this.tokens!.access!,
        refresh: this.tokens!.refresh!,
      };
    }

    const { access_token, expires_in, refresh_token } = authResponse;

    // Attempt to refresh it early by setting its expiry time 10 minutes earlier

    const accessExpires = Date.now() + (expires_in - 600) * 1000;

    const tokens = {
      access: {
        value: access_token,
        expires: accessExpires,
      },
      refresh: {
        value: refresh_token,
      },
    };

    this.tokens = tokens;
    return tokens;
  }

  /**
   * Check if a token is expired
   */
  private isTokenExpired(token: { value: string; expires: number }) {
    return Date.now() > token.expires;
  }

  /**
   * Check if we're still able to make authenticated requests
   * or if we need to re-authenticate, and do so if needed.
   */
  private async ensureAuthenticated() {
    let authRes: AuthResponse | null = null;

    if (!this.tokens || !this.tokens.access || !this.tokens.refresh) {
      authRes = await this.getAuthTokens();
    } else if (this.isTokenExpired(this.tokens.access)) {
      this.tokens.access = null;

      authRes = await this.getAuthTokens(true);
    }

    return this.setTokens(authRes!);
  }

  /**
   * Get axios auth parameters
   */
  public async getAxiosAuth() {
    const tokens = await this.ensureAuthenticated();

    return {
      Authorization: `Bearer ${tokens.access.value}`,
    };
  }
}
