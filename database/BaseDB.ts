export class BaseDB<T>{
  constructor(data: Record<string, T>) {
    for (const key in this)
      this[key] = data[key];
  }
}
