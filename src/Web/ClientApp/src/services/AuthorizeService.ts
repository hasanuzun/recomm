import jwt_decode from "jwt-decode";
import { Log, Profile, User, UserManager } from "oidc-client";
import { IAppStrings } from "../i18n/stringsDef";
import { ServerResponse } from "../shared/models";
import { authSettings } from "./../shared/configs";

//import { ApplicationPaths, ApplicationName } from "./ApiAuthorizationConstants";

interface Subscription {
  callback: () => void;
  subscription: number;
}

export class AuthorizeService {
  _userManager: UserManager;
  _user: User | undefined;
  _callbacks = new Array<Subscription>();
  _nextSubscriptionId = 0;
  _isAuthenticated = false;

  // By default pop ups are disabled because they don't work properly on Edge.
  // If you want to enable pop up authentication simply set this flag to false.
  _popUpDisabled = true;

  constructor() {
    this._userManager = this.ensureUserManagerInitialized();
  }

  async isAuthenticated() {
    const user = await this.getUser();
    return !!user;
  }

  async getUser() {
    if (this._user && this._user?.profile) {
      return this._user.profile;
    }

    this.ensureUserManagerInitialized();
    const user = await this._userManager.getUser();
    return user && user.profile;
  }

  getAccessToken(): string | undefined {
    return this._user?.access_token;
  }

  async getAccessTokenAsync() {
    this.ensureUserManagerInitialized();
    const user = await this._userManager.getUser();
    return user && user.access_token;
  }

  // We try to authenticate the user in three different ways:
  // 1) We try to see if we can authenticate the user silently. This happens
  //    when the user is already logged in on the IdP and is done using a hidden iframe
  //    on the client.
  // 2) We try to authenticate the user using a PopUp Window. This might fail if there is a
  //    Pop-Up blocker or the user has disabled PopUps.
  // 3) If the two methods above fail, we redirect the browser to the IdP to perform a traditional
  //    redirect flow.
  async signIn(
    state: any
  ): Promise<{ status: string; state?: string; message?: string }> {
    this.ensureUserManagerInitialized();
    try {
      const silentUser = await this._userManager.signinSilent(
        this.createArguments()
      );
      this.updateState(silentUser);
      return this.success(state);
    } catch (silentError) {
      // User might not be authenticated, fallback to popup authentication
      console.log("Silent authentication error: ", silentError);

      try {
        if (this._popUpDisabled) {
          throw new Error(
            "Popup disabled. Change 'AuthorizeService.js:AuthorizeService._popupDisabled' to false to enable it."
          );
        }

        const popUpUser = await this._userManager.signinPopup(
          this.createArguments()
        );
        this.updateState(popUpUser);
        return this.success(state);
      } catch (popUpError) {
        if (popUpError.message === "Popup window closed") {
          // The user explicitly cancelled the login action by closing an opened popup.
          return this.error("The user closed the window.");
        } else if (!this._popUpDisabled) {
          console.log("Popup authentication error: ", popUpError);
        }

        // PopUps might be blocked by the user, fallback to redirect
        try {
          await this._userManager.signinRedirect(this.createArguments(state));
          return this.redirect();
        } catch (redirectError) {
          console.log("Redirect authentication error: ", redirectError);
          return this.error(redirectError);
        }
      }
    }
  }

  async completeSignIn(url: string): Promise<any> {
    try {
      this.ensureUserManagerInitialized();
      const user = await this._userManager.signinCallback(url);
      this.updateState(user);
      return this.success(user && user.state);
    } catch (error) {
      console.log("There was an error signing in: ", error);
      return this.error("There was an error signing in.");
    }
  }

  // We try to sign out the user in two different ways:
  // 1) We try to do a sign-out using a PopUp Window. This might fail if there is a
  //    Pop-Up blocker or the user has disabled PopUps.
  // 2) If the method above fails, we redirect the browser to the IdP to perform a traditional
  //    post logout redirect flow.
  async signOut(
    state: any
  ): Promise<{ status: string; state?: string; message?: string }> {
    this.ensureUserManagerInitialized();
    try {
      if (this._popUpDisabled) {
        throw new Error(
          "Popup disabled. Change 'AuthorizeService.js:AuthorizeService._popupDisabled' to false to enable it."
        );
      }

      await this._userManager.signoutPopup(this.createArguments());
      this.updateState(undefined);
      return this.success(state);
    } catch (popupSignOutError) {
      console.log("Popup signout error: ", popupSignOutError);
      try {
        await this._userManager.signoutRedirect(this.createArguments(state));
        return this.redirect();
      } catch (redirectSignOutError) {
        console.log("Redirect signout error: ", redirectSignOutError);
        return this.error(redirectSignOutError);
      }
    }
  }

  async completeSignOut(
    url: string
  ): Promise<{ status: string; state?: string; message?: string }> {
    this.ensureUserManagerInitialized();
    try {
      const response = (await this._userManager.signoutCallback(url)) as any;
      this.updateState(undefined);
      return this.success(response && response.data);
    } catch (error) {
      console.log(`There was an error trying to log out '${error}'.`);
      return this.error(error);
    }
  }

  updateState(user: User | undefined) {
    this._user = user;
    this._isAuthenticated = !!this._user;
    this.notifySubscribers();
  }

  subscribe(callback: () => void) {
    this._callbacks.push({
      callback,
      subscription: this._nextSubscriptionId++,
    });
    return this._nextSubscriptionId - 1;
  }

  unsubscribe(subscriptionId: number) {
    const subscriptionIndex = this._callbacks
      .map((element, index) =>
        element.subscription === subscriptionId
          ? { found: true, index }
          : { found: false, index: -1 }
      )
      .filter((element) => element.found === true);
    if (subscriptionIndex.length !== 1) {
      throw new Error(
        `Found an invalid number of subscriptions ${subscriptionIndex.length}`
      );
    }

    this._callbacks.splice(subscriptionIndex[0].index, 1);
  }

  notifySubscribers() {
    for (let i = 0; i < this._callbacks.length; i++) {
      const callback = this._callbacks[i].callback;
      callback();
    }
  }

  createArguments(state?: any): any {
    return { useReplaceToNavigate: true, data: state };
  }

  error(message: string) {
    return { status: AuthenticationResultStatus.Fail, message };
  }

  success(state: any) {
    return { status: AuthenticationResultStatus.Success, state };
  }

  redirect() {
    return { status: AuthenticationResultStatus.Redirect };
  }

  ensureUserManagerInitialized(): UserManager {
    if (this._userManager !== undefined) {
      return this._userManager;
    }

    this._userManager = new UserManager(authSettings);
    Log.logger = console;
    Log.level = process.env.NODE_ENV === "development" ? Log.INFO : Log.ERROR;

    this._userManager.events.addUserSignedOut(async () => {
      await this._userManager.removeUser();
      this.updateState(undefined);
    });

    return this._userManager;
  }

  signinByPassword = async (
    email: string,
    password: string,
    strings: IAppStrings
  ): Promise<ServerResponse> => {
    let result: ServerResponse = { isOK: false };

    this.ensureUserManagerInitialized();

    var tokenUrl = await this._userManager.metadataService.getTokenEndpoint();
    if (!tokenUrl) {
      return result;
    }

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);
    formData.append("client_id", authSettings.client_id ?? "recomm");
    formData.append("grant_type", "password");
    formData.append("scope", authSettings.scope ?? "openid");
    formData.append("response_type", "id_token token");

    var headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const requestOptions: RequestInit = {
      method: "POST",
      headers: headers,
      body: formData.toString(),
    };

    var tokenResponse = await fetch(tokenUrl, requestOptions);

    if (tokenResponse.status !== 200) {
      result.errorMessage =
        tokenResponse.status === 400
          ? strings.account.wrondPassOrUsername
          : strings.shared.technicalError;

      return result;
    }

    var token = await tokenResponse.json();

    var decoded = jwt_decode(token.access_token) as any;

    var user = new User({ ...token, expires_at: decoded.exp });
    user.id_token = user.id_token ?? user.access_token;

    if (authSettings.loadUserInfo) {
      var infoUrl = this._userManager.settings.metadata?.userinfo_endpoint;

      if (infoUrl) {
        const getRequestOptions: RequestInit = {
          method: "GET",
          headers: new Headers([
            ["Authorization", `Bearer ${token.access_token}`],
          ]),
        };
        var profileResponse = await fetch(infoUrl, getRequestOptions);

        if (profileResponse.status !== 200) {
          result.errorMessage = strings.shared.technicalError;
          return result;
        }

        user.profile = await profileResponse.json();
      }
    } else {
      user.profile = decoded as Profile;
    }

    await this._userManager.storeUser(user);

    this.updateState(user);

    result.data = user;

    return result;
  };

  signinByExternProvider = (provider: string): Promise<void> => {
    return this._userManager.signinRedirect({
      extraQueryParams: {
        kc_idp_hint: provider.toLocaleLowerCase(),
      },
    });
  };

  static get instance() {
    return authService;
  }
}

const authService = new AuthorizeService();

export default authService;

export const AuthenticationResultStatus = {
  Redirect: "redirect",
  Success: "success",
  Fail: "fail",
};
