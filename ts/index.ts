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
  save(): any;
  setForge(key: string, value: any): any;
  set(key: string, value: any): any;
  delete(key: string): any;
  add(key: string, value: number): any;
  subtract(key: string, value: number): any;
  push(key: string, value: any): any;
  pull(key: string, value: any): any;
  has(key: string): boolean;
  get(key: string): any;
  all(): object;
  deleteAll(): object;
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
  save(data?: object) {
    if (typeof data == "object") this.data = data;
    utils.pathControl(this.path);
    utils.save(this.path, this.file, this.data, this.type);
  }
  setForge(key: string, value: any) {
    const { data, oldValue } = methods._setForge(this.data, key, value);
    this.save(data);
    this.emit("set", { key, oldValue, newValue: value });
  }
  set(key: string, value: any) {
    const { data, oldValue } = methods._set(this.data, key, value);
    this.save(data);
    this.emit("set", { key, oldValue, newValue: value });
  }
  delete(key: string) {
    const { data, oldValue } = methods._delete(this.data, key);
    this.save(data);
    this.emit("delete", { key, value: oldValue });
  }
  add(key: string, value: number) {
    throw new Error("Method not implemented.");
  }
  subtract(key: string, value: number) {
    throw new Error("Method not implemented.");
  }
  push(key: string, value: any) {
    throw new Error("Method not implemented.");
  }
  pull(key: string, value: any) {
    throw new Error("Method not implemented.");
  }
  has(key: string): boolean {
    throw new Error("Method not implemented.");
  }
  get(key: string) {
    throw new Error("Method not implemented.");
  }
  all(): object {
    throw new Error("Method not implemented.");
  }
  deleteAll(): object {
    throw new Error("Method not implemented.");
  }
}
