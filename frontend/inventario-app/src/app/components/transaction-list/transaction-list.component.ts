import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction, TransactionService } from '../../services/transaction.service';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; 


@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  currentPage = 1;
  pageSize = 10;
  totalTransactions = 0;

  constructor(private transactionService: TransactionService, private toastr: ToastrService ) { }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getTransactions(this.currentPage, this.pageSize).subscribe(response => {
      this.transactions = response.items;
      this.totalTransactions = response.totalCount;
    });
  }

  deleteTransaction(id: number): void {
      if (confirm('¿Estás seguro de que deseas eliminar esta transacción? Esta acción afectará el stock del producto.')) {
        this.transactionService.deleteTransaction(id).subscribe({
          next: () => {
            this.toastr.success('Transacción eliminada y stock revertido.');
            this.loadTransactions();
          },
          error: (err) => this.toastr.error(err.error || 'Error al eliminar la transacción.')
        });
      }
    }


}