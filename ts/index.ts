import Emitter from "@chocolatemilkdev/emitter";
import { convertTypes } from "./converter";
import * as utils from "./utils";
import * as convert from "./converter";
import * as methods from "./methods";
export * from "./utils";
export * from "./converter";

interface Events {
  set(data: { key: string; newValue: any; oldValue: any }): any;
  delete(data: { key: string; value: any }): any;
  add(data: { key: string; newValue: number; oldValue: number }): any;
  subtract(data: { key: string; newValue: number; oldValue: number }): any;
  push(data: { key: string; pushedData: any; array: Array<any> }): any;
  pull(data: { key: string; pulledData: any; array: Array<any> }): any;
}
interface Options {
  path?: string;
  file?: string;
  type?: convertTypes;
}
interface DbInterface {
  save(): void;
  setForge(key: string, value: any): void;
  set(key: string, value: any): void;
  delete(key: string): void;
  add(key: string, value: number): void;
  subtract(key: string, value: number): void;
  push(key: string, value: any): void;
  pull(key: string, value: any): void;
  has(key: string): boolean;
  get(key: string): any;
  all(): object;
  deleteAll(): void;
}

export class Db extends Emitter<Events> implements DbInterface {
  private path: string;
  private file: string;
  private type: convertTypes;
  private data: object | any;
  constructor(options?: Options) {
    super();
    this.path = utils.editPath(options?.path ?? "enrayned");
    this.file = utils.editFileName(options?.file ?? "database");
    this.type = options?.type ?? "json";
    utils.pathControl(this.path);
    this.loadData();
  }
  private loadData() {
    utils.pathControl(this.path);
    this.data = utils.getData(this.path, this.file, this.type);
  }
  save(data?: object): void {
    if (typeof data == "object") this.data = data;
    utils.pathControl(this.path);
    utils.save(this.path, this.file, this.data, this.type);
  }
  setForge(key: string, value: any): void {
    const { data, oldValue } = methods._setForge(this.data, key, value);
    this.save(data);
    this.emit("set", { key, oldValue, newValue: value });
  }
  set(key: string, value: any): void {
    const { data, oldValue } = methods._set(this.data, key, value);
    this.save(data);
    this.emit("set", { key, oldValue, newValue: value });
  }
  delete(key: string): void {
    const { data, oldValue } = methods._delete(this.data, key);
    this.save(data);
    this.emit("delete", { key, value: oldValue });
  }
  add(key: string, value: number): void {
    if (typeof this.get(key) !== "number")
      throw TypeError(`${key} is not a number`);
    else if (typeof this.get(key) === "number") {
      const { oldValue, data } = methods._set(
        this.data,
        key,
        this.get(key) + value
      );
      this.save(data);
      this.emit("add", { key, oldValue: oldValue, newValue: this.get(key) });
    }
  }
  subtract(key: string, value: number): void {
    if (typeof this.get(key) !== "number")
      throw TypeError(`${key} is not a number`);
    else if (typeof this.get(key) === "number") {
      const { oldValue, data } = methods._set(
        this.data,
        key,
        this.get(key) - value
      );
      this.save(data);
      this.emit("subtract", {
        key,
        oldValue: oldValue,
        newValue: this.get(key),
      });
    }
  }
  push(key: string, value: any): void {
    const { array, data } = methods._push(this.data, key, value);
    this.save(data);
    this.emit("push", { array, key, pushedData: value });
  }
  pull(key: string, value: any): void {
    const { array, data } = methods._pull(this.data, key, value);
    this.save(data);
    this.emit("pull", { array, key, pulledData: value });
  }
  has(key: string): boolean {
    return methods._has(this.data, key);
  }
  get = (key: string): any => methods._get(this.data, key);

  all(): object {
    this.loadData();
    return Object.entries(this.data).map((d) => ({
      id: d[0],
      data: d[1],
    }));
  }
  deleteAll(): void {
    const { oldData, data } = methods._deleteAll(this.data);
    this.save(data);
    this.emit("delete", { key: ".", value: oldData });
  }
}
