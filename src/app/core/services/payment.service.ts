import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = 'https://edu-master-delta.vercel.app';

  constructor(private http: HttpClient) {}

  payment(lessonId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ token: token || '' });
    return this.http.post(
      `${this.apiUrl}/lesson/pay/${lessonId}`,
      {},
      { headers }
    );
  }

  // Get all purchased lessons for the current user
  getPurchasedLessons(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ token: token || '' });
    return this.http
      .get<any>(`${this.apiUrl}/lesson/my/purchased`, { headers })
      .pipe(map((res) => res.data));
  }

  // Sum the price of all purchased lessons for revenue
  getRevenueFromPurchasedLessons(): Observable<number> {
    return this.getPurchasedLessons().pipe(
      map((lessons) =>
        lessons
          .filter((l) => l.price)
          .reduce((sum, l) => sum + (l.price || 0), 0)
      ),
      catchError(() => of(0))
    );
  }

  // Get revenue from lessons with prices
  getRevenueFromLessons(): Observable<number> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ token: token || '' });
    return this.http.get<any>(`${this.apiUrl}/lesson`, { headers }).pipe(
      map((res) => {
        if (res && res.data && Array.isArray(res.data)) {
          return res.data
            .filter((lesson: any) => lesson.price && lesson.price > 0)
            .reduce((sum: number, lesson: any) => sum + (lesson.price || 0), 0);
        }
        return 0;
      }),
      catchError(() => of(0))
    );
  }
}
