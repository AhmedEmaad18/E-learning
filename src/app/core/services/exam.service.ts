import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExamService {
  private apiUrl = 'https://edu-master-delta.vercel.app';

  constructor(private http: HttpClient) {}

  getAllExams(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ token: token || '' });
    return this.http.get<any[]>(`${this.apiUrl}/exam`, { headers });
  }
}
