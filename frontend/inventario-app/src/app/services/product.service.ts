
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  stock: number;

}

export interface PagedResponse {
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  items: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:5232/api/products'; 

  constructor(private http: HttpClient) { }


getProducts(page: number, pageSize: number, filters?: any): Observable<PagedResponse> {
      let params = new HttpParams()
        .set('pageNumber', page.toString())
        .set('pageSize', pageSize.toString());


      if (filters) {
        if (filters.nombre) {
          params = params.append('nombre', filters.nombre);
        }
        if (filters.categoria) {
          params = params.append('categoria', filters.categoria);
        }
      }

      return this.http.get<PagedResponse>(this.apiUrl, { params });
    }

deleteProduct(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
}

getAllProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/all`);
}

getProductById(id: number): Observable<Product> {
  const url = `${this.apiUrl}/${id}`;
  return this.http.get<Product>(url);
}

createProduct(product: Product): Observable<Product> {
  return this.http.post<Product>(this.apiUrl, product);
}


updateProduct(id: number, product: Product): Observable<void> {
  const url = `${this.apiUrl}/${id}`;
  return this.http.put<void>(url, product);
}
}