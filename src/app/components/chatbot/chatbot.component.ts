import { Component, signal, effect, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessageResponse, ClinicInfo, DoctorInfo, SlotInfo } from '../../services/chatbot.service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  clinics?: ClinicInfo[];
  doctors?: DoctorInfo[];
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
  @ViewChild('messagesEnd') private messagesEnd!: ElementRef;

  private chatbotService = inject(ChatbotService);

  isOpen = signal(false);
  input = signal('');
  isTyping = signal(false);

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
