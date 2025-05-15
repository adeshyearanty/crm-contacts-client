'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Contact } from '@/types/contact';

export default function ContactDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch(`/api/contacts/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error('Contact not found');
        }
        const data = await response.json();
        setContact(data);
      } catch (err) {
        setError('Failed to load contact');
        console.error('Error fetching contact:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [resolvedParams.id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      const response = await fetch(`/api/contacts/${resolvedParams.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }

      router.push('/');
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError('Failed to delete contact');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error || !contact) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
        {error || 'Contact not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {contact.firstName} {contact.lastName}
          </h1>
        </div>
        <div className="space-x-3">
          <Link
            href={`/contacts/${contact._id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-sm text-gray-900">{contact.email}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p className="mt-1 text-sm text-gray-900">{contact.phone || '-'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Company</h3>
              <p className="mt-1 text-sm text-gray-900">
                {contact.company || '-'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Job Title</h3>
              <p className="mt-1 text-sm text-gray-900">
                {contact.jobTitle || '-'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <span
                className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  contact.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : contact.status === 'inactive'
                    ? 'bg-red-100 text-red-800'
                    : contact.status === 'lead'
                    ? 'bg-yellow-100 text-yellow-800'
                    : contact.status === 'customer'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {contact.status || 'N/A'}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Source</h3>
              <p className="mt-1 text-sm text-gray-900">
                {contact.source || '-'}
              </p>
            </div>

            {contact.tags && contact.tags.length > 0 && (
              <div className="sm:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {contact.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {contact.address && (
              <div className="sm:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <div className="mt-1 text-sm text-gray-900">
                  {contact.address.street && <p>{contact.address.street}</p>}
                  <p>
                    {[
                      contact.address.city,
                      contact.address.state,
                      contact.address.zipCode,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  {contact.address.country && <p>{contact.address.country}</p>}
                </div>
              </div>
            )}

            {contact.socialMedia && (
              <div className="sm:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">
                  Social Media
                </h3>
                <div className="mt-1 space-y-1">
                  {contact.socialMedia.linkedin && (
                    <a
                      href={contact.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      LinkedIn
                    </a>
                  )}
                  {contact.socialMedia.twitter && (
                    <a
                      href={contact.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-500 block"
                    >
                      Twitter
                    </a>
                  )}
                  {contact.socialMedia.facebook && (
                    <a
                      href={contact.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-500 block"
                    >
                      Facebook
                    </a>
                  )}
                </div>
              </div>
            )}

            {contact.notes && (
              <div className="sm:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {contact.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 