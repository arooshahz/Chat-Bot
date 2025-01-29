import { BaseException } from "src/exceptions/base.exceptions";

export default class StepNotFoundException extends BaseException {
    constructor(message = 'Step Not Found', data = {}) {
      super(message);
      this.data = data;
      this.statusCode = 404;
    }
  }