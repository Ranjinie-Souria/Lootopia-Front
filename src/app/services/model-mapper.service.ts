import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class ModelMapperService {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  public user: User | null = null;

  mapTokenToUserModel(token: any): User {
    return {
      id: token.user.id,
      email: token.user.email,
      username: token.user.username ? token.user.username : '',
    };
  }
}
