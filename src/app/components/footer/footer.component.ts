import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FooterLink {
  name: string;
  href: string;
}

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
  currentYear = new Date().getFullYear();

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
