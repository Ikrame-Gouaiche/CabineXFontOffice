/**
 * Header Component - Navigation principale landing page
 * 
 * Composant Angular standalone pour barre de navigation responsive du front office.
 * Gère le menu principal avec navigation par ancres vers les sections de la page.
 * 
 * **Features:**
 * - Navigation sticky avec effet de transparence au scroll
 * - Menu mobile avec burger toggle (Signals pour reactive state)
 * - Logo MediCare Pro avec lien retour accueil
 * - 4 liens navigation: Fonctionnalités, Tarifs, Témoignages, Contact
 * - Bouton CTA "Démarrer" pour inscription
 * 
 * **Architecture:**
 * - Standalone component (imports: CommonModule)
 * - Signal API pour mobileMenuOpen (reactivity fine-grained)
 * - Navigation par href avec anchors (#features, #pricing, #testimonials, #contact)
 * 
 * **Comportement Mobile:**
 * - Menu hamburger affiche/cache le menu mobile (toggleMobileMenu)
 * - Clic sur lien ferme automatiquement le menu (closeMobileMenu)
 * - Overlay blur backdrop quand menu ouvert
 * 
 * @example
 * ```html
 * <app-header></app-header>
 * ```
 * 
 * @author CabinetX Team
 * @version 1.0
 * @since 2024
 */
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  /**
   * Signal pour état d'ouverture du menu mobile.
   * true = menu ouvert, false = menu fermé.
   */
  mobileMenuOpen = signal(false);

  /**
   * Configuration des liens de navigation avec anchors vers sections.
   * Chaque item a name (texte affiché) et href (anchor HTML).
   */
  navigation = [
    { name: 'Fonctionnalités', href: '#features' },
    { name: 'Tarifs', href: '#pricing' },
    { name: 'Témoignages', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  /**
   * Toggle l'état d'ouverture du menu mobile (burger).
   * Inverse la valeur du signal mobileMenuOpen.
   */
  toggleMobileMenu() {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  /**
   * Ferme le menu mobile (après clic sur un lien).
   * Remet le signal mobileMenuOpen à false.
   */
  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }
}
