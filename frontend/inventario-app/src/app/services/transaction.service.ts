
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Transaction {
  id: number;
  fecha: string;
  tipoTransaccion: string;
  productoID: number;
  cantidad: number;
  precioUnitario: number;
  precioTotal: number;
}


export interface PagedTransactionResponse {
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  items: Transaction[];
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiUrl = 'http://localhost:5089/api/transactions'; 

  constructor(private http: HttpClient) { }


  getTransactions(page: number, pageSize: number): Observable<PagedTransactionResponse> {
    const url = `${this.apiUrl}?pageNumber=${page}&pageSize=${pageSize}`;
    return this.http.get<PagedTransactionResponse>(url);
  }


  createTransaction(transaction: any): Observable<Transaction> {
  return this.http.post<Transaction>(this.apiUrl, transaction);
}

 getTransactionById(id: number): Observable<Transaction> {
      return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
    }

    updateTransaction(id: number, transaction: any): Observable<void> {
      return this.http.put<void>(`${this.apiUrl}/${id}`, transaction);
    }

    deleteTransaction(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}