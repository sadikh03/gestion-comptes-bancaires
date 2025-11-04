import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { operationService } from '../../../core/services/operation/operation';
import { OperationInterface } from '../../../core/Models/Operation';
import { Operation } from '../operation/operation';

@Component({
  selector: 'app-operation-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    Operation,
    RouterLink
  ],
  templateUrl: './operation-list.html',
  styleUrls: ['./operation-list.css']
})
export class OperationList implements OnInit {
  operations: OperationInterface[] = [];
  filteredOperations: OperationInterface[] = [];
  searchTerm: string = '';
  selectedType: string = 'all';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private operationService: operationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Récupérer le paramètre d'URL d'abord
    const accountNumber = this.route.snapshot.paramMap.get('accountNumber');
    this.searchTerm = accountNumber || '';
    
    // Charger les opérations
    this.loadOperations();
  }

  loadOperations() {
    this.isLoading = true;
    this.operationService.getAllOperations().subscribe({
      next: (operations) => {
        this.operations = operations;
        this.filteredOperations = [...this.operations];
        this.isLoading = false;
        
        // Une fois les données chargées, exécuter la recherche automatiquement si on a un searchTerm
        if (this.searchTerm) {
          this.performSearch();
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des opérations:', error);
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    this.performSearch();
  }

  private performSearch() {
    if (!this.searchTerm.trim()) {
      this.applyFilters();
      return;
    }

    const searchLower = this.searchTerm.toLowerCase().trim();
    
    this.filteredOperations = this.operations.filter(operation =>
      operation.account?.client?.firstName?.toLowerCase().includes(searchLower) ||
      operation.account?.client?.lastName?.toLowerCase().includes(searchLower) ||
      operation.account?.client?.email?.toLowerCase().includes(searchLower) ||
      operation.account?.accountNumber?.toLowerCase().includes(searchLower) ||
      operation.opereationNumber?.toLowerCase().includes(searchLower) ||
      operation.id?.toString().includes(searchLower)
    );

    this.applyTypeFilter();
  }

  onFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    if (!this.searchTerm.trim() && this.selectedType === 'all') {
      this.filteredOperations = [...this.operations];
      return;
    }

    let filtered = [...this.operations];

    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(operation =>
        operation.account?.client?.firstName?.toLowerCase().includes(searchLower) ||
        operation.account?.client?.lastName?.toLowerCase().includes(searchLower) ||
        operation.account?.client?.email?.toLowerCase().includes(searchLower) ||
        operation.account?.accountNumber?.toLowerCase().includes(searchLower) ||
        operation.opereationNumber?.toLowerCase().includes(searchLower) ||
        operation.id?.toString().includes(searchLower)
      );
    }

    this.filteredOperations = this.applyTypeFilterOnArray(filtered);
  }

  applyTypeFilter() {
    this.filteredOperations = this.applyTypeFilterOnArray(this.filteredOperations);
  }

  applyTypeFilterOnArray(operations: OperationInterface[]): OperationInterface[] {
    if (this.selectedType === 'all') {
      return operations;
    }
    return operations.filter(operation => operation.operationType === this.selectedType);
  }

  getOperationTypeLabel(type: string): string {
    switch (type) {
      case 'CREDIT': return 'Crédit';
      case 'DEBIT': return 'Débit';
      case 'TRANSFERT': return 'Transfert';
      case 'all': return 'Tous';
      default: return type;
    }
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedType = 'all';
    this.filteredOperations = [...this.operations];
  }

  viewOperationDetails(operation: OperationInterface) {
    this.router.navigate(['/operations', operation.id]);
  }
}