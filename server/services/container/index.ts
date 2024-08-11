import type { ServiceContainer } from "./interface";

export class Container implements ServiceContainer {
  private services: Map<symbol, any> = new Map();
  private getServiceKey<T>(ServiceClass: new (...args: any[]) => T): symbol {
    return Symbol.for(ServiceClass.name);
  }

  registerService<T extends object>(service: T): void {
    const constructor = service.constructor as new (...args: any[]) => T;
    const key = this.getServiceKey(constructor);
    if (!this.services.has(key)) {
      this.services.set(key, service);
    }
  }

  getService<T>(ServiceClass: new (...args: any[]) => T): T {
    const key = this.getServiceKey(ServiceClass);
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service ${ServiceClass.name} not found`);
    }
    return service as T;
  }

  hasService<T>(ServiceClass: new (...args: any[]) => T): boolean {
    const key = this.getServiceKey(ServiceClass);
    return this.services.has(key);
  }
}
