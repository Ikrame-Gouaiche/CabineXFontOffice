/**
 * Footer Component - Pied de page avec liens et informations légales
 * 
 * Composant Angular standalone pour footer du front office landing page.
 * Organise les liens en 3 colonnes thématiques + copyright + réseaux sociaux.
 * 
 * **3 Colonnes de liens:**
 * 1. **Produit** - Fonctionnalités, Tarifs, Témoignages, API
 * 2. **Ressources** - Documentation, Blog, Webinaires, Centre d'aide
 * 3. **Légal** - Mentions légales, Confidentialité, CGU, RGPD
 * 
 * **Features:**
 * - Logo MediCare Pro avec tagline
 * - Copyright dynamique avec année actuelle (currentYear)
 * - Liens réseaux sociaux (Twitter, LinkedIn, GitHub)
 * - Grid responsive (1 col mobile, 4 cols desktop)
 * - Hover effect sur liens (underline + color transition)
 * 
 * **Architecture:**
 * - Standalone component (imports: CommonModule)
 * - Interfaces FooterLink et FooterLinks typées
 * - Object footerLinks avec 3 arrays (produit, ressources, legal)
 * 
 * **Note SEO:** Les liens internes améliorent navigation et indexation.
 * 
 * @example
 * ```html
 * <app-footer></app-footer>
 * ```
 * 
 * @author CabinetX Team
 * @version 1.0
 * @since 2024
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interface FooterLink - Structure d'un lien footer.
 * 
 * @property {string} name - Texte affiché du lien
 * @property {string} href - URL de destination (anchor ou route)
 */
interface FooterLink {
  name: string;
  href: string;
}

/**
 * Interface FooterLinks - Structure des 3 colonnes de liens footer.
 * 
 * @property {FooterLink[]} produit - Liens relatifs au produit (features, pricing)
 * @property {FooterLink[]} ressources - Liens ressources (docs, blog, support)
 * @property {FooterLink[]} legal - Liens légaux (mentions, RGPD, CGU)
 */
interface FooterLinks {
  produit: FooterLink[];
  ressources: FooterLink[];
  legal: FooterLink[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  /**
   * Année actuelle pour copyright dynamique.
   * Auto-update chaque année sans maintenance.
   */
  currentYear = new Date().getFullYear();

  /**
   * Configuration des 3 colonnes de liens footer.
   * 
   * **Colonne Produit:**
   * - Liens vers sections clés (#features, #pricing, #testimonials)
   * - Lien API (placeholder '#' à remplacer par vraie doc API)
   * 
   * **Colonne Ressources:**
   * - Documentation technique
   * - Blog (articles métier)
   * - Webinaires (formations)
   * - Centre d'aide (FAQ + support)
   * 
   * **Colonne Légal:**
   * - Mentions légales (éditeur, hébergeur)
   * - Confidentialité (politique données personnelles)
   * - CGU (conditions générales utilisation)
   * - RGPD (conformité réglementation européenne)
   * 
   * **Note:** Remplacer placeholders '#' par vraies URLs lors de création pages.
   */
  footerLinks: FooterLinks = {
    produit: [
      { name: 'Fonctionnalités', href: '#features' },
      { name: 'Tarifs', href: '#pricing' },
      { name: 'Témoignages', href: '#testimonials' },
      { name: 'API', href: '#' },
    ],
    ressources: [
      { name: 'Documentation', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Webinaires', href: '#' },
      { name: 'Centre d\'aide', href: '#' },
    ],
    legal: [
      { name: 'Mentions légales', href: '#' },
      { name: 'Confidentialité', href: '#' },
      { name: 'CGU', href: '#' },
      { name: 'RGPD', href: '#' },
    ],
  };
}
