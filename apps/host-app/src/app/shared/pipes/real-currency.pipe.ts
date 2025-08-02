import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'realCurrency',
  standalone: true
})
export class RealCurrencyPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value === null || value === undefined || value === '') return '';
    const numberValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.')) : value;
    return numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
