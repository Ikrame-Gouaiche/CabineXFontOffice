/**
 * CTA Section Component - Call-to-Action inscription
 * 
 * Composant Angular standalone pour section CTA (Call-to-Action) incitant à l'essai gratuit.
 * Positionné avant footer pour conversion maximale (dernière chance avant sortie).
 * 
 * **Message principal:**
 * "Prêt à transformer votre cabinet médical ?"
 * "Rejoignez plus de 2,500 professionnels de santé qui nous font confiance"
 * 
 * **4 Benefits affichés:**
 * - 14 jours d'essai gratuit (no risk)
 * - Aucune carte bancaire requise (friction-free)
 * - Migration de vos données incluse (no effort)
 * - Support dédié pour le démarrage (hand-holding)
 * 
 * **Features:**
 * - Gradient background violet-bleu immersif
 * - 2 CTA buttons: "Commencer gratuitement" (primary) + "Demander une démo" (secondary)
 * - Checklist benefits avec icônes check-circle vertes
 * - Responsive layout (col mobile, row desktop)
 * 
 * **Architecture:**
 * - Standalone component (imports: CommonModule)
 * - Array benefits avec strings statiques
 * 
 * @example
 * ```html
 * <app-cta-section></app-cta-section>
 * ```
 * 
 * @author CabinetX Team
 * @version 1.0
 * @since 2024
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cta-section.component.html',
  styleUrls: ['./cta-section.component.css']
})
export class CtaSectionComponent {
  /**
   * Array des 4 bénéfices de l'essai gratuit (checklist persuasive).
   * 
   * **Stratégie conversion:**
   * 1. Éliminer risque financier (essai gratuit 14j)
   * 2. Éliminer friction signup (pas de CB)
   * 3. Éliminer effort migration (data import inclus)
   * 4. Rassurer sur support (démarrage accompagné)
   */
  benefits = [
    '14 jours d\'essai gratuit',
    'Aucune carte bancaire requise',
    'Migration de vos données incluse',
    'Support dédié pour le démarrage',
  ];
}
