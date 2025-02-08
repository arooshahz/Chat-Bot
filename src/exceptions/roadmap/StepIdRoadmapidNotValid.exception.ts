import { BaseException } from "src/exceptions/base.exceptions";

export default class StepIdRoadmapidNotValidException extends BaseException {
    constructor(message = 'the step not belongs to the roadmap', data = {}) {
      super(message);
      this.data = data;
      this.statusCode = 401;
    }
  }