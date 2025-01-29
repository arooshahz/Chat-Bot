import { BaseException } from "src/exceptions/base.exceptions";

export default class InvalidCredentialException extends BaseException {
    constructor(message = 'Email not found or password incorrect. Please try again.', data = {}) {
      super(message);
      this.data = data;
      this.statusCode = 400;
    }
  }