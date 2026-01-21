/**
 * Testimonials Section Component - Témoignages clients
 * 
 * Composant Angular standalone affichant les témoignages de médecins utilisateurs.
 * Permet de crédibiliser la solution avec retours d'expérience réels (social proof).
 * 
 * **Testimonials affichés:**
 * - Dr. Sophie Martin (Médecin généraliste) - Gain de temps administratif
 * - Dr. Jean Dupont (Dermatologue) - Assistant IA
 * - Dr. Marie Leroy (Pédiatre) - Interface intuitive + support
 * 
 * **Features:**
 * - Carousel horizontal responsive (1-3 cols selon viewport)
 * - Avatar par défaut (initiales) si pas de photo
 * - Quote styling avec guillemets CSS
 * - Hover effect scale + shadow
 * 
 * **Architecture:**
 * - Standalone component (imports: CommonModule)
 * - Interface Testimonial typée (name, role, avatar, content)
 * - Helper method getInitials() pour générer initiales depuis nom complet
 * 
 * **Design:**
 * - Card style avec border subtle
 * - Avatar circulaire (photo ou initiales gradient)
 * - Role en texte secondaire (gray-600)
 * 
 * @example
 * ```html
 * <app-testimonials-section></app-testimonials-section>
 * ```
 * 
 * @author CabinetX Team
 * @version 1.0
 * @since 2024
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interface Testimonial - Structure d'un témoignage client.
 * 
 * @property {string} name - Nom complet du médecin (ex: 'Dr. Sophie Martin')
 * @property {string} role - Spécialité médicale (ex: 'Médecin généraliste')
 * @property {string | null} avatar - URL photo profil ou null (initiales)
 * @property {string} content - Témoignage textuel (2-3 phrases max)
 */
interface Testimonial {
  name: string;
  role: string;
  avatar: string | null;
  content: string;
}

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials-section.component.html',
  styleUrls: ['./testimonials-section.component.css']
})
export class TestimonialsSectionComponent {
  /**
   * Array des 3 témoignages de médecins utilisateurs.
   * 
   * Structure: { name, role, avatar (null = initiales), content }
   * 
   * **Sélection testimonials:**
   * - Diversité spécialités (généraliste, dermatologue, pédiatre)
   * - Focus sur bénéfices clés (gain temps, IA 24/7, UX/support)
   * - Tonalité positive mais authentique (pas survente)
   */
  testimonials: Testimonial[] = [
    {
      name: 'Dr. Sophie Martin',
      role: 'Médecin généraliste',
      avatar: null,
      content:
        'MediCare Pro a transformé la gestion de mon cabinet. Je gagne plus de 2 heures par jour sur l\'administratif.',
    },
    {
      name: 'Dr. Jean Dupont',
      role: 'Dermatologue',
      avatar: null,
      content:
        'L\'assistant IA est incroyable. Mes patients peuvent prendre rendez-vous à toute heure, c\'est un vrai plus.',
    },
    {
      name: 'Dr. Marie Leroy',
      role: 'Pédiatre',
      avatar: null,
      content: 'Interface intuitive et support réactif. Je recommande à tous mes confrères.',
    },
  ];

  /**
   * Génère les initiales depuis nom complet (fallback si avatar === null).
   * 
   * @param name - Nom complet (ex: 'Dr. Sophie Martin')
   * @returns Initiales concaténées (ex: 'DSM')
   * 
   * @example
   * ```typescript
   * getInitials('Dr. Sophie Martin'); // 'DSM'
   * getInitials('Jean Dupont'); // 'JD'
   * ```
   */
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('');
  }
}
