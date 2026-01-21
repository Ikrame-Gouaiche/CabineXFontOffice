/**
 * API Service for Front Office Application
 * 
 * This service provides HTTP client methods for interacting with the CabinetX
 * backend API Gateway. It handles all REST API calls for clinic management,
 * patient registration, and appointment scheduling from the public-facing
 * front office application.
 * 
 * All requests are routed through the API Gateway at port 8080 which handles:
 * - Load balancing
 * - Service discovery
 * - Authentication/Authorization
 * - Rate limiting
 * 
 * @author CabinetX Development Team
 * @version 1.0
 * @since 2025
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Clinic Data Transfer Object
 * Represents a medical clinic/cabinet in the system
 */
export interface ClinicDTO {
  id: number;
  name: string;
  specialty: string;
  phone: string;
  address: string;
  logoUrl?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  serviceEndDate: string;
}

export interface PatientDTO {
  id?: number;
  cin: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'MASCULIN' | 'FEMININ' | 'AUTRE';
  numTel: string;
  typeMutuelle: 'AUCUNE' | 'CNSS' | 'CNOPS' | 'PRIVEE';
  cabinetId: number;
  adresse?: {
    rue?: string;
    ville?: string;
    codePostal?: string;
  };
  createdAt?: string;
}

export interface RDVRequest {
  patientId: number;
  cabinetId: number;
  date: string;
  Heure_debut: string;
  Heure_fin: string;
  motifRDV: 'CONSULTATION' | 'CONTROL';
  notes?: string;
}

export interface RDVResponse {
  id: number;
  patientId: number;
  cabinetId: number;
  date: string;
  heureDebut: string;
  heureFin: string;
  motifRDV: string;
  statut: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly gatewayUrl = 'http://localhost:8080';
  
  // URLs des services via le gateway
  private readonly clinicUrl = `${this.gatewayUrl}/api/clinics`;
  private readonly patientUrl = `${this.gatewayUrl}/api/patients`;
  private readonly appointmentUrl = `${this.gatewayUrl}/api/appointments`;

  constructor(private http: HttpClient) {}

  // Clinic Service
  getClinicsActive(): Observable<ClinicDTO[]> {
    return this.http.get<ClinicDTO[]>(`${this.clinicUrl}/active`);
  }

  getAllClinics(): Observable<ClinicDTO[]> {
    return this.http.get<ClinicDTO[]>(`${this.clinicUrl}`);
  }

  getClinicById(id: number): Observable<ClinicDTO> {
    return this.http.get<ClinicDTO>(`${this.clinicUrl}/${id}`);
  }

  // Patient Service
  createPatient(patient: PatientDTO): Observable<PatientDTO> {
    return this.http.post<PatientDTO>(`${this.patientUrl}`, patient);
  }

  getPatientByCin(cin: string): Observable<PatientDTO> {
    return this.http.get<PatientDTO>(`${this.patientUrl}/cin/${cin}`);
  }

  getPatientById(id: number): Observable<PatientDTO> {
    return this.http.get<PatientDTO>(`${this.patientUrl}/${id}`);
  }

  // Appointment Service
  createAppointment(rdv: RDVRequest): Observable<RDVResponse> {
    return this.http.post<RDVResponse>(`${this.appointmentUrl}/rendezvous`, rdv);
  }

  getAppointmentsByDate(date: string, cabinetId: number): Observable<RDVResponse[]> {
    return this.http.get<RDVResponse[]>(`${this.appointmentUrl}/by-date`, {
      params: { date, cabinetId: cabinetId.toString() }
    });
  }
}
