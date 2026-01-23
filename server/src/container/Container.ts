export class Container {
  private services: Map<string, any> = new Map();
  private singletons: Map<string, any> = new Map();

  register(key: string, factory: () => any): void {
    if (this.services.has(key)) {
      throw new Error(`Serviço ${key} já registrado`);
    }
    this.services.set(key, factory);
  }

  registerSingleton(key: string, factory: () => any): void {
    if (this.singletons.has(key)) {
      throw new Error(`Singleton ${key} já registrado`);
    }
    this.register(key, () => {
      if (!this.singletons.has(key)) {
        this.singletons.set(key, factory());
      }
      return this.singletons.get(key);
    });
  }

  get<T = any>(key: string): T {
    const factory = this.services.get(key);
    if (!factory) {
      throw new Error(`Serviço ${key} não encontrado`);
    }
    return factory();
  }

  has(key: string): boolean {
    return this.services.has(key);
  }
}