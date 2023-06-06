export const createErrorFactory = (name: string) =>
  class AppErrors extends Error {
    constructor(message: string) {
      super(message);
      this.name = name;
    }
  };
