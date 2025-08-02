import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  showToast(message: string, icon: SweetAlertIcon = 'success'): void {
    Swal.fire({
      toast: true,
      position: 'top-right',
      customClass: {
        popup: 'colored-toast',
      },
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      icon: icon,
      title: message,
    });
  }

  showErrorToast(message: string): void {
    this.showToast(message, 'error');
  }

  showSuccessToast(message: string): void {
    this.showToast(message, 'success');
  }

  showWarningToast(message: string): void {
    this.showToast(message, 'warning');
  }

  showInfoToast(message: string): void {
    this.showToast(message, 'info');
  }

  showTransactionError(error: any): void {
    let message = 'Erro ao processar transação';
    
    if (error?.error?.message) {
      message = error.error.message;
    } else if (error?.message) {
      message = error.message;
    } else if (error?.status) {
      switch (error.status) {
        case 400:
          message = 'Dados da transação inválidos. Verifique as informações e tente novamente.';
          break;
        case 401:
          message = 'Sessão expirada. Faça login novamente.';
          break;
        case 403:
          message = 'Sem permissão para criar transações.';
          break;
        case 404:
          message = 'Serviço de transações não encontrado.';
          break;
        case 422:
          message = 'Dados da transação inválidos. Verifique o valor e a descrição.';
          break;
        case 500:
          message = 'Erro interno do servidor. Tente novamente em alguns instantes.';
          break;
        case 0:
          message = 'Erro de conexão. Verifique sua internet e tente novamente.';
          break;
        default:
          message = 'Erro inesperado. Tente novamente.';
      }
    }

    this.showErrorToast(message);
  }

  showUploadError(error: any): void {
    let message = 'Erro ao enviar anexo';
    
    if (error?.error?.message) {
      message = error.error.message;
    } else if (error?.message) {
      message = error.message;
    } else if (error?.status) {
      switch (error.status) {
        case 400:
          message = 'Arquivo inválido. Verifique o formato e tamanho.';
          break;
        case 413:
          message = 'Arquivo muito grande. Tamanho máximo: 10MB.';
          break;
        case 415:
          message = 'Formato de arquivo não suportado.';
          break;
        default:
          message = 'Erro ao enviar anexo. Tente novamente.';
      }
    }

    this.showWarningToast(message);
  }

  showValidationError(field: string): void {
    const messages: { [key: string]: string } = {
      'type': 'Selecione o tipo de transação',
      'amount': 'Informe um valor válido',
      'description': 'Adicione uma descrição para a transação',
      'date': 'Selecione uma data válida',
      'category': 'Selecione uma categoria',
      'file': 'Arquivo inválido ou muito grande'
    };

    const message = messages[field] || 'Campo obrigatório';
    this.showWarningToast(message);
  }

  showConfirmation(title: string, message: string): Promise<any> {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#009688',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    });
  }
}
