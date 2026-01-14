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
  stats = [
    { value: '50%', label: 'Temps administratif économisé' },
    { value: '98%', label: 'Satisfaction client' },
    { value: '24/7', label: 'Support disponible' },
    { value: '+2,500', label: 'Cabinets utilisateurs' },
  ];
}
