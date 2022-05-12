export type ProductCreateBody = {
  identifier: string;
  enabled?: boolean;
  family?: string | null;
  categories?: string[];
  groups?: string[];
  parent?: string | null;
  values?: Record<
    string,
    { scope: string | null; locale: string | null; data: any }[]
  >;
};

export type CreateMediaFileBody =
  | {
      product: {
        identifier: string;
        attribute: string;
        scope: string | null;
        locale: string | null;
      };
      file: any;
      fileName?: string;
    }
  | {
      productModel: {
        code: string;
        attribute: string;
        scope: string | null;
        locale: string | null;
      };
      file: any;
      fileName?: string;
    };

export type AkeneoCollection = string;

export type AkeneoFilters = {
  page?: number;
  with_count?: boolean;
  pagination_type?: string;
  limit?: number;
  search?: Record<string, unknown>;
  search_after?: string;
};

/**
 * @see https://api.akeneo.com/concepts/catalog-structure.html#attribute
 */
export type AttributeType =
  | "pim_catalog_identifier"
  | "pim_catalog_text"
  | "pim_catalog_textarea"
  | "pim_catalog_simpleselect"
  | "pim_catalog_multiselect"
  | "pim_catalog_boolean"
  | "pim_catalog_date"
  | "pim_catalog_number"
  | "pim_catalog_metric"
  | "pim_catalog_price_collection"
  | "pim_catalog_image"
  | "pim_catalog_file"
  | "pim_catalog_asset_collection"
  | "akeneo_reference_entity"
  | "akeneo_reference_entity_collection"
  | "pim_reference_data_simpleselect"
  | "pim_reference_data_multiselect"
  | "pim_catalog_table";

export type CreateAttributeOptionBody = {
  code: string;
  attribute?: string;
  sort_order?: number;
  labels?: Record<string, string>;
};

export type CreateCategoryBody = {
  code: string;
  parent?: string | null;
  updated?: string;
  labels: Record<string, string>;
};
