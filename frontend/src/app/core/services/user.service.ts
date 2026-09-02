import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly authService = inject(AuthService);

  /**
   * Access the reactive current user signal from AuthService
   */
  readonly currentUser = this.authService.currentUser;

  /**
   * Refreshes the user profile from the backend
   */
  fetchCurrentUser(): Observable<User> {
    return this.authService.getMe();
  }
}
