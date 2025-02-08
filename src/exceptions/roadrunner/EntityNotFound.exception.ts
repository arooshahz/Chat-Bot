import { BaseException } from "src/exceptions/base.exceptions";

export default class EntityNotFoundException extends BaseException {
    constructor(message = 'Entity Not Found', data = {}) {
      super(message);
      this.data = data;
      this.statusCode = 404;
    }
  }