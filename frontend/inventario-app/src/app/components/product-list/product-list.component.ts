
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
   ReactiveFormsModule
  ], 
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = []; 
  currentPage = 1;
  pageSize = 5;
  totalProducts = 0;

  filterForm: FormGroup;

  Math = Math;
  constructor(private productService: ProductService,private toastr: ToastrService,private fb: FormBuilder ) {
    this.filterForm = this.fb.group({
      nombre: [''],
      categoria: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

   onFilter(): void {
    this.currentPage = 1; 
    this.loadProducts();
  }

   clearFilters(): void {
    this.filterForm.reset({ nombre: '', categoria: '' });
    this.currentPage = 1;
    this.loadProducts();
  }

  loadProducts(): void {
    const filters = this.filterForm.value;

    this.productService.getProducts(this.currentPage, this.pageSize, filters)
    .subscribe(response => {
      this.products = response.items;
      this.totalProducts = response.totalCount;
    });


  }

deleteProduct(id: number): void {
    const confirmDelete = confirm(`¿Seguro que deseas eliminar el producto ID: ${id}?`);
    if (confirmDelete) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.toastr.success('Producto eliminado con éxito', 'Éxito');
          this.loadProducts(); // Recarga la página actual de productos
        },
        error: (err) => {
          this.toastr.error('Hubo un error al eliminar el producto', 'Error');
        }
      });
    }
  }

  nextPage(): void {
    this.currentPage++;
    this.loadProducts();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }
}