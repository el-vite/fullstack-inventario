import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TransactionService } from '../../services/transaction.service';
import { Product, ProductService } from '../../services/product.service'; 

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-form.component.html'
})
export class TransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  products: Product[] = [];
   isEditMode = false;
    transactionId: number | null = null;


  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    public router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private productService: ProductService,
  ) {
    this.transactionForm = this.fb.group({
      productoID: ['', Validators.required],
      tipoTransaccion: ['Venta', Validators.required], 
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, Validators.required]
    });
  }

  ngOnInit(): void {
     this.productService.getAllProducts().subscribe(data => this.products = data);
        

        this.transactionId = Number(this.route.snapshot.paramMap.get('id'));
        if (this.transactionId) {
            this.isEditMode = true;
            this.transactionService.getTransactionById(this.transactionId).subscribe(tx => {
                this.transactionForm.patchValue(tx);
            });
        }
  }

onSubmit(): void {
  if (this.transactionForm.invalid) {
    this.toastr.error('Por favor, completa todos los campos requeridos.', 'Error');
    return;
  }

  const formValue = this.transactionForm.value;

  if (this.isEditMode && this.transactionId) {


    const selectedProduct = this.products.find(p => p.id == formValue.productoID);
    if (!selectedProduct) {
      this.toastr.error('El producto seleccionado no es válido.', 'Error');
      return;
    }


    const transactionData = {
      id: this.transactionId,
      productoID: formValue.productoID,
      tipoTransaccion: formValue.tipoTransaccion,
      cantidad: formValue.cantidad,
      precioUnitario: selectedProduct.precio,
      precioTotal: formValue.cantidad * selectedProduct.precio, 
      detalle: this.transactionForm.value.detalle || null
    };

    this.transactionService.updateTransaction(this.transactionId, transactionData).subscribe({
      next: () => {

        this.toastr.success('Transacción actualizada con éxito', 'Éxito');
        this.router.navigate(['/transactions']); 
      },
      error: (err) => {
        this.toastr.error(err.error || 'Error al actualizar la transacción', 'Error');
      }
    });

  } else {

    const selectedProduct = this.products.find(p => p.id == formValue.productoID);
    if (!selectedProduct) {
      this.toastr.error('Producto seleccionado no es válido.');
      return;
    }

    const transactionData = {
      ...formValue,
      precioUnitario: selectedProduct.precio,
      precioTotal: formValue.cantidad * selectedProduct.precio
    };

    this.transactionService.createTransaction(transactionData).subscribe({
      next: () => {
        this.toastr.success('Transacción registrada con éxito');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.toastr.error(err.error || 'Error al registrar la transacción');
      }
    });
  }
}
}