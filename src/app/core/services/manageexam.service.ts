import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse, ExamDetails } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class ManageexamService {
  private apiUrl = 'https://edu-master-delta.vercel.app/exam';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      token: token,
      'Content-Type': 'application/json',
    });
  }

  getAllExams(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}`, {
    headers: this.getAuthHeaders(),
  });
}
addExam(data: ExamDetails): Observable<ApiResponse<ExamDetails>> {
    return this.http.post<ApiResponse<ExamDetails>>(this.apiUrl, data, {
      headers: this.getAuthHeaders(),
    });
  }

getScoresByExamId(examId: string): Observable<any> {
  return this.http.get<any>(`https://edu-master-delta.vercel.app/studentExam/exams/${examId}`, {
    headers: this.getAuthHeaders(),
  });
}

  getExamById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  updateExam(id: string, data: Partial<ExamDetails>): Observable<ApiResponse<ExamDetails>> {
  return this.http.put<ApiResponse<ExamDetails>>(`${this.apiUrl}/${id}`, data, {
    headers: this.getAuthHeaders(),
  });
}


  deleteExam(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
