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
  if (value === "No hires") return "-0";
  if (result === "19") return "1-9";
  if (result === "10") return "10-";
  if (result === "2") return "0-2";
  if (result === "4") return "2-4";
  if (result === "6") return "5-6";

  return result;
};

export const getUserShortName = (firstName: string, lastName: string) => {
  if (firstName !== "" && lastName !== "") {
    return `${getCapitalizeStartWord(firstName)} ${getCapitalizeStartWord(lastName?.charAt(0))}.`;
  }
  return "";
};

export const convertAdvanceSearchValues = (keyName: string, value: string) => {
  let result;
  if (keyName === "orTerms") {
    const str = value.replaceAll(" ", " OR ");
    return str;
  }
  if (keyName === "andTerms") {
    const str = value.replaceAll(" ", " AND ");
    return str;
  }
  if (keyName === "exactTerms") {
    return ` "${value}"`;
  }
  if (keyName === "excludeTerms") {
    const str = value.replaceAll(" ", " OR ");
    return ` NOT ${str}`;
  }
  if (keyName === "titleTerm") {
    const str = value.replaceAll(" ", " AND ");
    return str;
  }

  return result;
};
