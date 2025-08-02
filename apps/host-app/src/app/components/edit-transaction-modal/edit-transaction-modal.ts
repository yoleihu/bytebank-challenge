import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Transaction } from '@shared/models';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { MatIconModule } from '@angular/material/icon';

registerLocaleData(localePt);

@Component({
  selector: 'app-edit-transaction-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
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
  templateUrl: './edit-transaction-modal.html',
  styleUrl: './edit-transaction-modal.scss',
})
export class EditTransactionModal implements OnInit {
  editedTransaction!: Transaction;
  newFile: File | null = null;

  data = inject(MAT_DIALOG_DATA) as { transaction: Transaction };
  private dialogRef = inject(MatDialogRef<EditTransactionModal>) as MatDialogRef<EditTransactionModal, any>;

  ngOnInit() {
    this.editedTransaction = { ...this.data.transaction };
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.newFile = file;
    }
  }

  getAttachmentName(): string {
    if (this.newFile) {
      return this.newFile.name;
    }
    if (this.editedTransaction.anexo) {
      return this.editedTransaction.anexo.originalName || this.editedTransaction.anexo.filename;
    }
    return '';
  }

  submit() {
    this.dialogRef.close({ 
      transaction: this.editedTransaction, 
      file: this.newFile 
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
