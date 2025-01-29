import { BaseException } from "src/exceptions/base.exceptions";

export default class UserRoadmapExistsException extends BaseException {
    constructor(message = 'you already enrolled in this roadmap!', data = {}) {
      super(message);
      this.data = data;
      this.statusCode = 400;
    }
  }