import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { convertTypes, objectToString, stringToObject } from "./converter";
export const getData = (path: string, file: string, type: convertTypes) => {
  const fileName = file + "." + type;
  const filePath = path + "/" + fileName;
  let data: string;
  if (!readdirSync(path).includes(fileName)) {
    writeFileSync(filePath, objectToString({}, type), "utf-8");
  }
  let d = readFileSync(filePath, "utf-8").trim();
  if (type == "json" && (!d.startsWith("{") || !d.endsWith("}"))) {
    writeFileSync(filePath, objectToString({}, type), "utf-8");
  }
  data = readFileSync(
    filePath,
    type == "bson" ? { encoding: "binary" } : "utf-8"
  );
  return stringToObject(data, type);
};
export const pathControl = (path: string) => {
  if (!readdirSync(process.cwd()).includes(path)) {
    if (path == ".") return;
    let dirs = "./";
    for (const dir of path.split("/")) {
      if (!readdirSync(dirs).includes(dir)) mkdirSync(dirs + dir);
      dirs += dir + "/";
    }
  }
};
export const save = (
  path: string,
  file: string,
  data: object,
  type: convertTypes
) => {
  const fullPath = process.cwd() + "/" + path + "/" + file + "." + type;
  writeFileSync(
    fullPath,
    objectToString(data, type),
    type == "bson" ? { encoding: "binary" } : "utf-8"
  );
};
export const isSameArrays = (a: Array<any>, b: Array<any>): boolean => {
  let isSome = true;
  a.forEach((e) => (!b.includes(e) ? (isSome = false) : true));
  return isSome;
};
export const isObject = (o: any): boolean =>
  typeof o == "object" && !Array.isArray(o);

export const isSameObjects = (val1: any, val2: any) => {
  let isSome = true;
  Object.keys(val1).forEach((e) => {
    if (isObject(val1[e])) {
      if (!isSameObjects(val1[e], val2[e])) isSome = false;
    } else if (Array.isArray(val1[e])) {
      if (!isSameArrays(val1[e], val2[e])) isSome = false;
    } else if (val1[e] !== val2[e]) {
      isSome = false;
    }
  });
  return isSome;
};
