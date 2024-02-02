export type convertTypes = "yaml" | "json" | "bson";
import { parse, stringify } from "yaml";
// @ts-ignore
import BSON from "bson-ext";
export const objectToString = (data: object, type: convertTypes): string => {
  let convertedData: string = "";
  if (!["yaml", "json", "bson"].includes(type))
    throw TypeError(`Unknown convert type "${type}"`);
  else if (type == "yaml") {
    convertedData = stringify(data);
  } else if (type == "bson") {
    convertedData = BSON.serialize(data) as string;
  } else if (type == "json") {
    convertedData = JSON.stringify(data, null, 1);
  }
  return convertedData;
};
export const stringToObject = (data: string, type: convertTypes) => {
  let convertedData: object = {};
  if (!["yaml", "json", "bson"].includes(type))
    throw TypeError(`Unknown convert type "${type}"`);
  else if (type == "yaml") {
    convertedData = parse(data);
  } else if (type == "bson") {
    convertedData = BSON.deserialize(data) as object;
  } else if (type == "json") {
    convertedData = JSON.parse(data);
  }
  return convertedData;
};
