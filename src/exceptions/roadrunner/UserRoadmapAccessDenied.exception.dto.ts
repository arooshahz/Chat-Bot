import { BaseException } from "src/exceptions/base.exceptions";

export default class UserRoadmapAccessDeniedException extends BaseException {
    constructor(message = 'You do not have access to action on this entity', data = {}) {
      super(message);
      this.data = data;
      this.statusCode = 403;
    }
  }