import LocalizedStrings from "react-localization";
import { IStrings } from "./stringsDef";
import { deStrings } from "./stringsDE";
import { trStrings } from "./stringsTR";
import { enStrings } from "./stringsEN"; 

export const defaultLang = "tr";

const strings: IStrings = new LocalizedStrings({
  tr: trStrings,
  en: enStrings,
  de: deStrings,
}); 

strings.setLanguage(defaultLang);

export default strings;
