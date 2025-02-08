import { BaseException } from '../base.exceptions';

export default class PermissionDeniedException extends BaseException {
  constructor(message = 'Permission Denied.', data = {}) {
    super(message);
    this.data = data;
    this.statusCode = 403;
  }
}
