import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { TransactionService } from '@core/services/transaction';
import { MatCardModule } from '@angular/material/card';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { UserService } from '@core/services/user';
import { Transaction } from '@shared/models';
import { NotificationService } from '@shared/services/notification';

import { LOCALE_ID } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

registerLocaleData(localePt);

@Component({
  selector: 'app-new-transaction',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    NgxMaskDirective,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  providers: [
    provideNgxMask(),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
  templateUrl: './new-transaction.html',
  styleUrl: './new-transaction.scss',
})
export class NewTransaction {
  userID = (inject(UserService) as UserService).loggedInUser?.id ?? 0;
  accountID = (inject(UserService) as UserService).loggedInUser?.id ?? 0; //alterar
  transactionService = inject(TransactionService);
  notificationService = inject(NotificationService);

  transactionType: 'Received' | 'Sent' | null = null;
  amount: number | null = null;
  description = '';
  category = '';
  transactionDate: Date | null = null;

  selectedFileName: string | null = null;
  private selectedFile: File | null = null;
  isLoadingCategory = false;
  private descriptionChangeSubject = new Subject<string>();

  constructor() {
    // Configurar debounce para busca de categoria
    this.descriptionChangeSubject
      .pipe(
        debounceTime(500), // Aguarda 500ms após o usuário parar de digitar
        distinctUntilChanged(), // Só executa se o valor mudou
        switchMap(description => {
          if (description.trim() && this.transactionType) {
            this.isLoadingCategory = true;
            const type = this.transactionType === 'Received' ? 'income' : 'expense';
            return this.transactionService.getCategorySuggestions(description.trim(), type);
          }
          return [];
        })
      )
      .subscribe({
        next: (response) => {
          this.isLoadingCategory = false;
          if (response?.result?.detectedCategory) {
            this.category = response.result.detectedCategory;
          }
        },
        error: (error) => {
          this.isLoadingCategory = false;
          console.error('Erro ao buscar categoria:', error);
        }
      });
  }

  onDescriptionChange() {
    this.descriptionChangeSubject.next(this.description);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    } else {
      this.selectedFile = null;
      this.selectedFileName = null;
    }
  }

  submitTransaction(): void {
    if (this.transactionType && this.amount !== null && this.description.trim()) {
      const transaction: Transaction = {
        accountId: localStorage.getItem('accountId') ?? '0',
        type: this.transactionType === 'Received' ? 'income' : 'expense',
        amount: Number(this.amount),
        date: this.transactionDate?.toISOString() ?? new Date().toISOString(),
        description: this.description.trim(),
        category: this.category || 'Outros',
        account: 'Bank Account',
      };

      this.transactionService.createTransaction(transaction).subscribe({
        next: (response: any) => {
          this.notificationService.showToast('Transação criada com sucesso!', 'success');
          this.transactionType = null;
          this.amount = null;
          this.description = '';
          this.category = '';
          this.transactionDate = null;
          const createdTransaction = response.result;

          if (this.selectedFile && createdTransaction.id) {
            console.log('Enviando anexo...');
            this.transactionService
              .uploadAttachment(createdTransaction.id, this.selectedFile)
              .subscribe({
                next: () => {
                  console.log('Anexo enviado com sucesso!');
                  this.selectedFile = null;
                  this.selectedFileName = null;
                },
                error: (err) => {
                  console.error('Erro ao enviar anexo:', err);
                },
              });
          } else {
            console.log('Transação criada sem anexo.');
          }
        },
        error: (err) => {
          console.error('Erro ao criar transação:', err);
        },
      });
    }
  }
}
