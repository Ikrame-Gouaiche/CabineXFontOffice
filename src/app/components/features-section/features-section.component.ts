import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.css']
})
export class FeaturesSectionComponent {
  features: Feature[] = [
    {
      icon: 'calendar',
      title: 'Agenda intelligent',
      description: 'Planifiez vos rendez-vous avec un agenda synchronisé. Rappels automatiques par SMS et email.',
    },
    {
      icon: 'users',
      title: 'Gestion des patients',
      description: 'Dossiers médicaux complets et sécurisés. Historique des consultations et ordonnances.',
    },
    {
      icon: 'file-text',
      title: 'Facturation simplifiée',
      description: 'Génération automatique des factures et télétransmission. Suivi des paiements en temps réel.',
    },
    {
      icon: 'brain',
      title: 'Assistant IA',
      description: 'Notre chatbot répond à vos questions et aide vos patients à prendre rendez-vous 24h/24.',
    },
    {
      icon: 'credit-card',
      title: 'Paiement en ligne',
      description: 'Acceptez les paiements par carte bancaire. Téléconsultations intégrées et sécurisées.',
    },
    {
      icon: 'bell',
      title: 'Notifications',
      description: 'Alertes personnalisées pour les rendez-vous, rappels de vaccins et suivis de traitements.',
    },
  ];
}
