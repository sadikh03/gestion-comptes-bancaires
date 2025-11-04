import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientInterface } from '../../../core/Models/Client';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Accout } from '../../../core/services/account/accout';
import { clientService } from '../../../core/services/client/client';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-account',
  imports: [RouterLink, DecimalPipe, ReactiveFormsModule, CommonModule],
  templateUrl: './create-account.html',
  styleUrl: './create-account.css',
})
export class CreateAccount implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  accountForm!: FormGroup;
  accountType: 'courant' | 'epargne' = 'courant';
  clientId?: number;
  clients: ClientInterface[] = [];
  selectedClient?: ClientInterface;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private accountService: Accout,
    private clientService: clientService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe(params => {
      this.clientId = params['id'];
      if (this.clientId) {
        this.loadClient(this.clientId);
        this.accountForm.get('clientId')?.setValue(this.clientId);
        this.accountForm.get('clientId')?.clearValidators(); // ✅ plus de required si on vient d’un client spécifique
        this.accountForm.get('clientId')?.updateValueAndValidity();
      } else {
        this.loadAllClients();
      }
    });

    // Met à jour automatiquement les infos du client quand on sélectionne un autre
    this.accountForm.get('clientId')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(clientId => {
        if (clientId) {
          this.loadClient(Number(clientId));
        } else {
          this.selectedClient = undefined;
        }
      });
  }

  /** 🔧 Crée le FormGroup avec validations dynamiques */
  private initForm(): void {
    this.accountForm = this.fb.group({
      clientId: ['', Validators.required],
      balance: [0, [Validators.required, Validators.min(0)]],
      overdraft: [0, [Validators.min(0)]],
      interestRate: [0, [Validators.min(0), Validators.max(10)]],
      currency: ['CFA', Validators.required]
    });
  }

  /** 🔁 Change le type de compte */
  setAccountType(type: 'courant' | 'epargne'): void {
    this.accountType = type;

    if (type === 'courant') {
      this.accountForm.patchValue({
        interestRate: 0,
        overdraft: 1000
      });
    } else {
      this.accountForm.patchValue({
        interestRate: 2.5,
        overdraft: 0
      });
    }
  }

  /** 🧾 Récupère tous les clients (quand pas d’id) */
  loadAllClients(): void {
    this.clientService.getClients().subscribe({
      next: (clients) => (this.clients = clients),
      error: (error) => console.error('Erreur lors du chargement des clients:', error)
    });
  }

  /** 👤 Récupère un client spécifique */
  loadClient(clientId: number): void {
    this.clientService.getOneClient(clientId).subscribe({
      next: (client) => {
        this.selectedClient = client;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du client:', error);
        this.selectedClient = undefined;
      }
    });
  }

  /** 🟢 Soumission du formulaire */
  onSubmit(): void {
    if (this.accountForm.invalid) {
      Object.values(this.accountForm.controls).forEach(ctrl => ctrl.markAsTouched());
      return;
    }

    this.isLoading = true;

    const formData = {
      balance: Number(this.accountForm.value.balance),
      interestRate: Number(this.accountForm.value.interestRate),
      overdraft: Number(this.accountForm.value.overdraft),
      currency: this.accountForm.value.currency,
      clientId: Number(this.accountForm.value.clientId),
      accountType: this.accountType
    };

    console.log('Données envoyées à l’API:', formData);

    this.accountService.postCompte(formData).subscribe({
      next: () => {
        this.isLoading = false;
        const redirectUrl = this.clientId ? ['/accounts', this.clientId] : ['/accounts'];
        this.router.navigate(redirectUrl);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur création compte:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
