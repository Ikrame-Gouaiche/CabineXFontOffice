import { Component, signal, effect, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
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

  isOpen = signal(false);
  input = signal('');
  isTyping = signal(false);

  messages = signal<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Bonjour ! Je suis l\'assistant MediCare Pro. Comment puis-je vous aider ? Vous pouvez me poser des questions sur nos services ou demander à prendre un rendez-vous.',
    },
  ]);

  quickReplies = ['Prendre rendez-vous', 'Voir les tarifs', 'Contacter un conseiller'];

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

    setTimeout(() => {
      const responses: Record<string, string> = {
        'prendre rendez-vous':
          'Bien sûr ! Pour prendre rendez-vous, je vous invite à créer un compte gratuit. Vous pourrez ensuite choisir le praticien, la date et l\'heure qui vous conviennent. Souhaitez-vous que je vous guide ?',
        'voir les tarifs':
          'Nos tarifs commencent à 49€/mois pour un praticien solo. Nous proposons également des offres pour les cabinets de groupe et les cliniques. Voulez-vous plus de détails sur un forfait en particulier ?',
        'contacter un conseiller':
          'Je peux vous mettre en relation avec un conseiller. Vous pouvez nous appeler au 01 23 45 67 89 ou nous envoyer un email à contact@medicare-pro.fr. Un conseiller vous répondra sous 24h ouvrées.',
      };

      const lowerText = text.toLowerCase();
      let response =
        'Merci pour votre message ! Je suis là pour vous aider avec la gestion de votre cabinet médical. N\'hésitez pas à me poser des questions sur nos fonctionnalités, nos tarifs ou la prise de rendez-vous.';

      for (const [key, value] of Object.entries(responses)) {
        if (lowerText.includes(key)) {
          response = value;
          break;
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      };

      this.messages.update(msgs => [...msgs, assistantMessage]);
      this.isTyping.set(false);
    }, 1500);
  }

  handleQuickReply(reply: string) {
    this.handleSend(reply);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.handleSend(this.input());
  }
}
