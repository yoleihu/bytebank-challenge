import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
interface CategorySuggestion {
  detectedCategory: string;
  suggestions: string[];
  description: string;
  type: string;
}

interface CategorySuggestionResponse {
  message: string;
  result: CategorySuggestion;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = environment.apiUrl;
  private transactionsChanged = new Subject<void>();

  private http = inject(HttpClient);

  transactionsChanged$ = this.transactionsChanged.asObservable();

  getTransactions(): Observable<any> {
    const userId = localStorage.getItem('userId');
    const url = `${this.apiUrl}/user/${userId}/statement`;
    return this.http.get(url); 
  }

}
