/**
 * App Root Component - CabineXFontOffice
 * 
 * Composant racine de l'application front office Angular 21.
 * Landing page marketing pour patients avec chatbot intégré.
 * 
 * **Sections landing page :**
 * 1. **Header** - Navigation + logo CabinetX
 * 2. **Hero** - Titre principal + CTA "Prendre RDV"
 * 3. **Stats** - Compteurs animés (patients, médecins, consultations)
 * 4. **Features** - Fonctionnalités plateforme (6 cards)
 * 5. **Testimonials** - Témoignages patients (carousel)
 * 6. **CTA** - Section appel à l'action centrale
 * 7. **Contact** - Formulaire contact + carte adresse
 * 8. **Footer** - Liens, réseaux sociaux, mentions légales
 * 9. **Chatbot** - Widget flottant (bottom-right) pour assistance IA
 * 
 * **Architecture :**
 * - **Standalone components** (Angular 21 new API)
 * - **Signals** pour réactivité (title signal)
 * - **RouterOutlet** pour routing futur (pages Mentions Légales, CGU)
 * 
 * **Deployment :**
 * - SSR (Server-Side Rendering) via Angular Universal
 * - SEO-optimized (metadata, semantic HTML)
 * - Responsive design (mobile-first)
 * 
 * @component App
 * @author CabinetX Development Team
 * @version 1.0
 * @since 2025
 */

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { StatsSectionComponent } from './components/stats-section/stats-section.component';
import { FeaturesSectionComponent } from './components/features-section/features-section.component';
import { TestimonialsSectionComponent } from './components/testimonials-section/testimonials-section.component';
import { CtaSectionComponent } from './components/cta-section/cta-section.component';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';
import { FooterComponent } from './components/footer/footer.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    HeroSectionComponent,
    StatsSectionComponent,
    FeaturesSectionComponent,
    TestimonialsSectionComponent,
    CtaSectionComponent,
    ContactSectionComponent,
    FooterComponent,
    ChatbotComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('chatbot-accueil');
}
