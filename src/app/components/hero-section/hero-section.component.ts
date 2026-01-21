/**
 * Hero Section Component - Formulaire prise RDV en 3 étapes
 * 
 * Composant Angular standalone pour hero section du front office avec formulaire inscription patient + prise RDV.
 * Workflow: Landing visuel → Formulaire patient (Step 1) → Formulaire RDV (Step 2) → Confirmation (Step 3).
 * 
 * **Workflow 3 étapes:**
 * 1. **Step 1 - Informations personnelles:**
 *    - CIN (format marocain: 1-2 lettres + 5-7 chiffres)
 *    - Nom, Prénom (2-50 caractères, lettres uniquement)
 *    - Téléphone (format marocain: 06/07 + 8 chiffres ou +212)
 *    - Sexe (M/F → mappé MASCULIN/FEMININ pour backend)
 *    - Date naissance (doit être passée)
 *    - Type mutuelle (AUCUNE, CNSS, CNOPS, PRIVEE)
 *    - Cabinet (select depuis liste backend)
 *    - **Action:** Création patient via API (ou récupération si CIN existe)
 * 
 * 2. **Step 2 - Rendez-vous:**
 *    - Date (min = aujourd'hui)
 *    - Heure (créneaux 8h-18h)
 *    - Motif (Consultation/Contrôle → mappé CONSULTATION/CONTROL)
 *    - Notes optionnelles
 *    - **Action:** Création RDV via API avec patientId créé Step 1
 * 
 * 3. **Step 3 - Confirmation:**
 *    - Message succès avec récapitulatif
 *    - Bouton "Nouveau rendez-vous" (resetForm)
 * 
 * **Features:**
 * - Validation réactive avec affichage erreurs sous chaque champ (validationErrors)
 * - Loading states avec spinners (isLoading)
 * - Error handling gracieux (409 Conflict = patient existe → fetch by CIN)
 * - Fallback clinics si backend indisponible (defaultClinics)
 * - Auto-calcul heure fin RDV (+1h depuis heure début)
 * 
 * **Architecture:**
 * - Standalone component (imports: CommonModule, FormsModule)
 * - ApiService injecté pour API calls (patients, clinics, RDV)
 * - ChangeDetectorRef pour manual detection changes (async flows)
 * - Interfaces typées: PersonalInfo, AppointmentInfo, ClinicDTO, PatientDTO, RDVRequest
 * 
 * **Validation patterns:**
 * - CIN: /^[A-Z]{1,2}[0-9]{5,7}$/
 * - Nom/Prénom: /^[a-zA-ZÀ-ÿ\s'-]+$/ (2-50 chars)
 * - Téléphone: /^(\+212|0)[5-7]\d{8}$/ (format marocain)
 * - Date naissance: birthDate < today (pas future)
 * 
 * @example
 * ```html
 * <app-hero-section></app-hero-section>
 * ```
 * 
 * @author CabinetX Team
 * @version 1.0
 * @since 2024
 */
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, ClinicDTO, PatientDTO, RDVRequest } from '../../services/api.service';
import { catchError, of } from 'rxjs';

/**
 * Interface PersonalInfo - Données personnelles patient (Step 1).
 * 
 * @property {string} nom - Nom de famille (2-50 chars, lettres uniquement)
 * @property {string} prenom - Prénom (2-50 chars, lettres uniquement)
 * @property {string} tel - Téléphone marocain (06/07XXXXXXXX ou +212XXXXXXXXX)
 * @property {string} sexe - Sexe (M/F → mappé MASCULIN/FEMININ backend)
 * @property {string} cin - Carte identité nationale marocaine (ex: AB123456)
 * @property {string} dateNaissance - Date ISO format (YYYY-MM-DD)
 * @property {string} typeMutuelle - Type assurance (AUCUNE, CNSS, CNOPS, PRIVEE)
 * @property {number | null} cabinetId - ID du cabinet sélectionné
 */
interface PersonalInfo {
  nom: string;
  prenom: string;
  tel: string;
  sexe: string;
  cin: string;
  dateNaissance: string;
  typeMutuelle: string;
  cabinetId: number | null;
}

/**
 * Interface AppointmentInfo - Données rendez-vous (Step 2).
 * 
 * @property {string} date - Date RDV ISO format (YYYY-MM-DD)
 * @property {string} heure - Heure début RDV (HH:MM format 24h)
 * @property {string} motif - Motif RDV (Consultation/Contrôle)
 * @property {string} notes - Notes additionnelles optionnelles
 */
interface AppointmentInfo {
  date: string;
  heure: string;
  motif: string;
  notes: string;
}

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css']
})
export class HeroSectionComponent implements OnInit {
  /** Service API injecté pour CRUD patients, clinics, RDV */
  private apiService = inject(ApiService);
  
  /** ChangeDetectorRef pour forcer detection changes après async API calls */
  private cdr = inject(ChangeDetectorRef);
  
  /** Étape courante du formulaire (1 = patient, 2 = RDV, 3 = confirmation) */
  currentStep = 1;
  
  /** Flag succès soumission formulaire (affiche confirmation Step 3) */
  isFormSubmitted = false;
  
  /** Flag loading state (affiche spinner pendant API calls) */
  isLoading = false;
  
  /** Message erreur global (affiché en haut formulaire si échec API) */
  errorMessage = '';
  
  /** ID patient créé à Step 1 (utilisé pour création RDV Step 2) */
  createdPatientId: number | null = null;
  
  /** Map erreurs validation par champ (clé = nom champ, valeur = message erreur) */
  validationErrors: { [key: string]: string } = {};

  /** Données formulaire Step 1 (informations personnelles patient) */
  personalInfo: PersonalInfo = {
    nom: '',
    prenom: '',
    tel: '',
    sexe: '',
    cin: '',
    dateNaissance: '',
    typeMutuelle: '',
    cabinetId: null
  };

  /** Données formulaire Step 2 (rendez-vous) */
  appointmentInfo: AppointmentInfo = {
    date: '',
    heure: '',
    motif: '',
    notes: ''
  };

  /** Options mutuelles disponibles (conformes enum backend TypeMutuelle) */
  mutuelles = ['AUCUNE', 'CNSS', 'CNOPS', 'PRIVEE'];
  
  /** Créneaux horaires disponibles (8h-18h, pas de RDV après 18h) */
  heures = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  
  /** Motifs RDV disponibles (mappés CONSULTATION/CONTROL backend) */
  motifs = ['Consultation', 'Contrôle'];
  
  /** Cabinets chargés depuis backend (peuplé dans ngOnInit) */
  cabinets: ClinicDTO[] = [];
  
  /**
   * Cabinets par défaut si backend indisponible (fallback gracieux).
   * Permet de tester formulaire sans backend actif.
   */
  private defaultClinics: ClinicDTO[] = [
    { id: 1, name: 'Cabinet Dr. Martin', specialty: 'Médecine générale', phone: '0612345678', address: 'Centre Ville', status: 'ACTIVE', serviceEndDate: '2027-12-31' },
    { id: 2, name: 'Cabinet Dr. Dupont', specialty: 'Dermatologie', phone: '0623456789', address: 'Quartier Nord', status: 'ACTIVE', serviceEndDate: '2027-12-31' },
    { id: 3, name: 'Cabinet Dr. Bernard', specialty: 'Cardiologie', phone: '0634567890', address: 'Zone Sud', status: 'ACTIVE', serviceEndDate: '2027-12-31' }
  ];

  /**
   * Lifecycle hook: charge les cabinets actifs au montage du composant.
   * Appelle loadClinics() pour peupler dropdown select.
   */
  ngOnInit(): void {
    this.loadClinics();
  }

  /**
   * Charge la liste des cabinets actifs depuis le backend.
   * 
   * **Flow:**
   * 1. GET /api/clinics/active via ApiService
   * 2. Si succès: peuple cabinets[] avec réponse
   * 3. Si échec: fallback sur defaultClinics[] (3 cabinets fictifs)
   * 
   * **Graceful degradation:** Permet de tester formulaire sans backend actif.
   * 
   * @example
   * ```typescript
   * // Backend OK: cabinets = [{ id: 1, name: "Cabinet Dr. Alami", ... }, ...]
   * // Backend KO: cabinets = defaultClinics
   * ```
   */
  loadClinics(): void {
    this.apiService.getClinicsActive().pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des cabinets:', error);
        console.log('Utilisation des cabinets par défaut');
        return of(this.defaultClinics);
      })
    ).subscribe(clinics => {
      this.cabinets = clinics.length > 0 ? clinics : this.defaultClinics;
    });
  }

  /**
   * Getter: Date minimale pour input date (aujourd'hui).
   * Empêche sélection dates passées pour RDV.
   * 
   * @returns Date format ISO YYYY-MM-DD
   */
  get minDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  /**
   * Passe à Step 2 après validation et création patient.
   * 
   * **Flow:**
   * 1. Valide tous les champs Step 1 (validateStep1)
   * 2. Si erreurs: affiche messages sous champs + errorMessage global
   * 3. Si valid: crée patient via POST /api/patients
   * 4. Si succès: stocke createdPatientId + passe currentStep = 2
   * 5. Si 409 Conflict (CIN existe): GET /api/patients/cin/{cin} + passe Step 2
   * 6. Si autre erreur: affiche errorMessage
   * 
   * **Mapping sexe:** M/F (frontend) → MASCULIN/FEMININ (backend enum Sexe)
   * 
   * **Error handling:**
   * - 409 Conflict = Patient existe déjà → récupération par CIN (graceful)
   * - 400/500 = Erreur serveur → affichage errorMessage
   */
  nextStep(): void {
    if (!this.validateStep1()) {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    // Mapper M/F vers MASCULIN/FEMININ pour le backend
    const sexeMapping: { [key: string]: 'MASCULIN' | 'FEMININ' | 'AUTRE' } = {
      'M': 'MASCULIN',
      'F': 'FEMININ'
    };
    
    const patientData: PatientDTO = {
      cin: this.personalInfo.cin.toUpperCase(),
      nom: this.personalInfo.nom,
      prenom: this.personalInfo.prenom,
      dateNaissance: this.personalInfo.dateNaissance,
      sexe: sexeMapping[this.personalInfo.sexe] || 'AUTRE',
      numTel: this.personalInfo.tel.replace(/\s/g, ''),
      typeMutuelle: this.personalInfo.typeMutuelle as 'AUCUNE' | 'CNSS' | 'CNOPS' | 'PRIVEE',
      cabinetId: this.personalInfo.cabinetId!
    };

    this.apiService.createPatient(patientData).subscribe({
      next: (patient) => {
        this.createdPatientId = patient.id!;
        this.currentStep = 2;
        this.isLoading = false;
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors de la création du patient:', error);
        // Si le patient existe déjà (CIN), on essaie de le récupérer
        if (error.status === 409 || error.status === 400) {
          this.apiService.getPatientByCin(patientData.cin).subscribe({
            next: (patient) => {
              this.createdPatientId = patient.id!;
              this.currentStep = 2;
              this.isLoading = false;
              this.errorMessage = '';
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Erreur lors de la récupération du patient:', err);
              this.errorMessage = error.error?.message || 'Erreur lors de la création du patient';
              this.isLoading = false;
              this.cdr.detectChanges();
            }
          });
        } else {
          this.errorMessage = error.error?.message || 'Erreur lors de la création du patient';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      }
    });
  }

  /**
   * Retour à Step 1 (depuis Step 2).
   * Reset errorMessage global.
   */
  previousStep(): void {
    this.currentStep = 1;
    this.errorMessage = '';
  }

  /**
   * Valide tous les champs du formulaire Step 1 (informations personnelles).
   * 
   * **Validations:**
   * - **CIN:** Format marocain /^[A-Z]{1,2}[0-9]{5,7}$/ (ex: AB123456)
   * - **Nom/Prénom:** 2-50 chars, lettres uniquement /^[a-zA-ZÀ-ÿ\s'-]+$/
   * - **Téléphone:** Format marocain /^(\+212|0)[5-7]\d{8}$/ (ex: 0612345678)
   * - **Sexe:** Obligatoire (M ou F)
   * - **Date naissance:** Obligatoire + doit être passée (birthDate < today)
   * - **Type mutuelle:** Obligatoire (AUCUNE, CNSS, CNOPS, PRIVEE)
   * - **Cabinet:** Obligatoire (cabinetId not null)
   * 
   * **Output:** Peuple validationErrors{} avec messages erreurs par champ.
   * 
   * @returns true si tous champs valides, false sinon
   * 
   * @example
   * ```typescript
   * validateStep1(); // false → validationErrors = { cin: "Format CIN invalide", tel: "Format téléphone invalide" }
   * ```
   */
  validateStep1(): boolean {
    this.validationErrors = {};
    let isValid = true;

    // Validate CIN - Must be 1-2 letters followed by 5-7 digits
    const cinPattern = /^[A-Z]{1,2}[0-9]{5,7}$/;
    if (!this.personalInfo.cin) {
      this.validationErrors['cin'] = 'Le CIN est obligatoire';
      isValid = false;
    } else if (!cinPattern.test(this.personalInfo.cin.toUpperCase())) {
      this.validationErrors['cin'] = 'Format de CIN invalide (ex: AB123456)';
      isValid = false;
    }

    // Validate nom - 2-50 characters, letters only
    const namePattern = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!this.personalInfo.nom) {
      this.validationErrors['nom'] = 'Le nom est obligatoire';
      isValid = false;
    } else if (this.personalInfo.nom.length < 2 || this.personalInfo.nom.length > 50) {
      this.validationErrors['nom'] = 'Le nom doit contenir entre 2 et 50 caractères';
      isValid = false;
    } else if (!namePattern.test(this.personalInfo.nom)) {
      this.validationErrors['nom'] = 'Le nom contient des caractères invalides';
      isValid = false;
    }

    // Validate prenom - 2-50 characters, letters only
    if (!this.personalInfo.prenom) {
      this.validationErrors['prenom'] = 'Le prénom est obligatoire';
      isValid = false;
    } else if (this.personalInfo.prenom.length < 2 || this.personalInfo.prenom.length > 50) {
      this.validationErrors['prenom'] = 'Le prénom doit contenir entre 2 et 50 caractères';
      isValid = false;
    } else if (!namePattern.test(this.personalInfo.prenom)) {
      this.validationErrors['prenom'] = 'Le prénom contient des caractères invalides';
      isValid = false;
    }

    // Validate phone - Moroccan format
    const phonePattern = /^(\+212|0)[5-7]\d{8}$/;
    if (!this.personalInfo.tel) {
      this.validationErrors['tel'] = 'Le numéro de téléphone est obligatoire';
      isValid = false;
    } else if (!phonePattern.test(this.personalInfo.tel.replace(/\s/g, ''))) {
      this.validationErrors['tel'] = 'Format de téléphone invalide (ex: 0612345678 ou +212612345678)';
      isValid = false;
    }

    // Validate sexe
    if (!this.personalInfo.sexe) {
      this.validationErrors['sexe'] = 'Le sexe est obligatoire';
      isValid = false;
    }

    // Validate date de naissance - must be in the past
    if (!this.personalInfo.dateNaissance) {
      this.validationErrors['dateNaissance'] = 'La date de naissance est obligatoire';
      isValid = false;
    } else {
      const birthDate = new Date(this.personalInfo.dateNaissance);
      const today = new Date();
      if (birthDate >= today) {
        this.validationErrors['dateNaissance'] = 'La date de naissance doit être dans le passé';
        isValid = false;
      }
    }

    // Validate typeMutuelle
    if (!this.personalInfo.typeMutuelle) {
      this.validationErrors['typeMutuelle'] = 'Le type de mutuelle est obligatoire';
      isValid = false;
    }

    // Validate cabinetId
    if (!this.personalInfo.cabinetId) {
      this.validationErrors['cabinetId'] = 'Le cabinet est obligatoire';
      isValid = false;
    }

    return isValid;
  }

  /**
   * Vérifie si Step 1 est complété (tous champs remplis).
   * N'effectue PAS de validation format (voir validateStep1).
   * 
   * @returns true si tous champs non vides
   */
  isStep1Valid(): boolean {
    return !!(
      this.personalInfo.nom &&
      this.personalInfo.prenom &&
      this.personalInfo.tel &&
      this.personalInfo.sexe &&
      this.personalInfo.cin &&
      this.personalInfo.dateNaissance &&
      this.personalInfo.typeMutuelle &&
      this.personalInfo.cabinetId
    );
  }

  /**
   * Vérifie si Step 2 est complété (champs obligatoires remplis).
   * Notes optionnelles non requises.
   * 
   * @returns true si date, heure, motif remplis
   */
  isStep2Valid(): boolean {
    return !!(
      this.appointmentInfo.date &&
      this.appointmentInfo.heure &&
      this.appointmentInfo.motif
    );
  }

  /**
   * Soumission formulaire Step 2 (création RDV).
   * 
   * **Flow:**
   * 1. Vérifie Step 2 valid + createdPatientId + cabinetId non null
   * 2. Calcule heureFin (heureDebut + 1h)
   * 3. Mappe motif: "Consultation" → "CONSULTATION", "Contrôle" → "CONTROL" (enum backend MotifRDV)
   * 4. Crée RDVRequest avec patientId, cabinetId, date, heures, motif, notes
   * 5. POST /api/appointments
   * 6. Si succès: isFormSubmitted = true (affiche Step 3 confirmation)
   * 7. Si échec: affiche errorMessage
   * 
   * **Auto-calcul heure fin:**
   * - heureDebut = '10:00' → heureFin = '11:00'
   * - heureDebut = '18:00' → heureFin = '19:00' (hors horaires, mais calculé)
   * 
   * @example
   * ```typescript
   * // appointmentInfo = { date: '2024-01-15', heure: '10:00', motif: 'Consultation', notes: 'Urgence' }
   * // → RDVRequest = { patientId: 42, cabinetId: 1, date: '2024-01-15', Heure_debut: '10:00', Heure_fin: '11:00', motifRDV: 'CONSULTATION', notes: 'Urgence' }
   * ```
   */
  submitForm(): void {
    if (this.isStep2Valid() && this.createdPatientId && this.personalInfo.cabinetId) {
      this.isLoading = true;
      this.errorMessage = '';

      // Calcul heure fin = heure début + 1h (durée consultation standard)
      const heureDebut = this.appointmentInfo.heure;
      const [hours, minutes] = heureDebut.split(':').map(Number);
      const heureFin = `${String(hours + 1).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

      // Mapping motif frontend (Consultation/Contrôle) vers enum backend (CONSULTATION/CONTROL)
      const motifRDV = this.appointmentInfo.motif === 'Consultation' ? 'CONSULTATION' : 'CONTROL';

      const rdvData: RDVRequest = {
        patientId: this.createdPatientId,
        cabinetId: this.personalInfo.cabinetId,
        date: this.appointmentInfo.date,
        Heure_debut: heureDebut,
        Heure_fin: heureFin,
        motifRDV: motifRDV,
        notes: this.appointmentInfo.notes || undefined
      };

      this.apiService.createAppointment(rdvData).subscribe({
        next: () => {
          this.isFormSubmitted = true;
          this.isLoading = false;
          this.errorMessage = '';
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erreur lors de la création du rendez-vous:', error);
          this.errorMessage = error.error?.message || 'Erreur lors de la création du rendez-vous';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  /**
   * Reset complet du formulaire (après confirmation Step 3).
   * 
   * **Resets:**
   * - currentStep → 1
   * - isFormSubmitted → false
   * - isLoading → false
   * - errorMessage → ''
   * - createdPatientId → null
   * - validationErrors → {}
   * - personalInfo → valeurs initiales vides
   * - appointmentInfo → valeurs initiales vides
   * 
   * **Usage:** Bouton "Nouveau rendez-vous" sur Step 3 confirmation.
   * 
   * @example
   * ```html
   * <button (click)="resetForm()">Nouveau rendez-vous</button>
   * ```
   */
  resetForm(): void {
    this.currentStep = 1;
    this.isFormSubmitted = false;
    this.isLoading = false;
    this.errorMessage = '';
    this.createdPatientId = null;
    this.validationErrors = {};
    this.personalInfo = {
      nom: '',
      prenom: '',
      tel: '',
      sexe: '',
      cin: '',
      dateNaissance: '',
      typeMutuelle: '',
      cabinetId: null
    };
    this.appointmentInfo = {
      date: '',
      heure: '',
      motif: '',
      notes: ''
    };
  }
}
