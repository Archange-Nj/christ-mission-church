export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  series: string | null;
  theme: string;
  description: string;
  youtube_url: string;
  thumbnail_url: string;
  published_at: string; // ISO date
  duration_minutes: number | null;
}

export type ChurchEventCategory =
  | 'culte'
  | 'priere'
  | 'jeunesse'
  | 'communaute'
  | 'special';

export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  category: ChurchEventCategory;
  starts_at: string; // ISO datetime
  ends_at: string | null; // ISO datetime
  image_url: string | null;
  registration_required: boolean;
  capacity: number | null;
  spots_taken: number | null;
}

export interface EventRegistration {
  event_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  guests: number;
  message: string | null;
}

export type PrayerRequestCategory =
  | 'sante'
  | 'famille'
  | 'travail'
  | 'spirituel'
  | 'deuil'
  | 'autre';

export interface PrayerRequest {
  full_name: string;
  email: string;
  phone: string | null;
  category: PrayerRequestCategory;
  message: string;
  is_confidential: boolean;
}

export interface ContactMessage {
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
}

export type DonationMethod = 'card' | 'mobile_money' | 'bank_transfer';

export type DonationFund =
  | 'general'
  | 'missions'
  | 'construction'
  | 'jeunesse'
  | 'benevolence';

export interface Donation {
  full_name: string;
  email: string;
  amount: number;
  currency: 'XAF' | 'USD' | 'EUR';
  fund: DonationFund;
  method: DonationMethod;
  is_recurring: boolean;
  message: string | null;
}

export interface WorshipServiceTime {
  id: string;
  label: string;
  day: string;
  time: string;
  location: string;
}

export interface ServiceGroup {
  id: string;
  title: string;
  description: string;
  image_url: string;
  href: string;
}
