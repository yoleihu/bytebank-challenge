import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth';
import { NotificationService } from '@shared/services/notification';
import { EMPTY } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const notificationService = inject(NotificationService);

  //@to do validar exibição de toast para token expirado
  if (!auth.isAuthenticated() && !req.url.includes('user/auth') && !req.url.includes('user')) {
    notificationService.showToast('Sessão expirada', 'error');
    auth.logout();
    return EMPTY
  }

  const token = localStorage.getItem('authToken');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  } else {
    req = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  return next(req);
};
