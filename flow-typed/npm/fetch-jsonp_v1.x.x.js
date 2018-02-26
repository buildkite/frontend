// flow-typed signature: 3b3fd8f4b622097c9b036f8ba70327fd
// flow-typed version: c0fddcdf0c/fetch-jsonp_v1.x.x/flow_>=v0.38.x

// Adapted from https://github.com/camsong/fetch-jsonp/blob/master/index.d.ts

declare module "fetch-jsonp" {
  declare module.exports: (url: string, options?: Options) => Promise<Response>;

  declare type Options = {
    timeout?: number,
    jsonpCallback?: string,
    jsonpCallbackFunction?: string
  };

  declare class Response {
    json<T>(): Promise<T>,
    ok: boolean
  }
}
