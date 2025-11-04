import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../../../core/Models/Account';
import { CurrencyPipe, DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientInterface } from '../../../core/Models/Client';
import { Accout } from '../../../core/services/account/accout';
import { clientService } from '../../../core/services/client/client';

@Component({
  selector: 'app-account-list',
  imports: [
    DatePipe  , FormsModule , NgIf , NgFor  , DecimalPipe
  ],
  templateUrl: './account-list.html',
  styleUrl: './account-list.css',
})
export class AccountList {
  accounts: Account[] = [];
  filteredAccounts: Account[] = [];
  selectedType: string = 'all';
  isLoading = false;
  clientId?: number;
  client?: ClientInterface;
  totalClientBalance = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: Accout,
    private clientService: clientService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.clientId = params['id'] ? +params['id'] : undefined;
      this.loadData();
    });
  }

  loadData() {
    if (this.clientId) {
      this.loadClientAccounts();
      this.loadClientInfo();
    } else {
      this.loadAllAccounts();
    }
  }

  loadAllAccounts() {
    this.isLoading = true;
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.filteredAccounts = [...this.accounts];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des comptes:', error);
        this.isLoading = false;
      }
    });
  }

  loadClientAccounts() {
    this.isLoading = true;
    this.accountService.getAccountsByClient(this.clientId!).subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.filteredAccounts = [...this.accounts];
        this.calculateTotalBalance();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des comptes client:', error);
        this.isLoading = false;
      }
    });
  }

  loadClientInfo() {
    this.clientService.getOneClient(this.clientId!).subscribe({
      next: (client) => {
        this.client = client;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du client:', error);
      }
    });
  }

  calculateTotalBalance() {
    this.totalClientBalance = this.accounts.reduce((total, account) => total + account.balance, 0);
  }


  onNewAccountForClient() {
    this.router.navigate(['/accounts', this.clientId, 'create']);
  }

  // Détermine le type de compte basé sur les champs
  getAccountType(account: Account): string {
    // Si le compte a un taux d'intérêt > 0 et découvert = 0, c'est un compte épargne
    // Sinon c'est un compte courant
    return account.interestRate > 0  ? 'Épargne' : 'Courant';
  }

  onFilterChange() {
    if (this.selectedType === 'all') {
      this.filteredAccounts = [...this.accounts];
    } else {
      this.filteredAccounts = this.accounts.filter(account => {
        const type = this.getAccountType(account);
        return this.selectedType === 'courant' ? type === 'Courant' : type === 'Épargne';
      });
    }
  }

  getTypeBadgeClass(account: Account): string {
    const type = this.getAccountType(account);
    return type === 'Courant' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-green-100 text-green-800';
  }

  getStatusBadgeClass(status: string | undefined): string {
  return status === 'ACTIVED' 
    ? 'text-green-600 font-semibold' 
    : 'text-red-600 font-semibold';
}

  getBalanceColor(balance: number): string {
    if (balance > 0) return 'text-green-600';
    if (balance < 0) return 'text-red-600';
    return 'text-gray-600';
  }

  toggleAccountStatus(account: Account) {
    const currentStatus = account.status;
    
    // Appel au service pour mettre à jour le statut
    this.accountService.updateAccountStatus(account.accountNumber).subscribe({
      next: (success: boolean) => {
        if (success) {
          // Inverser le statut seulement si l'API a réussi
          account.status = account.status === 'ACTIVED' ? 'SUSPENDED' : 'ACTIVED';
        } else {
          console.error('Échec de la mise à jour du statut');
          // Ne pas changer le statut localement
        }
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        // Garder le statut actuel en cas d'erreur
      }
    });
}

  viewHistory(account: Account) {
    this.router.navigate(['/operations', account.accountNumber, 'history']);
  }

  onNewAccount() {
    this.router.navigateByUrl("/accounts/create/new");
  }

  viewClient(clientId: number) {
    this.router.navigate(['/clients', clientId]);
    // Ou pour voir les comptes du client :
    // this.router.navigate(['/comptes', clientId]);
  }
}
