import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

// Interfaces matching backend DTOs
export interface ClinicInfo {
  id: number;
  name: string;
  specialty: string;
  phone: string;
  address: string;
  logoUrl?: string;
  status: string;
  serviceEndDate: string;
}

export interface DoctorInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  specialty?: string;
  clinicId: number;
  active: boolean;
}

export interface SlotInfo {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface ChatMessageRequest {
  sessionId?: number;
  message: string;
}

export interface ChatMessageResponse {
  sessionId: number;
  reply: string;
  clinics?: ClinicInfo[];
  doctors?: DoctorInfo[];
  availableSlots?: SlotInfo[];
  selectedClinicId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private readonly gatewayUrl = 'http://localhost:8080';
  private readonly chatbotUrl = `${this.gatewayUrl}/api/chatbot`;

  // Store session ID for conversation continuity
  private sessionId = signal<number | null>(null);

  constructor(private http: HttpClient) {}

  /**
   * Send a message to the chatbot and get a response
   */
  sendMessage(message: string): Observable<ChatMessageResponse> {
    const request: ChatMessageRequest = {
      sessionId: this.sessionId() ?? undefined,
      message: message
    };

    return this.http.post<ChatMessageResponse>(`${this.chatbotUrl}/message`, request).pipe(
      tap(response => {
        // Store session ID for future messages
        if (response.sessionId) {
          this.sessionId.set(response.sessionId);
        }
      }),
      catchError(error => {
        console.error('Chatbot error:', error);
        // Return a fallback response
        return of({
          sessionId: this.sessionId() ?? 0,
          reply: 'Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard.'
        });
      })
    );
  }

  /**
   * Get the current session ID
   */
  getSessionId(): number | null {
    return this.sessionId();
  }

  /**
   * Reset the chat session
   */
  resetSession(): void {
    this.sessionId.set(null);
  }

  /**
   * Format clinic info for display
   */
  formatClinicsForDisplay(clinics: ClinicInfo[]): string {
    if (!clinics || clinics.length === 0) return '';
    
    return clinics.map(clinic => 
      `📍 ${clinic.name}\n   Spécialité: ${clinic.specialty}\n   Adresse: ${clinic.address}\n   Tél: ${clinic.phone}`
    ).join('\n\n');
  }

  /**
   * Format doctors info for display
   */
  formatDoctorsForDisplay(doctors: DoctorInfo[]): string {
    if (!doctors || doctors.length === 0) return '';
    
    return doctors.map(doctor => 
      `👨‍⚕️ Dr. ${doctor.firstName} ${doctor.lastName}${doctor.specialty ? `\n   Spécialité: ${doctor.specialty}` : ''}${doctor.phone ? `\n   Tél: ${doctor.phone}` : ''}`
    ).join('\n\n');
  }

  /**
   * Format slots info for display
   */
  formatSlotsForDisplay(slots: SlotInfo[]): string {
    if (!slots || slots.length === 0) return '';
    
    return slots.map(slot => 
      `🕐 ${slot.startTime} - ${slot.endTime}`
    ).join('\n');
  }
}
