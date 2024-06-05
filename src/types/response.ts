export type AuthResponse = {
  access_token: string;
  expires_in: number;
  token_type: "bearer";
  scope: null;
  refresh_token: string;
};

export type LinksResponse = {
  current_page: number;
  _links: {
    self: {
      href: string;
    };
    first: {
      href: string;
    };
    next?: {
      href: string;
    };
    previous?: {
      href: string;
    };
  };
};

export type BasePaginatedResponse<T> = LinksResponse & { _embedded: T };

export type LinkedData = {
  values: {
    main_color: [
      {
        data: string;
        linked_data: {
          attribute: string;
          code: string;
          labels: Record<string, string>;
        };
      }
    ];
  };
};

export type ChannelResponse = {
  code: string;
  currencies: string[];
  locales: string[];
  category_tree: string;
  conversion_units: Record<string, string>;
  labels: Record<string, string>;
};

export type ProductValueData =
  | string
  | Record<string, unknown>
  | boolean
  | number
  | { amount: string; currency: string }[];

export type ProductResponse = {
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
      data: ProductValueData;
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
      products: { identifier: string; quantity: number }[];
      product_models: Record<string, unknown>[];
    }
  >;
  created: string;
  updated: string;
};
