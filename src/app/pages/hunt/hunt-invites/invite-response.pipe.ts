import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inviteResponse',
  standalone: true,
})
export class InviteResponsePipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'NO_RESPONSE':
        return 'No response';
      case 'ACCEPT':
        return 'Accepted';
      case 'REFUSE':
        return 'Refused';
      default:
        return value;
    }
  }
}
