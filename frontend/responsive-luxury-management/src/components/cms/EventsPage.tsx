import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { eventsApi, Event } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Modal from './Modal';
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin, Users, Loader2 } from 'lucide-react';

interface EventsPageProps {
  role: UserRole;
}

const EventsPage: React.FC<EventsPageProps> = ({ role }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    target_audience: [] as string[]
  });
  const { toast } = useToast();

  const canModify = role === 'admin' || role === 'hr';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await eventsApi.getAll();
      if (response.data) setEvents(response.data);
      if (response.error) {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    setIsSubmitting(true);
    try {
      if (selectedEvent) {
        const response = await eventsApi.update(selectedEvent.id, {
          title: formData.title,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          target_audience: formData.target_audience
        });
        
        if (response.error) {
          toast({ title: 'Error', description: response.error, variant: 'destructive' });
        } else {
          toast({ title: 'Success', description: 'Event updated successfully' });
          fetchData();
          setShowAddModal(false);
          resetForm();
        }
      } else {
        const response = await eventsApi.create({
          title: formData.title,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          target_audience: formData.target_audience
        });
        
        if (response.error) {
          toast({ title: 'Error', description: response.error, variant: 'destructive' });
        } else {
          toast({ title: 'Success', description: 'Event created successfully' });
          fetchData();
          setShowAddModal(false);
          resetForm();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    
    setIsSubmitting(true);
    try {
      const response = await eventsApi.delete(selectedEvent.id);
      
      if (response.error) {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Event deleted successfully' });
        fetchData();
        setShowDeleteModal(false);
        setSelectedEvent(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      target_audience: []
    });
    setSelectedEvent(null);
  };

  const audienceOptions = ['all', 'Engineering', 'Marketing', 'Sales', 'Finance', 'HR', 'Interns', 'Management'];

  const toggleAudience = (audience: string) => {
    setFormData(prev => ({
      ...prev,
      target_audience: prev.target_audience.includes(audience)
        ? prev.target_audience.filter(a => a !== audience)
        : [...prev.target_audience, audience]
    }));
  };

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = events.filter(e => new Date(e.date) < new Date());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Events</h1>
          <p className="text-gray-400">Company events and meetings</p>
        </div>
        {canModify && (
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A1929] font-semibold rounded-xl hover:from-[#E5C04A] hover:to-[#D4AF37] transition-all"
          >
            <Plus size={20} />
            Create Event
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{events.length}</p>
          <p className="text-sm text-gray-400">Total Events</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4">
          <p className="text-2xl font-bold text-[#D4AF37]">{upcomingEvents.length}</p>
          <p className="text-sm text-gray-400">Upcoming</p>
        </div>
        <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl p-4 col-span-2 sm:col-span-1">
          <p className="text-2xl font-bold text-gray-400">{pastEvents.length}</p>
          <p className="text-sm text-gray-400">Past Events</p>
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map(event => (
            <div
              key={event.id}
              className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl overflow-hidden hover:border-[#D4AF37]/50 transition-all group"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex flex-col items-center justify-center">
                      <span className="text-xs text-[#D4AF37]">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold text-white">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                  </div>
                  {canModify && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setFormData({
                            title: event.title,
                            description: event.description,
                            date: event.date,
                            time: event.time,
                            location: event.location,
                            target_audience: event.target_audience || []
                          });
                          setShowAddModal(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-[#1E3A5F] text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowDeleteModal(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-[#1E3A5F] text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{event.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock size={14} className="text-[#D4AF37]" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin size={14} className="text-[#D4AF37]" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users size={14} className="text-[#D4AF37]" />
                    <span>{(event.target_audience || []).join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {upcomingEvents.length === 0 && (
          <div className="text-center py-12 bg-[#0F2744] border border-[#1E3A5F] rounded-xl">
            <Calendar size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No upcoming events</p>
          </div>
        )}
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Past Events</h2>
          <div className="bg-[#0F2744] border border-[#1E3A5F] rounded-xl overflow-hidden">
            <div className="divide-y divide-[#1E3A5F]">
              {pastEvents.slice(0, 5).map(event => (
                <div key={event.id} className="p-4 flex items-center justify-between hover:bg-[#1E3A5F]/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-500/10 flex flex-col items-center justify-center">
                      <span className="text-xs text-gray-400">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-sm font-bold text-gray-400">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-400">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.location}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">Completed</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title={selectedEvent ? 'Edit Event' : 'Create New Event'}
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Event Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] resize-none"
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g., 10:00 AM"
                className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#1E3A5F] border border-[#2D4A6F] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Target Audience</label>
            <div className="flex flex-wrap gap-2">
              {audienceOptions.map(audience => (
                <button
                  key={audience}
                  type="button"
                  onClick={() => toggleAudience(audience)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    formData.target_audience.includes(audience)
                      ? 'bg-[#D4AF37] text-[#0A1929]'
                      : 'bg-[#1E3A5F] text-gray-300 hover:bg-[#2D4A6F]'
                  }`}
                >
                  {audience}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              className="px-4 py-2.5 border border-[#1E3A5F] text-gray-300 rounded-xl hover:bg-[#1E3A5F] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0A1929] font-semibold rounded-xl hover:from-[#E5C04A] hover:to-[#D4AF37] transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {selectedEvent ? 'Update' : 'Create'} Event
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedEvent(null);
        }}
        title="Delete Event"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete <span className="text-white font-medium">{selectedEvent?.title}</span>?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedEvent(null);
              }}
              className="px-4 py-2.5 border border-[#1E3A5F] text-gray-300 rounded-xl hover:bg-[#1E3A5F] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventsPage;
