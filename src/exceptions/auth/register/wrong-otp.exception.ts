import { BaseException } from "src/exceptions/base.exceptions";

export default class WrongOtpException extends BaseException {
    constructor(message = 'Invalid OTP code. Please try again.', data = {}) {
      super(message);
      this.data = data;
      this.statusCode = 400;
    }
  }