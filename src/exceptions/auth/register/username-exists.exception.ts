import { BaseException } from "src/exceptions/base.exceptions";

export default class UsernameExistsException extends BaseException {
    constructor(message = 'this username registered before :(', data = {}) {
      super(message);
      this.data = data;
      this.statusCode = 400;
    }
  }