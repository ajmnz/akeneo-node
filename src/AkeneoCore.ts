import axios, {
  Method as AxiosMethod,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { AkeneoAuth } from "./AkeneoAuth";
import { AkeneoCollection, ClientConfig, Endpoints } from "./types";

/**
 * The core of the Akeneo client, where all logic resides. Takes care
 * of delegating auth to the AkeneoAuth class and handling the
 * type-safety of all requests. Also implements some utility methods
 * for working with collections.
 *
 * @see https://api.akeneo.com
 */
export class AkeneoCore {
  /**
   * The client config
   */
  private config: ClientConfig;

  /**
   * Akeneo Auth handler
   */
  private auth: AkeneoAuth;

  /**
   * Class initializer
   *
   * @param config - The client configuration
   */
  constructor(config: ClientConfig) {
    this.config = config;
    this.auth = new AkeneoAuth(config);
  }

  /**
   * Allows calling the Akeneo REST API in a type-safe manner with
   * typed request parameters and responses. Note that no transformations
   * are made if methods are called with this function, so it is recommended
   * to use the named methods when possible.
   *
   * @param apiPath - Path of the endpoint
   * @param method - HTTP Method
   * @param data - Body, query params, etc
   * @param axiosConfig - Extra Axios configuration params
   */
  public async request<
    Path extends keyof Endpoints,
    Method extends keyof Endpoints[Path],
    Data extends Extract<Endpoints[Path][Method], { body: any }>["body"],
    Response extends Extract<
      Endpoints[Path][Method],
      { response: any }
    >["response"]
  >(
    apiPath: Path,
    method: Method,
    data: Data & { realUrl?: string; baseUrl?: string; raw: true },
    axiosConfig?: AxiosRequestConfig
  ): Promise<AxiosResponse<Response>>;
  public async request<
    Path extends keyof Endpoints,
    Method extends keyof Endpoints[Path],
    Data extends Extract<Endpoints[Path][Method], { body: any }>["body"],
    Response extends Extract<
      Endpoints[Path][Method],
      { response: any }
    >["response"]
  >(
    apiPath: Path,
    method: Method,
    data: Data & { realUrl?: string; baseUrl?: string; raw?: undefined },
    axiosConfig?: AxiosRequestConfig
  ): Promise<Response>;
  public async request<
    Path extends keyof Endpoints,
    Method extends keyof Endpoints[Path],
    Data extends Extract<Endpoints[Path][Method], { body: any }>["body"],
    Response extends Extract<
      Endpoints[Path][Method],
      { response: any }
    >["response"]
  >(
    apiPath: Path,
    method: Method,
    data: Data & { realUrl?: string; baseUrl?: string; raw?: true | undefined },
    axiosConfig?: AxiosRequestConfig
  ): Promise<AxiosResponse<Response> | Response> {
    const { realUrl, baseUrl = "/rest/v1", raw, ...axiosParams } = data;
    const url = `${this.config.apiBaseUrl}${baseUrl}${realUrl || apiPath}`;

    if (this.config.debug) {
      // eslint-disable-next-line no-console
      console.log(`[Akeneo] ${method} ${realUrl || apiPath}`);
    }

    try {
      const response: AxiosResponse<Response> = await axios(url, {
        method: method as AxiosMethod,
        ...axiosParams,
        ...axiosConfig,
        headers: {
          ...(await this.auth.getAxiosAuth()),
          ...axiosConfig?.headers,
        },
      });

      if (raw) {
        return response;
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data.message) {
        throw new Error(
          `[Error ${error.response.data.code} on '${url}']: ${error.response.data.message}`
        );
      }

      throw error;
    }
  }

  /**
   * Converts an array of objects to an Akeneo collection, in order to satisfy
   * the `application/vnd.akeneo.collection+json` content type
   */
  protected arrayToCollection(
    arr: Record<string, unknown>[]
  ): AkeneoCollection {
    return arr.map((o) => JSON.stringify(o)).join("\n");
  }

  /**
   * Converts an Akeneo collection to an array of objects.
   */
  protected collectionToArray<T extends Record<string, unknown>>(
    coll?: AkeneoCollection | Record<string, unknown>
  ): T[] {
    if (typeof coll === "string") {
      return coll?.split("\n").map((e) => JSON.parse(e)) ?? [];
    }

    return [coll] as T[];
  }

  /**
   * Converts the `search` parameter to JSON
   */
  protected formatSearch<T>(data: T): T {
    if ("search" in (data as any).params) {
      (data as any).params.search = JSON.stringify((data as any).params.search);
    }

    return data;
  }

  /**
   * Return the header needed to send collections
   */
  protected getCollectionHeaders() {
    return {
      headers: { "Content-Type": "application/vnd.akeneo.collection+json" },
    };
  }

  /**
   * Get parsed params for the search_after pagination
   * method
   */
  public parseSearchAfterURL(url: string): { search_after: string } {
    const parsedUrl = new URL(url);
    const search_after = parsedUrl.searchParams.get("search_after")!;

    return { search_after };
  }
}
