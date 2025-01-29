export class BaseException extends Error {
    protected statusCode = 400;
    protected data = {};
    protected sentry = false;
  
    constructor(message) {
      super(message);
    }
  
    shouldSendToSentry() {
      return this.sentry;
    }
  
    getErrorMessage() {
      return this.message;
    }
  
    getErrorCode() {
      return this.statusCode;
    }
  
    getErrorData() {
      return this.data;
    }
  }