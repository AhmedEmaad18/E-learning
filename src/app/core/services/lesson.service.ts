import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lesson } from '../models/model';

@Injectable({ providedIn: 'root' })
export class LessonService {
  private apiUrl = 'https://edu-master-delta.vercel.app/lesson';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ token });
  }

  getAllLessons(): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  getLessonById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  addLesson(lesson: Lesson): Observable<any> {
    return this.http.post(this.apiUrl, lesson, {
      headers: this.getAuthHeaders(),
    });
  }

  updateLesson(id: string, lesson: Lesson): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, lesson, {
      headers: this.getAuthHeaders(),
    });
  }
  
  deleteLesson(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
