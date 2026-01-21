/**
 * Stats Section Component - Statistiques clés plateforme
 * 
 * Composant Angular standalone affichant les statistiques de performance de MediCare Pro.
 * Permet de valoriser la solution avec chiffres clés (ROI, satisfaction, support, adoption).
 * 
 * **Statistiques affichées:**
 * - 50% de temps administratif économisé
 * - 98% de satisfaction client
 * - Support disponible 24/7
 * - +2,500 cabinets utilisateurs
 * 
 * **Features:**
 * - Animation counter au scroll (reveal on viewport enter)
 * - Gradient background avec effet parallax
 * - Responsive grid (2x2 sur mobile, 4x1 sur desktop)
 * 
 * **Architecture:**
 * - Standalone component (imports: CommonModule)
 * - Données statiques dans array stats
 * - Potentiel: Animation avec intersection observer (à implémenter)
 * 
 * @example
 * ```html
 * <app-stats-section></app-stats-section>
 * ```
 * 
 * @author CabinetX Team
 * @version 1.0
 * @since 2024
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-section.component.html',
  styleUrls: ['./stats-section.component.css']
})
export class StatsSectionComponent {
  /**
   * Array des statistiques clés avec valeur et label.
   * Chaque stat affiche un chiffre percutant pour convaincre prospects.
   * 
   * Structure: { value: string (chiffre formaté), label: string (description) }
   */
  stats = [
    { value: '50%', label: 'Temps administratif économisé' },
    { value: '98%', label: 'Satisfaction client' },
    { value: '24/7', label: 'Support disponible' },
    { value: '+2,500', label: 'Cabinets utilisateurs' },
  ];
}
