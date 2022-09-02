// toPascalCase('Some label that needs to be pascalized');
// 'SomeLabelThatNeedsToBePascalized'
import _ from "lodash";

export const toPascalCase = (value: string) =>
  `${value}`
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, "g"), " ")
    .replace(new RegExp(/[^\w\s]/, "g"), "")
    .replace(new RegExp(/\s+(.)(\w*)/, "g"), ($1, $2, $3) => `${$2.toUpperCase() + $3}`)
    .replace(new RegExp(/\w/), (s) => s.toUpperCase());

export const getCapitalizeStartWord = (str: string) => {
  if (str && _.trim(str)) {
    return _.startCase(str);
  }
  return "";
};

export const getStringFirstLetter = (str: string, isSpaceAllowed: boolean): string => {
  if (str && _.trim(str)) {
    let newString = str
      .split(" ")
      .map((item) => item.toUpperCase().substring(0, 1))
      .join(" ");

    if (!isSpaceAllowed) {
      newString = newString.replace(/ /g, "");
    }
    return newString;
  }
  return "";
};
export const getConvertValues = (value: string) => {
  const str = value.replaceAll("k", "000");
  const newStr = str.replace(/[^0-9 -]/g, "");
  const removeDollarSignStr = newStr.split("$").join("");
  const result = removeDollarSignStr.split(" ").join("");
  if (result === "100") return "0-100";
  if (result === "5000") return "5000-";
  return result;
};
