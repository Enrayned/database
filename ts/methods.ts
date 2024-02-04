import { isObject, isSameObjects } from "./utils";

export const _set = (
  data: object,
  key: string,
  value: any
): { oldValue: any; data: object } => {
  let d: string = "";
  let oldValue: any;
  key.split(".").forEach((e, i, a) => {
    d += `["${e}"]`;
    if (
      typeof eval(`data${d}`) !== "object" &&
      typeof eval(`data${d}`) !== "undefined" &&
      key.includes(".") &&
      i != a.length - 1
    )
      throw TypeError(
        `${d
          .replaceAll('"', "")
          .replaceAll("[", "")
          .replaceAll("]", ".")
          .slice(0, -1)} is not an object`
      );
    if (typeof eval(`data${d}`) == "undefined") {
      eval(`data${d}={}`);
    }
  });
  oldValue = eval(`data${d}`) ?? undefined;
  eval(`data${d}=${JSON.stringify(value)}`);
  return { oldValue, data };
};
export const _setForge = (
  data: object,
  key: string,
  value: any
): { oldValue: any; data: object } => {
  let d: string = "";
  let oldValue: any;
  key.split(".").forEach((e) => {
    d += `["${e}"]`;
    if (typeof eval(`data${d}`) !== "object") {
      eval(`data${d}={}`);
    }
  });
  oldValue = eval(`data["${key.split(".")[0]}"]`) ?? undefined;
  eval(`data${d}=${JSON.stringify(value)}`);
  return { oldValue, data };
};
export const _delete = (
  data: object,
  key: string
): { oldValue: any; data: object } => {
  let d: string = "";
  let oldValue: any;
  key.split(".").forEach((e) => {
    if (d != "d") d += `["${e}"]`;
    if (typeof eval(`data${d}`) === "undefined") {
      d = "d";
    }
  });
  oldValue = d != "d" ? eval(` data${d}`) ?? undefined : undefined;
  eval(`delete data${d}`);
  return { oldValue, data };
};
export const _deleteAll = (data: object): { oldData: any; data: object } => ({
  oldData: data,
  data: {},
});
export const _has = (data: object, key: string): boolean => {
  let d: string = "";
  key.split(".").forEach((e) => {
    if (d != "d") d += `["${e}"]`;
    if (typeof eval(`data${d}`) === "undefined") d = "d";
  });
  if (typeof eval(`data${d}`) === "undefined" || d == "d") return false;
  else if (typeof eval(`data${d}`) !== "undefined") return true;
  else return false;
};
export const _get = (data: object, key: string): any => {
  let d: string = "";
  key.split(".").forEach((e) => {
    if (d != "d") d += `["${e}"]`;
    if (typeof eval(`data${d}`) === "undefined") d = "d";
  });
  if (d == "d") return undefined;
  else return eval(`data${d}`);
};
export const _push = (
  data: object,
  key: string,
  value: any
): { data: object; array: any } => {
  let d: string = "";
  key.split(".").forEach((e, i, a) => {
    d += `["${e}"]`;
    if (
      typeof eval(`data${d}`) !== "object" &&
      typeof eval(`data${d}`) !== "undefined" &&
      key.includes(".") &&
      i != a.length - 1
    )
      throw TypeError(
        `${d
          .replaceAll('"', "")
          .replaceAll("[", "")
          .replaceAll("]", ".")
          .slice(0, -1)} is not an object`
      );
    if (typeof eval(`data${d}`) == "undefined") eval(`data${d}={}`);
  });
  if (!Array.isArray(eval(`data${d}`))) eval(`data${d}=[]`);
  eval(`data${d}`).push(value);
  return { data, array: eval(`data${d}`) };
};
export const _pull = (
  data: object,
  key: string,
  value: any
): { data: object; array: any } => {
  let d: string = "";
  key.split(".").forEach((e, i, a) => {
    d += `["${e}"]`;
    if (
      typeof eval(`data${d}`) !== "object" &&
      typeof eval(`data${d}`) !== "undefined" &&
      key.includes(".") &&
      i != a.length - 1
    )
      throw TypeError(
        `${d
          .replaceAll('"', "")
          .replaceAll("[", "")
          .replaceAll("]", ".")
          .slice(0, -1)} is not an object`
      );
    if (typeof eval(`data${d}`) === "undefined")
      throw TypeError(
        `${d
          .replaceAll('"', "")
          .replaceAll("[", "")
          .replaceAll("]", ".")
          .slice(0, -1)} is not an array`
      );
  });
  const a = eval(`data${d}`);
  if (Array.isArray(a)) {
    if (isObject(value))
      eval(
        `data${d}=${JSON.stringify(a.filter((k) => !isSameObjects(k, value)))}`
      );
    else eval(`data${d}=${JSON.stringify(a.filter((e) => e != value))}`);
  }
  return { data, array: eval(`data${d}`) };
};
