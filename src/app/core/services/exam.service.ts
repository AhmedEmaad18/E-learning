import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, ExamResult, ExamStatusResponse, ExamSubmitResponse, StudentExam, StudentExamStartResponse } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private baseUrl = 'https://edu-master-delta.vercel.app/exam';
  private studentExamBaseUrl = 'https://edu-master-delta.vercel.app/studentExam';
 private apiUrl = 'https://edu-master-delta.vercel.app';


  getAllExams(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ token: token || '' });
    return this.http.get<any[]>(`${this.apiUrl}/exam`, { headers });
  }
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token =
     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp0MTExN0BmYXlvdW0uZWR1LmVnIiwiX2lkIjoiNjg3Y2I4NjM3N2ZlOGI0NzUzZGJkY2M2IiwiaWF0IjoxNzUzMjY3NzEzLCJleHAiOjE3NTMzNTQxMTN9.raydnHdoAG6LgzVrbUAnKQcwEP7tBMg76VAHtgvpv68';
    if (token) {
      return new HttpHeaders({
        token: token,
      });
    }
    return new HttpHeaders();
  }

  getExams(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.baseUrl, { headers: this.getHeaders() });
  }

  startExam(examId: string): Observable<ApiResponse<StudentExamStartResponse>> {
    return this.http.post<ApiResponse<StudentExamStartResponse>>(
      `${this.studentExamBaseUrl}/start/${examId}`,
      null,
      { headers: this.getHeaders() }
    );
  }

  submitExam(
    studentExamId: string,
    answers: { questionId: string; selectedAnswer: string }[]
  ): Observable<ApiResponse<ExamSubmitResponse>> {
    return this.http.post<ApiResponse<ExamSubmitResponse>>(
      `${this.studentExamBaseUrl}/submit/${studentExamId}`,
      { answers },
      { headers: this.getHeaders() }
    );
  }

  getExamById(examId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/get/${examId}`, {
      headers: this.getHeaders(),
    });
  }
getStudentExam(studentExamId: string): Observable<ApiResponse<ExamResult>> {
  return this.http.get<ApiResponse<ExamResult>>(`${this.studentExamBaseUrl}/score/${studentExamId}`, {
    headers: this.getHeaders(),
  });
}


  getExamScoreStudent(studentExamId: string): Observable<any> {
  return this.http.get<any>(`${this.studentExamBaseUrl}/exams/score/${studentExamId}`, {
    headers: this.getHeaders(),
  });
}


getAllStudentExams(): Observable<ApiResponse<StudentExam[]>> {
  return this.http.get<ApiResponse<StudentExam[]>>(
    `${this.studentExamBaseUrl}`,
    { headers: this.getHeaders() }
  );
}


  checkIfSubmitted(examId: string): Observable<{ success: boolean }> {
    return this.http.get<{ success: boolean }>(
      `${this.studentExamBaseUrl}/submit/${examId}`,
      { headers: this.getHeaders() }
    );
  }

  checkStudentExamStatus(examId: string): Observable<ExamStatusResponse> {
    return this.http.get<ExamStatusResponse>(
      `${this.studentExamBaseUrl}/status/${examId}`,
      { headers: this.getHeaders() }
    );
  }

  // Updated method: requires dummyAnswer with questionId and selectedAnswer to avoid errors
  checkExamSubmissionStatus(
  examId: string,
  answers: { questionId: string; selectedAnswer: string }[]
): Observable<{ success: boolean; message: string }> {
  return this.http.post<{ success: boolean; message: string }>(
    `${this.studentExamBaseUrl}/submit/${examId}`,
    { answers }, // must send answers as array with at least one valid answer
    { headers: this.getHeaders() }
  );
}


}
