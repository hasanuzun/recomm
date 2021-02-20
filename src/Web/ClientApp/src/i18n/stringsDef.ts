import { LocalizedStringsMethods } from "react-localization";

export interface IAppStrings {
  app: {
    title: string;
  };
  account: {
    signin: string;
    signout: string;
    processingLogin: string;
    processingLogout: string;
    loginTitle: string;
    email: string;
    emailorUsername: string;
    password: string;
    signInViaGoogle: string;
    signInViaFacebook: string;
    signInViaMicrosoft: string;
    wrondPassOrUsername: string;
  };
  footer: {
    copyright: string;
  };
  shared: {
    underConstruction: string;
    technicalError: string;
    or: string;
    copy: string;
    hide: string;
    show: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
  };
}
export interface IStrings extends LocalizedStringsMethods, IAppStrings { }
