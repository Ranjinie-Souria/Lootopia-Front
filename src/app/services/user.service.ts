import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { UrlMapping } from '../config/api.config';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = environment.apiUrl + UrlMapping.USERS;
  private readonly http = inject(HttpClient);

  private userSubject = new BehaviorSubject<any | null>(null);
  public user$ = this.userSubject.asObservable();

  public setUser(user: any) {
    this.userSubject.next(user);
  }

  public getUser(): any | null {
    return this.userSubject.value;
  }

  // Get all users
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Get a user by ID
  getUserById(id: string): Observable<any> {
    console.log('Fetching user with ID:', id);
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Create a new user
  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, user);
  }

  // Update an existing user
  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  // Delete a user
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
