import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://edu-master-delta.vercel.app';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ token: token || '' });
    return this.http.get<any[]>(`${this.apiUrl}/admin/all-user`, { headers });
  }
}
