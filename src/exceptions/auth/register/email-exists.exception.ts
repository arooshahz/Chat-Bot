import { BaseException } from "src/exceptions/base.exceptions";

export default class EmailExistsException extends BaseException {
    constructor(message = 'This email is already registered.', data = {}) {
      super(message);
      this.data = data;
      this.statusCode = 400;
    }
  }