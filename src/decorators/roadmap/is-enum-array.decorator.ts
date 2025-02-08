import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsEnumArray(enumType: any, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEnumArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [enumType],
      validator: {
        validate(value: any[], args: ValidationArguments) {
          const enumValues = Object.values(args.constraints[0]);
          return Array.isArray(value) && value.every(val => enumValues.includes(val));
        },
        defaultMessage(args: ValidationArguments) {
          const enumValues = Object.values(args.constraints[0]).join(', ');
          return `${args.property} must be an array of valid enum values: ${enumValues}`;
        }
      }
    });
  };
}
