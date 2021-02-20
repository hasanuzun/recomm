interface BServerResponse {
  isOK: boolean;
  errorMessage?: string;
}

export interface ServerResponse extends BServerResponse {
  data?: any;
}

export interface ServerTypedResponse<T> extends BServerResponse {
  data?: T;
}

export interface ServerArrayResponse<T> extends BServerResponse {
  data?: Array<T>;
}
