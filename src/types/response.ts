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
