import { BaseException } from "src/exceptions/base.exceptions";

export default class RoadmapNotFoundException extends BaseException {
    constructor(message = 'Roadmap Not Found', data = {}) {
      super(message);
      this.data = data;
      this.statusCode = 404;
    }
  }