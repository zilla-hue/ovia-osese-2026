// Auto-generated Supabase table types (snake_case matches PostgreSQL convention)

export interface VisitorRow {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  participation_interest: string;
  arrival_date: string | null;
  departure_date: string | null;
  contact_preference: string;
  status: string;
  created_at: string;
}

export interface SponsorRow {
  id: number;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  sponsorship_level: string;
  message: string | null;
  status: string;
  created_at: string;
}

export interface NewsRow {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  published_at: string;
}

export interface MessageRow {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export interface DonationRow {
  id: number;
  donor_name: string;
  email: string;
  amount: number;
  currency: string;
  donation_type: string;
  payment_status: string;
  payment_reference: string | null;
  message: string | null;
  created_at: string;
}

export interface VolunteerRow {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  area_of_interest: string;
  availability: string;
  message: string | null;
  status: string;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      visitors: { Row: VisitorRow; Insert: Omit<VisitorRow, "id" | "created_at">; Update: Partial<VisitorRow> };
      sponsors: { Row: SponsorRow; Insert: Omit<SponsorRow, "id" | "created_at">; Update: Partial<SponsorRow> };
      news: { Row: NewsRow; Insert: Omit<NewsRow, "id" | "published_at">; Update: Partial<NewsRow> };
      messages: { Row: MessageRow; Insert: Omit<MessageRow, "id" | "created_at">; Update: Partial<MessageRow> };
      donations: { Row: DonationRow; Insert: Omit<DonationRow, "id" | "created_at">; Update: Partial<DonationRow> };
      volunteers: { Row: VolunteerRow; Insert: Omit<VolunteerRow, "id" | "created_at">; Update: Partial<VolunteerRow> };
    };
  };
};
