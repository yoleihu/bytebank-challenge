import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { loadBalance } from '../../state/balance/actions';
import { selectBalance, selectBalanceLoading } from '../../state/balance/selectors'; // ajuste o caminho se necessário

@Component({
  selector: 'app-account-balance',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './account-balance.html',
  styleUrl: './account-balance.scss',
  providers: [CurrencyPipe, DatePipe],
})
export class AccountBalance implements OnInit {
  private store = inject(Store);

  balance$ = this.store.select(selectBalance);
  loading$ = this.store.select(selectBalanceLoading);
  showBalance = true;

  ngOnInit(): void {
    this.store.dispatch(loadBalance());
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
