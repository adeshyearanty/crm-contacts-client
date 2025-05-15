'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Contact } from '@/types/contact';

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

interface ApiResponse {
  contacts: Contact[];
  pagination: PaginationData;
}

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    company: '',
    jobTitle: '',
    city: '',
    state: '',
    country: '',
    createdAfter: '',
    createdBefore: '',
  });
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasMore: false
  });

  const fetchContacts = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (statusFilter) params.append('status', statusFilter);
      if (selectedTags.length) params.append('tags', selectedTags.join(','));
      
      // Add advanced filters
      if (filters.company) params.append('company', filters.company);
      if (filters.jobTitle) params.append('jobTitle', filters.jobTitle);
      if (filters.city) params.append('city', filters.city);
      if (filters.state) params.append('state', filters.state);
      if (filters.country) params.append('country', filters.country);
      if (filters.createdAfter) params.append('createdAfter', filters.createdAfter);
      if (filters.createdBefore) params.append('createdBefore', filters.createdBefore);
      
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());

      const response = await fetch(`/api/contacts?${params.toString()}`);
      const data: ApiResponse = await response.json();
      setContacts(data.contacts);
      setPagination(data.pagination);

      // Extract all unique tags
      const tags = new Set<string>();
      data.contacts.forEach((contact: Contact) => {
        contact.tags?.forEach((tag) => tags.add(tag));
      });
      setAllTags(Array.from(tags));
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter change
    fetchContacts();
  }, [searchQuery, statusFilter, selectedTags, filters]);

  useEffect(() => {
    fetchContacts();
  }, [pagination.page]);

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'lead', label: 'Lead' },
    { value: 'customer', label: 'Customer' },
    { value: 'prospect', label: 'Prospect' },
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setSelectedTags([]);
    setFilters({
      company: '',
      jobTitle: '',
      city: '',
      state: '',
      country: '',
      createdAfter: '',
      createdBefore: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Contacts</h2>
        <Link
          href="/contacts/new"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Add Contact</span>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        {/* Filters Section */}
        <div className="space-y-6">
          {/* Basic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search contacts..."
                className="w-full h-10 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full h-10 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Advanced Options
              </label>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="w-full h-10 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
              >
                {showAdvancedFilters ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Hide Filters
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Show Filters
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`h-8 px-3 rounded-full text-sm font-medium flex items-center ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
                        : 'bg-gray-50 text-gray-800 border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="space-y-6 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Advanced Filters</h3>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear All Filters
                </button>
              </div>

              {/* Company and Job Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Filter by company"
                    className="w-full h-10 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={filters.company}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    placeholder="Filter by job title"
                    className="w-full h-10 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={filters.jobTitle}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

              {/* Location Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Filter by city"
                    className="w-full h-10 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={filters.city}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="Filter by state"
                    className="w-full h-10 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={filters.state}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    placeholder="Filter by country"
                    className="w-full h-10 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={filters.country}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

              {/* Date Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created After
                  </label>
                  <input
                    type="date"
                    name="createdAfter"
                    className="w-full h-10 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={filters.createdAfter}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created Before
                  </label>
                  <input
                    type="date"
                    name="createdBefore"
                    className="w-full h-10 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={filters.createdBefore}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="mt-2 text-gray-500">No contacts found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contacts.map((contact) => (
                <div
                  key={contact._id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {contact.firstName} {contact.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{contact.email}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
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
                    
                    {contact.company && (
                      <p className="mt-2 text-sm text-gray-600">
                        {contact.jobTitle ? `${contact.jobTitle} at ` : ''}
                        {contact.company}
                      </p>
                    )}

                    {contact.tags && contact.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {contact.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex justify-end space-x-2">
                      <Link
                        href={`/contacts/${contact._id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </Link>
                      <span className="text-gray-300">|</span>
                      <Link
                        href={`/contacts/${contact._id}/edit`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 flex justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasMore}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
