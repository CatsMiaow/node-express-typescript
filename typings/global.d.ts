// https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html

declare global {
    namespace Animal {
      interface Cat {
        feature: string;
      }
    }

    interface Human {
      body: string;
    }
}

export { };
