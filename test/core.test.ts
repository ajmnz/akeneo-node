import AkeneoClient, { Akeneo } from "../src";
import "dotenv/config";
import { ClientConfig } from "../src/types";
import { AkeneoAuth } from "../src/AkeneoAuth";

const {
  PIM_USERNAME,
  PIM_PASSWORD,
  PIM_CLIENT_ID,
  PIM_CLIENT_SECRET,
  PIM_BASEURL,
} = process.env;

describe("AkeneoCore", () => {
  let client: AkeneoClient;
  let clientConfig: ClientConfig;

  beforeAll(() => {
    clientConfig = {
      apiBaseUrl: PIM_BASEURL!,
      auth: {
        clientId: PIM_CLIENT_ID!,
        clientSecret: PIM_CLIENT_SECRET!,
        username: PIM_USERNAME!,
        password: PIM_PASSWORD!,
      },
    };

    client = new AkeneoClient(clientConfig);
  });

  it("should define config and auth on initialization", () => {
    expect((client as any).config).toStrictEqual(clientConfig);
    expect((client as any).auth).toBeDefined();
    expect((client as any).auth).toBeInstanceOf(AkeneoAuth);
  });
});
