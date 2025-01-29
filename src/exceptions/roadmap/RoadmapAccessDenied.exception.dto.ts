import { BaseException } from "src/exceptions/base.exceptions";

export default class RoadmapAccessDeniedException extends BaseException {
    constructor(message = 'You do not have access to this roadmap', data = {}) {
      super(message);
      this.data = data;
      this.statusCode = 403;
    }
  }