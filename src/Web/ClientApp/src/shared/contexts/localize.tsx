import React, { useMemo } from "react";
import { useCookies } from "react-cookie";
import { IAppStrings } from "./../../i18n/stringsDef";
import strings, { defaultLang } from "./../../i18n/strings"; 

export interface ILocalizeContext {
  language: string;
  strings: IAppStrings;
  setLanguage: (lng: string) => void;
}

export const LocalizeContext = React.createContext<ILocalizeContext>({
  language: defaultLang,
  strings: {} as IAppStrings,
  setLanguage: (lng: string) => undefined,
});

export const LocalizeConsumer = LocalizeContext.Consumer;

export const LocalizeProvider = (props: any) => {
  const [langCookie, setLangCookie] = useCookies(["lang"]);
  const defLang = langCookie.lang ?? defaultLang; 

  if (strings.getLanguage() !== defLang) {
    strings.setLanguage(defLang);
  }

  const context = useMemo(() => {
    return {
      language: defLang,
      strings: strings,
      setLanguage: (lng: string) => {
        setLangCookie("lang", lng, { path: "/" });
        strings.setLanguage(lng);
     /*   var currentPath = window.location.pathname;
        push("/");
        replace(currentPath);*/
      },
    } as ILocalizeContext;
  }, [defLang, setLangCookie]);

  return (
    <LocalizeContext.Provider value={context}>
      {props.children}
    </LocalizeContext.Provider>
  );
};

export const useLocalize = () => React.useContext(LocalizeContext);
