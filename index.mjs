import { createRequire } from "node:module";

const { Akeneo, default: AkeneoClient } = createRequire(import.meta.url)("./dist");

export { Akeneo };
export default AkeneoClient;
