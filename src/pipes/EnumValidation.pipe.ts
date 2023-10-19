import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

export interface EnumValidationPipeOptions<T> {
  defaultValue?: T;
  required?: boolean;
}

@Injectable()
export class EnumValidationPipe<T> implements PipeTransform<T> {
  constructor(
    private readonly enumType: Record<string, unknown>,
    private readonly options?: EnumValidationPipeOptions<T>,
  ) {}

  transform(value: unknown, metadata: ArgumentMetadata): T {
    if (this.options && this.options.required && !value) {
      throw new BadRequestException(`Value is required for ${metadata.data} field.`);
    }

    if (!value) {
      if (this.options && this.options.defaultValue !== undefined) {
        return this.options.defaultValue;
      } else {
        return value as T;
      }
    }

    if (!Object.values(this.enumType).includes(value)) {
      const errorMessage = `the value ${value} from field ${
        metadata.data
      } is not valid. Acceptable values: ${Object.values(this.enumType)}`;
      throw new BadRequestException(errorMessage);
    }

    return value as T;
  }
}
