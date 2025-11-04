import { Component, Input } from '@angular/core';
import { OperationInterface } from '../../../core/Models/Operation';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-operation',
  imports: [
    DecimalPipe , DatePipe , CommonModule
  ],
  templateUrl: './operation.html',
  styleUrl: './operation.css',
})
export class Operation{
  @Input() operation!: OperationInterface;


  getOperationIcon(type: string | undefined): string {
    switch (type) {
      case 'CREDIT': return 'fas fa-arrow-down';
      case 'DEBIT': return 'fas fa-arrow-up';
      default: return 'fas fa-exchange-alt';
    }
  }

  getOperationTypeLabel(type: string | undefined): string {
    switch (type) {
      case 'CREDIT': return 'Dépôt';
      case 'DEBIT': return 'Retrait';
      default: return 'Opération';
    }
  }

  // Méthode pour identifier les opérations de transfert
  isTransferOperation(operation: OperationInterface): boolean {
    // Vous pouvez adapter cette logique selon comment vous identifiez les transferts
    // Par exemple, si vous avez un champ spécifique ou un pattern dans le numéro d'opération
    return operation.opereationNumber?.includes('TRANSFER') || 
           operation.opereationNumber?.includes('XFER') ||
           false; // Adaptez selon votre logique métier
  }

  // Méthodes pour les couleurs (simplifiées pour CREDIT/DEBIT seulement)
  getHeaderColor(type: string | undefined): string {
    switch (type) {
      case 'CREDIT': return 'bg-green-50 border-green-200';
      case 'DEBIT': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  }

  getIconBgColor(type: string | undefined): string {
    switch (type) {
      case 'CREDIT': return 'bg-green-100';
      case 'DEBIT': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  }

  getIconColor(type: string | undefined): string {
    switch (type) {
      case 'CREDIT': return 'text-green-600';
      case 'DEBIT': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  getTitleColor(type: string | undefined): string {
    switch (type) {
      case 'CREDIT': return 'text-green-800';
      case 'DEBIT': return 'text-red-800';
      default: return 'text-gray-800';
    }
  }

  getSubtitleColor(type: string | undefined): string {
    switch (type) {
      case 'CREDIT': return 'text-green-600';
      case 'DEBIT': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  getBadgeColor(type: string | undefined): string {
    switch (type) {
      case 'CREDIT': return 'text-green-700 bg-green-100 px-2 py-1 rounded';
      case 'DEBIT': return 'text-red-700 bg-red-100 px-2 py-1 rounded';
      default: return 'text-gray-700 bg-gray-100 px-2 py-1 rounded';
    }
  }

  getAmountColor(type: string | undefined): string {
    switch (type) {
      case 'CREDIT': return 'text-green-600';
      case 'DEBIT': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  getTimeAgo(date: string | undefined): string {
    if (!date) return 'Date inconnue';
    
    const now = new Date();
    const operationDate = new Date(date);
    const diffMs = now.getTime() - operationDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return `Il y a ${Math.floor(diffDays / 30)} mois`;
  }
}
