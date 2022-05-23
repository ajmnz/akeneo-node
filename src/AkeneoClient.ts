import {
  CreateAttributeOptionBody,
  CreateCategoryBody,
  CreateMediaFileBody,
  Endpoints,
  ProductCreateBody,
} from "./types";
import { ClientConfig } from "./types/client";
import fs from "fs";
import FormData from "form-data";
import { AkeneoCore } from "./AkeneoCore";

export class AkeneoClient extends AkeneoCore {
  constructor(config: ClientConfig) {
    super(config);
  }

  /**
   * Products
   *
   * @see https://api.akeneo.com/api-reference-index.html#Products
   */
  public product = {
    /**
     * Create a new product
     *
     * @see https://api.akeneo.com/api-reference.html#post_products
     */
    create: (data: Endpoints["/products"]["POST"]["body"]) =>
      this.request("/products", "POST", data),

    /**
     * Update/create several products
     *
     * @see https://api.akeneo.com/api-reference.html#patch_products
     */
    upsertMany: async (data: ProductCreateBody[]) => {
      const response = await this.request(
        "/products",
        "PATCH",
        {
          data: this.arrayToCollection(data),
        },
        this.getCollectionHeaders()
      );

      return this.collectionToArray<{
        line: number;
        identifier: string;
        code?: string;
        status_code: number;
        message?: string;
      }>(response);
    },

    /**
     * Get a product
     *
     * @see https://api.akeneo.com/api-reference.html#get_products__code_
     */
    getOne: (
      data: Endpoints["/products/:code"]["GET"]["body"] & { code: string }
    ) => {
      const { code, ...cleanData } = data;
      return this.request("/products/:code", "GET", {
        ...cleanData,
        realUrl: `/products/${data.code}`,
      });
    },

    /**
     * Get a list of products
     *
     * @see https://api.akeneo.com/api-reference.html#get_products
     */
    getMany: (data: Endpoints["/products"]["GET"]["body"]) =>
      this.request("/products", "GET", this.formatSearch(data)),

    /**
     * Delete a product
     *
     * @see https://api.akeneo.com/api-reference.html#delete_products__code_
     */
    delete: (code: string) =>
      this.request("/products/:code", "DELETE", {
        realUrl: `/products/${code}`,
      }),
  };

  /**
   * Product media file
   *
   * @see https://api.akeneo.com/api-reference.html#Productmediafile
   */
  public mediaFile = {
    /**
     * Create a new product media file
     *
     * @see https://api.akeneo.com/api-reference.html#post_media_files
     */
    create: async (data: CreateMediaFileBody) => {
      const { file, fileName = "image.jpg" } = data;
      const formData = new FormData();

      if (typeof file === "string") {
        formData.append("file", fs.createReadStream(file));
      } else {
        formData.append("file", file, fileName);
      }

      if ("product" in data) {
        formData.append("product", JSON.stringify(data.product));
      } else {
        formData.append("productModel", JSON.stringify(data.productModel));
      }

      const response = await this.request(
        "/media-files",
        "POST",
        {
          data: formData,
          raw: true,
        },
        { headers: { ...formData.getHeaders() } }
      );

      const uri = response.headers.location;
      return { uri };
    },

    /**
     * Download a product media file. Call `save()` to store
     * the file in your filesystem.
     *
     * @see https://api.akeneo.com/api-reference.html#get_media_files__code__download
     */
    download: async (data: { code: string }) => {
      const response = await this.request(
        "/media-files/:code/download",
        "GET",
        {
          realUrl: `/media-files/${data.code}/download`,
        },
        { responseType: "stream" }
      );

      return {
        data: response,
        save: (saveData: { path: string }) => {
          const mediaPath = saveData.path;

          if (!mediaPath) {
            throw new Error("Media path should be defined");
          }

          const writer = fs.createWriteStream(mediaPath);
          response.pipe(writer);

          return new Promise((resolve, reject) => {
            writer.on("finsih", resolve);
            writer.on("error", reject);
          });
        },
      };
    },
  };

  /**
   * Attributes
   *
   * @see https://api.akeneo.com/api-reference.html#Attribute
   */
  public attribute = {
    /**
     * Get an attribute
     *
     * @see https://api.akeneo.com/api-reference.html#get_attributes__code_
     */
    getOne: (data: { code: string }) =>
      this.request("/attributes/:code", "GET", {
        realUrl: `/attributes/${data.code}`,
      }),
  };

  /**
   * Attribute option
   *
   * @see https://api.akeneo.com/api-reference.html#Attributeoption
   */
  public attributeOption = {
    /**
     * Get an attribute option
     *
     * @see https://api.akeneo.com/api-reference.html#get_attributes__attribute_code__options__code_
     */
    getOne: (data: { attributeCode: string; code: string }) =>
      this.request("/attributes/:attributeCode/options/:code", "GET", {
        realUrl: `/attributes/${data.attributeCode}/options/${data.code}`,
      }),
    /**
     * Update/create several attribute options
     *
     * @see https://api.akeneo.com/api-reference.html#patch_attributes__attribute_code__options
     */
    upsertMany: async (data: {
      values: CreateAttributeOptionBody[];
      attributeCode: string;
    }) => {
      const { attributeCode, values } = data;

      const response = await this.request(
        "/attributes/:code/options",
        "PATCH",
        {
          data: this.arrayToCollection(values),
          realUrl: `/attributes/${attributeCode}/options`,
        },
        this.getCollectionHeaders()
      );

      return this.collectionToArray<{
        line: number;
        code: string;
        status_code: number;
        message?: string;
      }>(response);
    },

    /**
     * Get list of attribute options
     *
     * @see https://api.akeneo.com/api-reference.html#get_attributes__attribute_code__options
     */
    getMany: (
      data: Endpoints["/attributes/:code/options"]["GET"]["body"] & {
        attributeCode: string;
      }
    ) => {
      const { attributeCode, ...cleanData } = data;
      return this.request("/attributes/:code/options", "GET", {
        ...cleanData,
        realUrl: `/attributes/${attributeCode}/options`,
      });
    },
  };

  /**
   * Categories
   *
   * @see https://api.akeneo.com/api-reference.html#Category
   */
  public category = {
    /**
     * Get a category
     *
     * @see https://api.akeneo.com/api-reference.html#get_categories__code_
     */
    getOne: (data: { code: string }) =>
      this.request("/categories/:code", "GET", {
        realUrl: `/categories/${data.code}`,
      }),

    /**
     * Update/create several categories
     *
     * @see https://api.akeneo.com/api-reference.html#patch_categories
     */
    upsertMany: async (data: CreateCategoryBody[]) => {
      const response = await this.request(
        "/categories",
        "PATCH",
        {
          data: this.arrayToCollection(data),
        },
        this.getCollectionHeaders()
      );

      return this.collectionToArray<{
        line: number;
        code: string;
        status_code: number;
        message?: string;
      }>(response);
    },
  };

  /**
   * Channels
   *
   * @see https://api.akeneo.com/api-reference.html#Channel
   */
  public channel = {
    /**
     * Get a channel
     *
     * @see https://api.akeneo.com/api-reference.html#get_channels__code_
     */
    getOne: (data: { code: string }) =>
      this.request("/channels/:code", "GET", {
        realUrl: `/channels/${data.code}`,
      }),
  };
}
