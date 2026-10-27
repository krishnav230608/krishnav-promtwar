/**
 * Firestore Data Model & Schema Definition
 * Compliant with SDG 8.8 (Decent Work & Economic Growth)
 */

export interface FirestoreOrganization {
  id: string;
  name: string;
  industry: 'construction' | 'college';
  complianceCode: string;
  config: {
    workerTitle: string;
    supervisorTitle: string;
    overtimeThresholdHours: number;
    baseHourlyRate: number;
    overtimeRateMultiplier: number;
    hazardCategories: string[];
    geoFence: {
      latitude: number;
      longitude: number;
      radiusMeters: number;
    };
  };
  createdAt: string;
}

export interface FirestoreUser {
  id: string;
  orgId: string;
  role: 'worker' | 'employer' | 'safety_officer';
  name: string;
  phone: string;
  preferredLanguage: 'ta' | 'hi' | 'en';
  trade: string;
  hourlyRate: number;
  nationalWorkerId: string; // e.g. e-Shram / Aadhaar masked
  skills: Array<{
    id: string;
    title: string;
    issuer: string;
    level: string;
    issuedDate: string;
    verified: boolean;
  }>;
}

export interface FirestoreShift {
  id: string;
  userId: string;
  userName: string;
  orgId: string;
  industry: 'construction' | 'college';
  checkIn: string; // ISO timestamp
  checkOut: string | null;
  location: {
    latitude: number;
    longitude: number;
    siteName: string;
    inGeoFence: boolean;
  };
  regularHours: number;
  overtimeHours: number;
  fatigueFlag: boolean;
  status: 'ACTIVE' | 'COMPLETED';
}

export interface FirestoreGrievance {
  id: string;
  orgId: string;
  industry: 'construction' | 'college';
  isAnonymous: boolean;
  userId: string | null; // Null if anonymous to protect identity
  reporterName: string;
  category: string;
  transcript: string;
  audioBlobUrl?: string;
  language: 'ta-IN' | 'hi-IN' | 'en-IN';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  resolvedAt?: string;
}

export const FIRESTORE_RULES_SNIPPET = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Organizations: Public read for workers, admin-only write
    match /organizations/{orgId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'employer';
    }
    
    // Workers & Profiles
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || request.auth.token.role == 'employer';
    }
    
    // Shifts: Workers punch their own; employers view site shifts
    match /shifts/{shiftId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && (request.resource.data.userId == request.auth.uid || request.auth.token.role == 'employer');
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || request.auth.token.role == 'employer');
    }
    
    // Grievances: Anonymous creation permitted, identity stripped before storage
    match /grievances/{grievanceId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && (
        resource.data.isAnonymous == false && resource.data.userId == request.auth.uid ||
        request.auth.token.role in ['employer', 'safety_officer']
      );
      allow update: if request.auth.token.role in ['employer', 'safety_officer'];
    }
  }
}`;
