'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function AdvertisementPage() {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Sample data for sale events
  const saleEvents = [
    {
      id: 1,
      title: "Summer Sale Fest 2024",
      startDate: "2024-05-01",
      endDate: "2024-05-15",
      discountRange: "20-50%",
      category: "All Categories",
      status: "ongoing",
      description: "Join the biggest summer sale event of the year with amazing discounts across all categories.",
      participationDeadline: "2024-04-30",
      minDiscount: 20,
      maxDiscount: 50,
      termsAndConditions: [
        "Minimum discount of 20% required on all participating products",
        "Products must maintain stock throughout the sale period",
        "Cancellation rate should be below 3%",
        "Rating should be above 3.5 stars"
      ]
    },
    {
      id: 2,
      title: "Festive Flash Sale",
      startDate: "2024-06-01",
      endDate: "2024-06-05",
      discountRange: "30-60%",
      category: "Fashion & Electronics",
      status: "upcoming",
      description: "Special flash sale event for fashion and electronics with deep discounts.",
      participationDeadline: "2024-05-25",
      minDiscount: 30,
      maxDiscount: 60,
      termsAndConditions: [
        "Minimum discount of 30% required on all participating products",
        "Limited to Fashion and Electronics categories only",
        "Products must have minimum 4-star rating",
        "Seller performance score must be above 85%"
      ]
    }
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <Icon icon="solar:shop-2-linear" className="text-primary" width="32" height="32" />
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Sale Events</h1>
            <p className="text-sm text-gray-600">Participate in special sale events to boost your sales</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <div className="flex text-sm">
            <button 
              className={`py-3 px-6 border-b-2 ${activeTab === 'ongoing' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('ongoing')}
            >
              Ongoing Events
            </button>
            <button 
              className={`py-3 px-6 border-b-2 ${activeTab === 'upcoming' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Events
            </button>
            <button 
              className={`py-3 px-6 border-b-2 ${activeTab === 'past' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('past')}
            >
              Past Events
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="p-4">
          {saleEvents
            .filter(event => event.status === activeTab)
            .map(event => (
              <div key={event.id} className="mb-4 last:mb-0">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    </div>
                    <button 
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors"
                      onClick={() => setSelectedEvent(event)}
                    >
                      Participate Now
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Sale Period</p>
                      <p className="font-medium">{event.startDate} - {event.endDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Discount Range</p>
                      <p className="font-medium">{event.discountRange}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Category</p>
                      <p className="font-medium">{event.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Registration Deadline</p>
                      <p className="font-medium">{event.participationDeadline}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {saleEvents.filter(event => event.status === activeTab).length === 0 && (
            <div className="text-center py-8">
              <Icon icon="solar:calendar-mark-linear" className="mx-auto mb-3 text-gray-400" width="48" height="48" />
              <h3 className="text-gray-700 font-medium mb-1">No {activeTab} events</h3>
              <p className="text-sm text-gray-500">Check back later for new sale events</p>
            </div>
          )}
        </div>
      </div>

      {/* Event Participation Modal */}
      {selectedEvent && (
        <div className="fixed inset-0  bg-opacity-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{selectedEvent.title}</h2>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icon icon="solar:close-circle-linear" width="24" height="24" />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Terms & Conditions</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {selectedEvent.termsAndConditions.map((term, index) => (
                    <li key={index}>{term}</li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <button 
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    // Handle participation acceptance
                    setSelectedEvent(null);
                  }}
                >
                  Accept & Participate
                </button>
                <button 
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedEvent(null)}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
