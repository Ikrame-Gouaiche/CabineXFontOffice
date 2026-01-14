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
  benefits = [
    '14 jours d\'essai gratuit',
    'Aucune carte bancaire requise',
    'Migration de vos données incluse',
    'Support dédié pour le démarrage',
  ];
}
