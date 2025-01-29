import { BaseException } from "src/exceptions/base.exceptions";

export default class VisibilityRistrictionException extends BaseException {
    constructor(message = 'only me visibility allowed', data = {}) {
      super(message);
      this.data = data;
      this.statusCode = 403;
    }
  }