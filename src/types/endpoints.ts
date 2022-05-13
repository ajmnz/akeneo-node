/* eslint-disable @typescript-eslint/ban-types */
import FormData from "form-data";
import {
  AkeneoCollection,
  AkeneoFilters,
  AttributeType,
  ProductCreateBody,
} from "./body";
import { BasePaginatedResponse, LinkedData } from "./response";

export type Endpoints = {
  "/products": {
    /**
     * Create a new product
     */
    POST: {
      body: {
        data: ProductCreateBody;
      };
      response: { code: number; message: string };
    };

    /**
     * Update/create several products
     */
    PATCH: {
      body: {
        data: AkeneoCollection;
      };
      response: AkeneoCollection;
    };

    /**
     * Get a list of products
     */
    GET: {
      body: {
        params?: AkeneoFilters & {
          scope?: string;
          locales?: string;
          attributes?: string;
          with_attribute_options?: boolean;
          with_quality_scores?: boolean;
          with_completeness?: boolean;
        };
      };
      response: BasePaginatedResponse<{
        items: {
          _links: {
            self: {
              href: string;
            };
          };
          identifier: string;
          enabled: boolean;
          family: string;
          categories: string[];
          groups: string[];
          parent: string;
          values: Record<
            string,
            {
              scope: string | null;
              locale: string | null;
              data: string | Record<string, unknown>;
              linked_data?: LinkedData;
            }[]
          >;
          associations: Record<
            string,
            { groups: string[]; products: string[]; product_models: string[] }
          >;
          quantified_associations: Record<
            string,
            {
              products: Record<string, unknown>[];
              product_models: Record<string, unknown>[];
            }
          >;
          created: string;
          updated: string;
        }[];
      }>;
    };
  };

  "/products/:code": {
    /**
     * Get a product
     */
    GET: {
      body: {
        params?: {
          with_attribute_options?: boolean;
          with_quality_scores?: boolean;
          with_completeness?: boolean;
        };
      };
      response: {};
    };

    /**
     * Delete a product
     */
    DELETE: {
      body: {};
      response: {};
    };
  };

  "/media-files": {
    /**
     * Create a new product media file
     */
    POST: {
      body: {
        data: FormData;
      };
      response: {};
    };
  };

  "/media-files/:code/download": {
    /**
     * Download media file
     */
    GET: {
      body: {};
      response: any;
    };
  };

  "/attributes": {
    /**
     * Update/create several attributes
     */
    PATCH: {
      body: {
        data: {
          code: string;
          type: AttributeType;
          group: string;
          labels?: Record<string, string>;
          group_labels?: string[];
          sort_order?: number;
          localizable?: boolean;
          scopable?: boolean;
          available_locales: string[];
          unique: boolean;
          useable_as_grid_filter: boolean;
        };
        // #todo
      };
      response: {};
    };
  };

  "/attributes/:code": {
    /**
     * Get an attribute
     */
    GET: {
      body: {};
      response: {
        code: string;
        type: string;
        group: string;
        group_labels: Record<string, string>;
        sort_order: number;
        localizable: boolean;
        scopable: boolean;
        available_locales: string[];
        unique: boolean;
        useable_as_grid_filter: boolean;
        max_characters: number;
        validation_rule: string;
        validation_regexp: string;
        wysiwyg_enabled: boolean;
        numbre_min: string;
        number_max: string;
        decimals_allowed: boolean;
        negative_allowed: boolean;
        metric_family: string;
        default_metric_unit: string;
        date_min: string;
        date_max: string;
        allowed_extensions: string[];
        max_file_size: string;
        reference_data_name: string;
        default_value: boolean;
      };
    };
  };

  "/attributes/:code/options": {
    /**
     * Update/create several attribute options
     */
    PATCH: {
      body: {
        data: AkeneoCollection;
      };
      response: AkeneoCollection;
    };

    /**
     * Get list of attribute options
     */
    GET: {
      body: {
        params?: AkeneoFilters;
      };
      response: BasePaginatedResponse<{
        items: {
          _links: {
            self: {
              href: string;
            };
          };
          code: string;
          attribute: string;
          sort_ordeR: number;
          labels: Record<string, string>;
        }[];
      }>;
    };
  };

  "/categories": {
    /**
     * Update/create several categories
     */
    PATCH: {
      body: {
        data: AkeneoCollection;
      };
      response: AkeneoCollection;
    };
  };
};
