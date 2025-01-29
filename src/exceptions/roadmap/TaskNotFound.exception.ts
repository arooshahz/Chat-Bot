import { BaseException } from "src/exceptions/base.exceptions";

export default class TaskNotFoundException extends BaseException {
    constructor(message = 'Task Not Found!', data = {}) {
      super(message);
      this.data = data;
      this.statusCode = 404;
    }
  }