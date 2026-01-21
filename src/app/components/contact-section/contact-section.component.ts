/**
 * Contact Section Component - Informations contact et formulaire
 * 
 * Composant Angular standalone pour section contact du front office.
 * Affiche coordonnées de contact (téléphone, email, adresse, horaires) + formulaire contact.
 * 
 * **Contact info affichée:**
 * - **Téléphone:** 01 23 45 67 89 (lien tel: cliquable mobile)
 * - **Email:** contact@medicare-pro.fr (lien mailto: cliquable)
 * - **Adresse:** 123 Avenue de la Santé, 75001 Paris, France (lien Google Maps)
 * - **Horaires:** Lun - Ven : 9h00 - 18h00 (info statique)
 * 
 * **Features:**
 * - Grid responsive (1 col mobile, 2 cols desktop)
 * - Icônes Lucide (phone, mail, location, clock)
 * - Liens cliquables pour téléphone, email, maps
 * - Formulaire contact: nom, email, sujet, message (avec validation)
 * 
 * **Architecture:**
 * - Standalone component (imports: CommonModule)
 * - Interface ContactInfo typée (icon, title, value, link?)
 * - Array contactInfo avec 4 moyens de contact
 * 
 * @example
 * ```html
 * <app-contact-section></app-contact-section>
 * ```
 * 
 * @author CabinetX Team
 * @version 1.0
 * @since 2024
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interface ContactInfo - Structure info contact.
 * 
 * @property {string} icon - Nom icône Lucide (phone, mail, location, clock)
 * @property {string} title - Label (ex: 'Téléphone', 'Email')
 * @property {string} value - Valeur affichée (numéro, email, adresse, horaires)
 * @property {string} [link] - Lien cliquable optionnel (tel:, mailto:, maps)
 */
interface ContactInfo {
  icon: string;
  title: string;
  value: string;
  link?: string;
}

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-section.component.html',
  styleUrls: ['./contact-section.component.css']
})
export class ContactSectionComponent {
  /**
   * Array des 4 infos de contact avec liens cliquables.
   * 
   * **Structure:**
   * - icon: Nom icône Lucide (phone, mail, location, clock)
   * - title: Label affiché (Téléphone, Email, Adresse, Horaires)
   * - value: Valeur textuelle (numéro, email, adresse complète, horaires)
   * - link?: URL cliquable optionnelle (tel:, mailto:, Google Maps)
   * 
   * **Note:** Remplacer par vraies coordonnées lors de mise en production.
   */
  contactInfo: ContactInfo[] = [
    {
      icon: 'phone',
      title: 'Téléphone',
      value: '01 23 45 67 89',
      link: 'tel:+33123456789'
    },
    {
      icon: 'mail',
      title: 'Email',
      value: 'contact@medicare-pro.fr',
      link: 'mailto:contact@medicare-pro.fr'
    },
    {
      icon: 'location',
      title: 'Adresse',
      value: '123 Avenue de la Santé, 75001 Paris, France',
      link: 'https://maps.google.com/?q=123+Avenue+de+la+Santé+75001+Paris+France'
    },
    {
      icon: 'clock',
      title: 'Horaires',
      value: 'Lun - Ven : 9h00 - 18h00',
    }
  ];
}
