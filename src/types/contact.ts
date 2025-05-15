export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export interface SocialMedia {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
}

export interface Contact {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  tags?: string[];
  address?: Address;
  socialMedia?: SocialMedia;
  notes?: string;
  status?: 'active' | 'inactive' | 'lead' | 'customer' | 'prospect';
  source?: string;
  lastContactedDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ContactFormData = Omit<Contact, '_id' | 'createdAt' | 'updatedAt'>; 