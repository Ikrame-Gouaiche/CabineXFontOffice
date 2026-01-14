import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, ClinicDTO, PatientDTO, RDVRequest } from '../../services/api.service';
import { catchError, of } from 'rxjs';

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
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  
  currentStep = 1;
  isFormSubmitted = false;
  isLoading = false;
  errorMessage = '';
  createdPatientId: number | null = null;
  
  // Validation errors
  validationErrors: { [key: string]: string } = {};

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

  appointmentInfo: AppointmentInfo = {
    date: '',
    heure: '',
    motif: '',
    notes: ''
  };

  mutuelles = ['AUCUNE', 'CNSS', 'CNOPS', 'PRIVEE'];
  
  heures = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  
  motifs = ['Consultation', 'Contrôle'];
  
  // Les cabinets seront chargés depuis le backend
  cabinets: ClinicDTO[] = [];
  
  // Cabinets par défaut si le backend n'est pas disponible
  private defaultClinics: ClinicDTO[] = [
    { id: 1, name: 'Cabinet Dr. Martin', specialty: 'Médecine générale', phone: '0612345678', address: 'Centre Ville', status: 'ACTIVE', serviceEndDate: '2027-12-31' },
    { id: 2, name: 'Cabinet Dr. Dupont', specialty: 'Dermatologie', phone: '0623456789', address: 'Quartier Nord', status: 'ACTIVE', serviceEndDate: '2027-12-31' },
    { id: 3, name: 'Cabinet Dr. Bernard', specialty: 'Cardiologie', phone: '0634567890', address: 'Zone Sud', status: 'ACTIVE', serviceEndDate: '2027-12-31' }
  ];

  ngOnInit(): void {
    this.loadClinics();
  }

  loadClinics(): void {
    this.apiService.getClinicsActive().pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des cabinets:', error);
        // Utiliser les cabinets par défaut si le backend n'est pas disponible
        console.log('Utilisation des cabinets par défaut');
        return of(this.defaultClinics);
      })
    ).subscribe(clinics => {
      this.cabinets = clinics.length > 0 ? clinics : this.defaultClinics;
    });
  }

  get minDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  nextStep(): void {
    // Validate all fields first
    if (!this.validateStep1()) {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    // Créer le patient lors du passage à l'étape 2
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

  previousStep(): void {
    this.currentStep = 1;
    this.errorMessage = '';
  }

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

  isStep2Valid(): boolean {
    return !!(
      this.appointmentInfo.date &&
      this.appointmentInfo.heure &&
      this.appointmentInfo.motif
    );
  }

  submitForm(): void {
    if (this.isStep2Valid() && this.createdPatientId && this.personalInfo.cabinetId) {
      this.isLoading = true;
      this.errorMessage = '';

      // Convertir l'heure en heure de début et heure de fin (1 heure de consultation)
      const heureDebut = this.appointmentInfo.heure;
      const [hours, minutes] = heureDebut.split(':').map(Number);
      const heureFin = `${String(hours + 1).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

      // Convertir le motif du formulaire en enum backend
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
