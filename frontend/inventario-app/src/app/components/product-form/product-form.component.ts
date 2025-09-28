import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Importaciones clave para formularios
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute, // Para leer el :id de la URL
    public  router: Router,       // Para navegar a otra página
    private toastr: ToastrService
  ) {
    // Inicializa el formulario con sus campos y validaciones
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      categoria: [''],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productId) {
      this.isEditMode = true;
      this.loadProductData(this.productId);
    }
  }

  loadProductData(id: number): void {
    this.productService.getProductById(id).subscribe(product => {
      this.productForm.patchValue(product);
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.toastr.error('Por favor, completa todos los campos requeridos.', 'Error de Validación');
      return;
    }

    const productData = {
      id: this.productId,
      ...this.productForm.value
    };

    if (this.isEditMode && this.productId) {

      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          this.toastr.success('Producto actualizado con éxito', 'Éxito');
          this.router.navigate(['/products']); 
        },
        error: () => this.toastr.error('Error al actualizar el producto', 'Error')
      });
    } else {

      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.toastr.success('Producto creado con éxito', 'Éxito');
          this.router.navigate(['/products']); // Vuelve a la lista
        },
        error: () => this.toastr.error('Error al crear el producto', 'Error')
      });
    }
  }
}