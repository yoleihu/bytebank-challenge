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
  isSubmitting = false;
  private descriptionChangeSubject = new Subject<string>();

  showTypeError = false;
  showAmountError = false;
  showDescriptionError = false;
  showDateError = false;
  showFileError = false;

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

  onTypeChange() {
    this.showTypeError = false;
  }

  onAmountChange(value: any) {
    this.amount = value;
    this.showAmountError = false;
  }

  onDescriptionBlur() {
    this.showDescriptionError = false;
  }

  onDateChange() {
    this.showDateError = false;
  }

  isFormValid(): boolean {
    return !!(this.transactionType &&
      this.amount !== null &&
      this.amount > 0 &&
      this.description.trim() &&
      !this.showDateError);
  }

  resetForm(): void {
    this.transactionType = null;
    this.amount = null;
    this.description = '';
    this.category = '';
    this.transactionDate = null;
    this.selectedFile = null;
    this.selectedFileName = null;

    this.showTypeError = false;
    this.showAmountError = false;
    this.showDescriptionError = false;
    this.showDateError = false;
    this.showFileError = false;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.showFileError = false;

    if (file) {
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        this.showFileError = true;
        this.notificationService.showValidationError('file');
        event.target.value = ''; // Limpar input
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        this.showFileError = true;
        this.notificationService.showWarningToast('Formato de arquivo não suportado. Use: JPG, PNG, GIF, PDF ou TXT');
        event.target.value = '';
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.notificationService.showInfoToast(`Arquivo "${file.name}" selecionado`);
    } else {
      this.selectedFile = null;
      this.selectedFileName = null;
    }
  }

  submitTransaction(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

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
          this.isSubmitting = false;
          this.notificationService.showSuccessToast('Transação criada com sucesso!');
          
          // Verificar se a resposta tem a estrutura esperada
          const createdTransaction = response.result || response;
          console.log('Transação criada:', createdTransaction);

          if (this.selectedFile && createdTransaction.id) {
            console.log('Iniciando upload do anexo para transação ID:', createdTransaction.id);
            this.transactionService
              .uploadAttachment(createdTransaction.id, this.selectedFile)
              .subscribe({
                next: (uploadResponse) => {
                  console.log('Upload do anexo realizado com sucesso:', uploadResponse);
                  this.notificationService.showInfoToast('Anexo enviado com sucesso!');
                  this.selectedFile = null;
                  this.selectedFileName = null;
                  this.resetForm();
                },
                error: (err) => {
                  console.error('Erro no upload do anexo:', err);
                  this.notificationService.showUploadError(err);
                  this.resetForm();
                },
              });
          } else {
            this.resetForm();
          }
        },
        error: (err) => {
          console.error('Erro ao criar transação:', err);
          this.isSubmitting = false;
          this.notificationService.showTransactionError(err);
        },
      });
    }
  }

  private validateForm(): boolean {
    let isValid = true;

    if (!this.transactionType) {
      this.showTypeError = true;
      this.notificationService.showValidationError('type');
      isValid = false;
    }

    if (this.amount === null || this.amount <= 0) {
      this.showAmountError = true;
      this.notificationService.showValidationError('amount');
      isValid = false;
    }

    if (!this.description.trim()) {
      this.showDescriptionError = true;
      this.notificationService.showValidationError('description');
      isValid = false;
    }

    if (this.transactionDate && this.transactionDate > new Date()) {
      this.showDateError = true;
      this.notificationService.showWarningToast('A data da transação não pode ser futura');
      isValid = false;
    }

    if (this.selectedFile) {
      const maxSize = 10 * 1024 * 1024;
      if (this.selectedFile.size > maxSize) {
        this.showFileError = true;
        this.notificationService.showValidationError('file');
        isValid = false;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
      if (!allowedTypes.includes(this.selectedFile.type)) {
        this.showFileError = true;
        this.notificationService.showWarningToast('Formato de arquivo não suportado. Use: JPG, PNG, GIF, PDF ou TXT');
        isValid = false;
      }
    }

    return isValid;
  }
}
