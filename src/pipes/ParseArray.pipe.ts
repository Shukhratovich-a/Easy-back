import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseArrayPipe implements PipeTransform<unknown> {
  transform(value: unknown) {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      const array = value.map((item) => item.split(' ').join(''));

      return array;
    }

    if (typeof value === 'string') {
      const array = value.split(',').map((item) => item.split(' ').join(''));

      return array;
    }

    return value;
  }
}
