import fetchIntercept from "fetch-intercept";
import authService from "./../services/AuthorizeService"; 

const setDefaultHeaders = async (config: any) => {
  config = config ?? {};
  config.headers = (config.headers ?? new Headers()) as Headers;

  if (!config.headers.has("Accept")) {
    config.headers.append("Accept", "application/json");
  }

  if (!config.headers.has("Content-Type")) {
    if (config.body instanceof FormData) {
      // do nothing
    } else {
      config.headers.append("Content-Type", "application/json");
    }
  }

  if (!config.headers.has("Authorization")) {
    let accessToken = await authService.getAccessTokenAsync();
    if (accessToken) {
      config.headers.append("Authorization", "Bearer " + accessToken);
    }
  }

  return config;
};

export const registerFetchIntercept = () => {
  return fetchIntercept.register({
    request: async function (url, config) {
      const withDefaults = await setDefaultHeaders(Object.assign({}, config));
      return [url, withDefaults];
    },

    requestError: function (error) {
      // Called when an error occured during another 'request' interceptor call
      return Promise.reject(error);
    },

    response: (response: Response) => {
      if (response.status === 401) {
        // authService.signOut({ returnUrl: ApplicationPaths.Login });
      }
      // Modify the reponse object
      return response;
    },

    responseError: function (error) {
      // Handle an fetch error
      //console.log("response error", error);
      /*
      if(error.status == 401){
        console.log("unauthorized request", error),
        window.location.assign("/login");
    }
*/
      return Promise.reject(error);
    },
  });
};
