import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('');
  }
}
