export interface ServiceContainer {
  registerService<T extends object>(service: T): void;
  getService<T>(ServiceClass: new (...args: any[]) => T): T;
  hasService<T>(ServiceClass: new (...args: any[]) => T): boolean;
}
