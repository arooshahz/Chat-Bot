import { BaseException } from "src/exceptions/base.exceptions";

export default class RoadmapRefrenceNotFoundException extends BaseException {
    constructor(message = 'Roadmap Refrence Not Found', data = {}) {
      super(message);
      this.data = data;
      this.statusCode = 404;
    }
  }