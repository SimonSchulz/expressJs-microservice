import { registerDecorator, ValidationOptions, ValidationArguments, IsNotEmpty } from 'class-validator';

interface IsFileOptions {
  mime: ('image/jpg' | 'image/png' | 'image/jpeg')[];
}

function IsFile(options: IsFileOptions, validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    return registerDecorator({
      name: 'isFile',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value?.mimetype && (options?.mime ?? []).includes(value?.mimetype)) {
            console.log('1' + value.mimetype)
            return true;
          }
          return false;
        },
      },
    });
  };
}

export default class UploadImageDto {
  @IsFile({ mime: ['image/jpg', 'image/png'] })
  @IsNotEmpty()
  file: any;
}

// export function IsLongerThan(property: string, validationOptions?: ValidationOptions) {
//   return function (object: Object, propertyName: string) {
//     registerDecorator({
//       name: 'isLongerThan',
//       target: object.constructor,
//       propertyName: propertyName,
//       constraints: [property],
//       options: validationOptions,
//       validator: {
//         validate(value: any, args: ValidationArguments) {
//           const [relatedPropertyName] = args.constraints;
//           const relatedValue = (args.object as any)[relatedPropertyName];
//           return typeof value === 'string' && typeof relatedValue === 'string' && value.length > relatedValue.length; // you can return a Promise<boolean> here as well, if you want to make async validation
//         },
//       },
//     });
//   };
// }

// export class Post {
//   title: string;

//   @IsLongerThan('title', {
//     /* you can also use additional validation options, like "groups" in your custom validation decorators. "each" is not supported */
//     message: 'Text must be longer than the title',
//   })
//   text: string;
// }
