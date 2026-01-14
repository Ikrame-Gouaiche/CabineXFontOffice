import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
