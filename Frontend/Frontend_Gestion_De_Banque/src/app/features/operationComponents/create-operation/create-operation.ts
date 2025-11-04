import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink,  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Account } from '../../../core/Models/Account';
import { OperationInterface } from '../../../core/Models/Operation';
import { operationService } from '../../../core/services/operation/operation';
import { Accout } from '../../../core/services/account/accout';

@Component({
  selector: 'app-create-operation',
  imports: [CommonModule, ReactiveFormsModule ,RouterLink],
  templateUrl: './create-operation.html',
  styleUrl: './create-operation.css',
})
export class CreateOperation  implements OnInit, OnDestroy {
  operationForm: FormGroup;
  operationType: 'DEPOT' | 'RETRAIT' | 'TRANSFERT' = 'DEPOT';
  accounts: Account[] = [];
  sourceAccount: Account | null = null;
  destinationAccount: Account | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private operationService: operationService,
    private accountService: Accout
  ) {
    this.operationForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadAccounts();
    this.setupFormListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      amount: [null, [Validators.required, Validators.min(0.01), Validators.max(1000000)]],
      sourceAccountNumber: ['', Validators.required],
      destinationAccountNumber: ['']
    });
  }

  private setupFormListeners(): void {
    // Écouter les changements du compte source
    this.operationForm.get('sourceAccountNumber')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(accountNumber => {
        this.sourceAccount = this.accounts.find(acc => acc.accountNumber === accountNumber) || null;
        this.validateBalance();
      });

    // Écouter les changements du compte destination
    this.operationForm.get('destinationAccountNumber')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(accountNumber => {
        this.destinationAccount = this.accounts.find(acc => acc.accountNumber === accountNumber) || null;
      });

    // Écouter les changements du montant
    this.operationForm.get('amount')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.validateBalance();
      });
  }

  private loadAccounts(): void {
    this.isLoading = true;
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des comptes:', error);
        this.errorMessage = 'Erreur lors du chargement des comptes';
        this.isLoading = false;
      }
    });
  }

  setOperationType(type: 'DEPOT' | 'RETRAIT' | 'TRANSFERT'): void {
    this.operationType = type;
    this.errorMessage = '';

    // Gérer les validateurs dynamiques
    const destinationControl = this.operationForm.get('destinationAccountNumber');
    
    if (type === 'TRANSFERT') {
      destinationControl?.setValidators([Validators.required, this.differentAccountValidator.bind(this)]);
    } else {
      destinationControl?.clearValidators();
      destinationControl?.setValue('');
    }
    
    destinationControl?.updateValueAndValidity();
    this.validateBalance();
  }

  private differentAccountValidator(control: AbstractControl): { [key: string]: any } | null {
    const sourceAccount = this.operationForm.get('sourceAccountNumber')?.value;
    const destinationAccount = control.value;
    
    if (sourceAccount && destinationAccount && sourceAccount === destinationAccount) {
      return { sameAccount: true };
    }
    return null;
  }

  private validateBalance(): void {
    if (this.operationType === 'DEPOT') return;

    const amount = this.operationForm.get('amount')?.value;
    const sourceAccount = this.sourceAccount;

    if (!sourceAccount || !amount) return;

    if (sourceAccount.balance < amount) {
      this.operationForm.get('amount')?.setErrors({ insufficientBalance: true });
    }
  }

  hasSufficientBalance(): boolean {
    if (this.operationType === 'DEPOT') return true;
    if (!this.sourceAccount || !this.operationForm.get('amount')?.value) return false;

    return this.sourceAccount.balance >= this.operationForm.get('amount')?.value;
  }

  getOperationTypeLabel(): string {
    const labels = {
      'DEPOT': 'Dépôt',
      'RETRAIT': 'Retrait',
      'TRANSFERT': 'Transfert'
    };
    return labels[this.operationType];
  }

  getOperationColor(): string {
    const colors = {
      'DEPOT': 'text-green-600',
      'RETRAIT': 'text-red-600',
      'TRANSFERT': 'text-blue-600'
    };
    return colors[this.operationType];
  }

  getOperationButtonClass(type: string): string {
    const baseClass = 'p-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center';
    const isActive = this.operationType === type;
    
    const colors = {
      'DEPOT': isActive ? 'bg-green-600 text-white border-2 border-green-600' : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-500',
      'RETRAIT': isActive ? 'bg-red-600 text-white border-2 border-red-600' : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-red-500',
      'TRANSFERT': isActive ? 'bg-blue-600 text-white border-2 border-blue-600' : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-500'
    };

    return `${baseClass} ${colors[type as keyof typeof colors]}`;
  }

  getFormattedBalance(account: Account | null): string {
    if (!account) return '0.00 CFA';
    return `${account.balance.toFixed(2)} ${account.currency || 'CFA'}`;
  }

  getAccountDisplayName(account: Account): string {
    const accountNumber = account.accountNumber || 'N/A';
    const clientName = account.client ? `${account.client.firstName} ${account.client.lastName}` : 'Client inconnu';
    const balance = this.getFormattedBalance(account);
    return `${accountNumber} - ${clientName} (${balance})`;
  }

  getAmountError(): string {
    const control = this.operationForm.get('amount');
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) return 'Le montant est requis';
    if (control.errors['min']) return 'Le montant doit être supérieur à 0';
    if (control.errors['max']) return 'Le montant ne peut pas dépasser 1,000,000';
    if (control.errors['insufficientBalance']) return 'Solde insuffisant';

    return '';
  }

  onSubmit(): void {
    if (this.operationForm.invalid || !this.hasSufficientBalance()) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.executeOperation();
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.operationForm.controls).forEach(key => {
      const control = this.operationForm.get(key);
      control?.markAsTouched();
    });
  }

  private executeOperation(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const operationData: OperationInterface = {
      amount: this.operationForm.get('amount')?.value,
      sourceAccountNumber: this.operationForm.get('sourceAccountNumber')?.value,
      destinationAccountNumber: this.operationType === 'TRANSFERT' ? 
        this.operationForm.get('destinationAccountNumber')?.value : undefined
    };

    const operationCall = this.getOperationServiceCall();

    operationCall.subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.router.navigate(['/operations'], {
            queryParams: { refresh: true }
          });
        } else {
          this.errorMessage = 'L\'opération a échoué côté serveur';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors de l\'exécution de l\'opération:', error);
        this.errorMessage = this.getErrorMessage(error);
      }
    });
  }

  private getOperationServiceCall() {
    const operationData: OperationInterface = {
      amount: this.operationForm.get('amount')?.value,
      sourceAccountNumber: this.operationForm.get('sourceAccountNumber')?.value,
      destinationAccountNumber: this.operationType === 'TRANSFERT' ? 
        this.operationForm.get('destinationAccountNumber')?.value : undefined
    };

    switch (this.operationType) {
      case 'DEPOT':
        return this.operationService.makeADeposit(operationData);
      case 'RETRAIT':
        return this.operationService.makeAWithdrawal(operationData);
      case 'TRANSFERT':
        return this.operationService.makeATransfer(operationData);
      default:
        throw new Error('Type d\'opération non supporté');
    }
  }

  private getErrorMessage(error: any): string {
    if (error.status === 400) {
      return 'Données invalides. Vérifiez les informations saisies.';
    } else if (error.status === 409) {
      return 'Solde insuffisant pour effectuer cette opération.';
    } else if (error.status >= 500) {
      return 'Erreur serveur. Veuillez réessayer plus tard.';
    } else {
      return 'Erreur lors de l\'exécution de l\'opération. Veuillez réessayer.';
    }
  }

  // Méthodes utilitaires pour le template
  isFieldInvalid(fieldName: string): boolean {
    const control = this.operationForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }

  isFieldValid(fieldName: string): boolean {
    const control = this.operationForm.get(fieldName);
    return !!(control?.valid && control?.touched);
  }

  getCurrentBalance(): string {
    return this.getFormattedBalance(this.sourceAccount);
  }

  getOperationAmount(): number {
    return this.operationForm.get('amount')?.value || 0;
  }

  isFormReady(): boolean {
    return this.operationForm.valid && this.hasSufficientBalance() && !this.isLoading;
  }
}