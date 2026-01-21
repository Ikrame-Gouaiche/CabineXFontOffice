/**
 * Features Section Component - Présentation des fonctionnalités clés
 * 
 * Composant Angular standalone listant les 6 fonctionnalités principales de MediCare Pro.
 * Affiche une grille de feature cards avec icône, titre et description.
 * 
 * **6 Fonctionnalités présentées:**
 * 1. **Agenda intelligent** - Planification RDV avec rappels automatiques SMS/Email
 * 2. **Gestion des patients** - Dossiers médicaux sécurisés + historique consultations
 * 3. **Facturation simplifiée** - Génération auto factures + télétransmission + suivi paiements
 * 4. **Assistant IA** - Chatbot 24/7 pour questions patients et prise RDV
 * 5. **Paiement en ligne** - Acceptation CB + téléconsultations intégrées
 * 6. **Notifications** - Alertes personnalisées (RDV, vaccins, traitements)
 * 
 * **Architecture:**
 * - Standalone component (imports: CommonModule)
 * - Interface Feature typée (title, description, icon)
 * - Grid responsive (1 col mobile, 2 cols tablet, 3 cols desktop)
 * - Icônes Lucide React (calendar, users, file-text, brain, credit-card, bell)
 * 
 * **Design:**
 * - Hover effect scale + shadow
 * - Gradient icon background
 * - Spacing uniforme entre cards
 * 
 * @example
 * ```html
 * <app-features-section></app-features-section>
 * ```
 * 
 * @author CabinetX Team
 * @version 1.0
 * @since 2024
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interface Feature - Structure d'une fonctionnalité.
 * 
 * @property {string} icon - Nom icône Lucide (ex: 'calendar', 'users')
 * @property {string} title - Titre fonctionnalité (max 30 caractères)
 * @property {string} description - Description détaillée (2 phrases max)
 */
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
  /**
   * Array des 6 fonctionnalités principales de MediCare Pro.
   * 
   * Chaque feature a:
   * - icon: Nom icône Lucide (calendar, users, file-text, brain, credit-card, bell)
   * - title: Titre court et impactant
   * - description: 2 phrases expliquant valeur ajoutée
   * 
   * **Ordre d'affichage:** De gauche à droite, haut en bas
   * 1. Agenda intelligent (RDV + rappels)
   * 2. Gestion patients (dossiers sécurisés)
   * 3. Facturation simplifiée (auto + télétransmission)
   * 4. Assistant IA (chatbot 24/7)
   * 5. Paiement en ligne (CB + téléconsultations)
   * 6. Notifications (alertes personnalisées)
   */
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
