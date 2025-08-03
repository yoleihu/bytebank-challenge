import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  BarController,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { TransactionService } from '../core/services/transaction';
import { CommonModule } from '@angular/common';

Chart.register(BarElement, ArcElement, CategoryScale, PieController, Title, LinearScale, BarController, Tooltip, Legend);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [ CommonModule ]
})
export class Dashboard implements AfterViewInit {
  @ViewChild('comparisonChart') comparisonRef!: ElementRef;
  @ViewChild('categoryChart') categoryRef!: ElementRef;
  @ViewChild('transferCategoryChart') transferCategoryRef!: ElementRef;
  @ViewChild('depositCategoryChart') depositCategoryRef!: ElementRef;
  draggedElementId: string = '';
  isDroppedHorizontally: boolean = false;

  constructor(private service: TransactionService) {}

  ngAfterViewInit() {
    this.service.getTransactions().subscribe((data: any) => {
      const transactions = data.result.transactions;

      this.montarGraficoDepositoTransferencia(transactions);
      this.graficoCategorias(transactions);
      this.graficoTransferenciasPorCategoria(transactions);
      this.graficoDepositosPorCategoria(transactions);

    })

  }

  montarGraficoDepositoTransferencia(transactions: any) {
    const monthGroups: Record<string, { income: number; expense: number }> = {};
    transactions.forEach((t: any) => {
      const date = new Date(t.date);
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });

      if (!monthGroups[month]) {
        monthGroups[month] = { income: 0, expense: 0 };
      }

      if (t.type === 'income') {
        monthGroups[month].income += t.amount;
      } else {
        monthGroups[month].expense += t.amount;
      }
    });

    const labels = Object.keys(monthGroups);
    const incomeValues = labels.map(label => monthGroups[label].income);
    const expenseValues = labels.map(label => monthGroups[label].expense);

    const ctx = this.comparisonRef.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Depósito',
            data: incomeValues,
            backgroundColor: '#66BB6A'
          },
          {
            label: 'Transferência',
            data: expenseValues,
            backgroundColor: 'rgba(255, 99, 132, 0.7)'
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (tickValue: string | number) {
                if (typeof tickValue === 'number') {
                  return new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(tickValue);
                }
                return tickValue;
              }
            }
          },
          x: { stacked: false }
        },
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const value = context.raw;
                return new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(value);
              }
            }
          },
          title: {
            display: true,
            text: 'Comparação de depósitos e transferências por mês',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          }
        }
      }
    });

  }

  graficoCategorias(transactions: any) {
    const categoryGroups: Record<string, number> = {};
    transactions.forEach((t: any) => {
      const category = t.category;
      categoryGroups[category] = (categoryGroups[category] || 0) + t.amount;
    });

    const categoryLabels = Object.keys(categoryGroups);
    const categoryValues = Object.values(categoryGroups);

    const categoryCtx = this.categoryRef.nativeElement.getContext('2d');
    new Chart(categoryCtx, {
      type: 'pie',
      data: {
        labels: categoryLabels,
        datasets: [{
          data: categoryValues,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#81C784', '#9575CD', '#F06292'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right' },
          tooltip: { enabled: true },
          title: {
            display: true,
            text: 'Total por Categoria',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
        }
      }
    });
  
  }


  graficoTransferenciasPorCategoria(transactions: any) {
    const transferGroups: Record<string, number> = {};

    transactions.forEach((t: any) => {
      if (t.type === 'expense') {
        const category = t.category;
        transferGroups[category] = (transferGroups[category] || 0) + t.amount;
      }
    });

    const labels = Object.keys(transferGroups);
    const values = Object.values(transferGroups);

    const ctx = this.transferCategoryRef.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Transferências por Categoria',
          data: values,
          backgroundColor: '#42A5F5'
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
            callback: function (tickValue: string | number) {
              if (typeof tickValue === 'number') {
                return new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(tickValue);
              }
              return tickValue;
            }
          }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const value = context.raw;
                return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
              }
            }
          },
          title: {
            display: true,
            text: 'Transferências por Categoria',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
        }
      }
    });
  }

  graficoDepositosPorCategoria(transactions: any) {
    const depositGroups: Record<string, number> = {};

    transactions.forEach((t: any) => {
      if (t.type === 'income') {
        const category = t.category;
        depositGroups[category] = (depositGroups[category] || 0) + t.amount;
      }
    });

    const labels = Object.keys(depositGroups);
    const values = Object.values(depositGroups);

    const ctx = this.depositCategoryRef.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Depósitos por Categoria',
          data: values,
          backgroundColor: '#66BB6A'
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (tickValue: string | number) {
                if (typeof tickValue === 'number') {
                  return new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(tickValue);
                }
                return tickValue;
              }
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const value = context.raw;
                return new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(value);
              }
            }
          },
          title: {
            display: true,
            text: 'Depósitos por Categoria',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
        }
      }
    });
  }

}
