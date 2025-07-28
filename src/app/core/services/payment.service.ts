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
}
