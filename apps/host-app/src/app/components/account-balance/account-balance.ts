import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TransactionService } from '@core/services/transaction';
import { Transaction } from '@shared/models';

@Component({
  selector: 'app-account-balance',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './account-balance.html',
  styleUrl: './account-balance.scss',
  providers: [CurrencyPipe, DatePipe],
})
export class AccountBalance implements OnInit {
  transactionService = inject(TransactionService);
  
  balance = 0;
  showBalance = true;
  ngOnInit(): void {
    this.loadBalance();

    this.transactionService.transactionsChanged$.subscribe(() => {
      this.loadBalance();
    });
  }

  // private loadBalance(): void {
  //   this.transactionService.getTransactions().subscribe((transactions: Transaction[]) => {
  //     this.balance = transactions.reduce((total, t) => {
  //       const amount = Number(t.amount);
  //       return t.type === 'income' ? total + amount : total - amount;
  //     }, 0);
  //   });
  // }

  private loadBalance(): void {
    this.transactionService.getBalance().subscribe((response: any) => {
      this.balance = response.result.balance;
    });
  }

  toggleBalanceVisibility(): void {
    this.showBalance = !this.showBalance;
  }

  get formattedCurrentDate(): string {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }
}
