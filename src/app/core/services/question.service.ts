import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from '../../admin/dashboard-admin/manage-exams/questions/editquestion/editquestion.component';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'https://edu-master-delta.vercel.app/question';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      token,
      'Content-Type': 'application/json'
    });
  }

  getAllQuestions(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  getQuestionById(id: string): Observable<any> {
    return this.http.get<{ data: Question }>(`${this.apiUrl}/get/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createQuestion(question: any): Observable<any> {
    return this.http.post(this.apiUrl, question, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteQuestion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
 updateQuestion(id: string, question: any) {
  return this.http.put<{ message: string; success: boolean; data: any }>(
    `${this.apiUrl}/${id}`,
    question,
    { headers: this.getAuthHeaders() }
  );
}


}
