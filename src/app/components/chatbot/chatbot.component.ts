/**
 * Chatbot Component - Interface Conversationnelle IA
 * 
 * Composant Angular standalone pour chatbot médical intelligent intégré au front office.
 * Permet aux patients de :
 * - Consulter la liste des cabinets actifs
 * - Trouver médecins disponibles par spécialité
 * - Vérifier créneaux horaires disponibles
 * - Réserver rendez-vous (flow guidé)
 * 
 * **Architecture :**
 * - Signals Angular 21 (réactivité fine-grained)
 * - Service ChatbotService (HTTP vers Chatbot Service port 8083)
 * - Session tracking (sessionId persisté durant conversation)
 * - ViewChild scrolling automatique vers dernier message
 * 
 * **Flow conversation :**
 * 1. User envoie message → handleSend(text)
 * 2. ChatbotService.sendMessage() → POST /api/chatbot/message
 * 3. Backend analyse intent (NLP) → Retourne réponse + données structurées
 * 4. Affichage réponse + cards interactives (clinics, doctors, slots)
 * 
 * **Quick Replies :**
 * Boutons prédéfinis pour intentions courantes :
 * - "Voir les cabinets" → Liste ClinicInfo[]
 * - "Médecins disponibles" → Liste DoctorInfo[]
 * - "Créneaux disponibles" → Liste SlotInfo[]
 * - "Aide" → Guide utilisation
 * 
 * @component ChatbotComponent
 * @author CabinetX Development Team
 * @version 1.0
 * @since 2025
 */

import { Component, signal, effect, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessageResponse, ClinicInfo, DoctorInfo, SlotInfo } from '../../services/chatbot.service';

/**
 * Structure d'un message dans la conversation.
 * 
 * @interface Message
 */
interface Message {
  /** ID unique du message (timestamp) */
  id: string;
  /** Rôle de l'émetteur */
  role: 'user' | 'assistant';
  /** Contenu texte du message */
  content: string;
  /** Liste cabinets (si requête "voir cabinets") */
  clinics?: ClinicInfo[];
  /** Liste médecins (si requête "médecins disponibles") */
  doctors?: DoctorInfo[];
  /** Créneaux disponibles (si requête "horaires") */
  slots?: SlotInfo[];
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  /** Référence DOM pour auto-scroll vers dernier message */
  @ViewChild('messagesEnd') private messagesEnd!: ElementRef;

  /** Service chatbot injecté (Angular 21 inject() pattern) */
  private chatbotService = inject(ChatbotService);

  /** État ouverture/fermeture widget chatbot */
  isOpen = signal(false);
  /** Contenu champ input utilisateur */
  input = signal('');
  /** Indicateur "assistant en train d'écrire..." */
  isTyping = signal(false);

  /**
   * Historique messages conversation.
   * Initialisé avec message de bienvenue automatique.
   */
  messages = signal<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Bonjour ! 👋 Je suis l\'assistant virtuel CabinetX.\n\nJe peux vous aider avec:\n- 🏥 Informations sur nos cabinets\n- 👨‍⚕️ Liste des médecins disponibles\n- 📅 Créneaux horaires disponibles\n\nComment puis-je vous aider ?',
    },
  ]);

  quickReplies = ['Voir les cabinets', 'Médecins disponibles', 'Créneaux disponibles', 'Aide'];

  constructor() {
    effect(() => {
      if (this.messages()) {
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  toggleChat() {
    this.isOpen.set(!this.isOpen());
  }

  scrollToBottom() {
    try {
      this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {}
  }

  /**
   * Gère l'envoi d'un message utilisateur et réception réponse chatbot.
   * 
   * Flow :
   * 1. Crée message user dans historique
   * 2. Appelle ChatbotService.sendMessage(text)
   * 3. Backend traite avec NLP → Retourne réponse + données
   * 4. Ajoute message assistant avec données structurées (clinics/doctors/slots)
   * 5. Auto-scroll vers bas conversation
   * 
   * @param text - Texte message à envoyer (déjà trimé)
   * 
   * Gestion erreurs :
   * - Erreur réseau → Message "Désolé, une erreur est survenue"
   * - Chatbot indisponible → Fallback response depuis service
   */
  handleSend(text: string) {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
    };

    this.messages.update(msgs => [...msgs, userMessage]);
    this.input.set('');
    this.isTyping.set(true);

    // Call the backend chatbot service
    this.chatbotService.sendMessage(text.trim()).subscribe({
      next: (response: ChatMessageResponse) => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.reply,
          clinics: response.clinics,
          doctors: response.doctors,
          slots: response.availableSlots,
        };

        this.messages.update(msgs => [...msgs, assistantMessage]);
        this.isTyping.set(false);
      },
      error: (error) => {
        console.error('Error sending message:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        };
        this.messages.update(msgs => [...msgs, errorMessage]);
        this.isTyping.set(false);
      }
    });
  }

  handleQuickReply(reply: string) {
    this.handleSend(reply);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.handleSend(this.input());
  }

  resetChat() {
    this.chatbotService.resetSession();
    this.messages.set([
      {
        id: '1',
        role: 'assistant',
        content:
          'Bonjour ! 👋 Je suis l\'assistant virtuel CabinetX.\n\nJe peux vous aider avec:\n- 🏥 Informations sur nos cabinets\n- 👨‍⚕️ Liste des médecins disponibles\n- 📅 Créneaux horaires disponibles\n\nComment puis-je vous aider ?',
      },
    ]);
  }
}
