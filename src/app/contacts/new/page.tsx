'use client';

import ContactForm from '@/components/ContactForm';
import { ContactFormData } from '@/types/contact';

export default function NewContact() {
  const handleSubmit = async (data: ContactFormData) => {
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? 'Failed to create contact');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">New Contact</h1>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <ContactForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
} 