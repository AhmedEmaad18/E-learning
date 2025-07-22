import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  _id: string;
  email: string;
  fullName: string;
  classLevel?: string;
  role?: string;
  phoneNumber?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  classLevel: string;
  password: string;
  cpassword: string;
}

export interface PasswordUpdateRequest {
  oldPassword: string;
  newPassword: string;
  cpassword: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://edu-master-delta.vercel.app';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user && user !== 'undefined') {
      try {
        this.currentUserSubject.next(JSON.parse(user));
      } catch (e) {
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
      }
    }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { token }),
    });
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        map((response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          return response;
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/signup`, userData)
      .pipe(
        map((response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          return response;
        })
      );
  }

  getProfile(): Observable<User> {
    return this.http
      .get<any>(`${this.apiUrl}/user/`, { headers: this.getHeaders() })
      .pipe(
        map((response) => {
          const user = response.data;
          this.currentUserSubject.next(user);
          localStorage.setItem('user', JSON.stringify(user));
          return user;
        })
      );
  }

  updatePassword(passwordData: PasswordUpdateRequest): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/user/update-password`,
      passwordData,
      { headers: this.getHeaders() }
    );
  }

  updateProfile(
    userId: string,
    profileData: {
      fullName: string;
      email: string;
      phoneNumber: string;
      classLevel: string;
    }
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${userId}`, profileData, {
      headers: this.getHeaders(),
    });
  }

  forgotPassword(email: string) {
    return this.http.post<any>(`${this.apiUrl}/user/forgot-password`, {
      email,
    });
  }

  resetPassword(data: {
    email: string;
    otp: string;
    newPassword: string;
    cpassword: string;
  }) {
    return this.http.post<any>(`${this.apiUrl}/user/reset-password`, data);
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/`, {
      headers: this.getHeaders(),
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    let user = this.currentUserSubject.value;
    if (!user) {
      const userStr = localStorage.getItem('user');
      if (userStr && userStr !== 'undefined') {
        try {
          user = JSON.parse(userStr);
          this.currentUserSubject.next(user);
        } catch {
          user = null;
        }
      }
    }
    return user;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
