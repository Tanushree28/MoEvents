// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // ✅ Import AuthContext

const AdminDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventCount, setEventCount] = useState(0);
  const [totalEventCount, setTotalEventCount] = useState(0);
  const [registrations, setRegistrations] = useState([]);
  const [eventsOnSelectedDate, setEventsOnSelectedDate] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const { logout } = useAuth(); // ✅ useAuth Hook

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: '',
    department: '',
    date: '',
    time: '',
    location: '',
    created_by: 1,
  });

  useEffect(() => {
    fetchEventCount();
    fetchTotalEvents();
    fetchRegistrationsPerEvent();
    fetchEventsByDate();
  }, [selectedDate]);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const fetchEventCount = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/visuals/event_count?date=${formatDate(selectedDate)}`);
      setEventCount(res.data.count);
    } catch (err) {
      console.error('Event count error:', err);
    }
  };

  const fetchTotalEvents = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/visuals/total_events');
      setTotalEventCount(res.data.count);
    } catch (err) {
      console.error('Total events error:', err);
    }
  };

  const fetchRegistrationsPerEvent = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/visuals/registrations_per_event');
      setRegistrations(res.data.data);
    } catch (err) {
      console.error('Registrations error:', err);
    }
  };

  const fetchEventsByDate = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/events/upcoming/${formatDate(selectedDate)}`);
      setEventsOnSelectedDate(res.data);
    } catch (err) {
      console.log('No event found or error fetching by date');
      setEventsOnSelectedDate([]);
    }
  };

  const handleCreateEvent = async () => {
    try {
      const payload = {
        ...formData,
        date: formatDate(selectedDate),
        time: formData.time.length > 5 ? formData.time.substring(11, 19) : formData.time,
      };
      await axios.post('http://127.0.0.1:8000/events/', payload);
      alert('Event created!');
      resetForm();
      fetchEventCount();
      fetchTotalEvents();
      fetchEventsByDate();
    } catch (err) {
      console.error('Create event error:', err);
      alert('Error creating event');
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEventId) return alert('Select event first');
    try {
      const payload = {
        ...formData,
        date: formatDate(selectedDate),
        time: formData.time.length > 5 ? formData.time.substring(11, 19) : formData.time,
      };
      await axios.put(`http://127.0.0.1:8000/events/${selectedEventId}`, payload);
      alert('Event updated!');
      resetForm();
      fetchEventCount();
      fetchTotalEvents();
      fetchEventsByDate();
    } catch (err) {
      console.error('Update event error:', err);
      alert('Error updating event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const confirmDelete = window.confirm('Delete this event?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/events/${eventId}`);
      alert('Event deleted!');
      fetchEventCount();
      fetchTotalEvents();
      fetchEventsByDate();
    } catch (err) {
      console.error('Delete event error:', err);
      alert('Failed to delete event');
    }
  };

  const handleSelectEventForUpdate = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      event_type: event.event_type,
      department: event.department,
      time: event.time,
      location: event.location,
      date: event.date,
      created_by: event.created_by,
    });
    setSelectedEventId(event.event_id);
    setShowUpdateForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_type: '',
      department: '',
      date: '',
      time: '',
      location: '',
      created_by: 1,
    });
    setShowCreateForm(false);
    setShowUpdateForm(false);
    setSelectedEventId(null);
  };

  return (
    <div className="p-4">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Create Event
        </button>
        <button
          onClick={logout}
          className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Logout
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create New Event</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="Event Type" value={formData.event_type} onChange={(e) => setFormData({ ...formData, event_type: e.target.value })} className="border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="Department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="border border-gray-300 rounded px-3 py-2" />
            <input type="datetime-local" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="border border-gray-300 rounded px-3 py-2" />
            <button onClick={handleCreateEvent} className="bg-yellow-600 text-white px-4 py-2 rounded-lg col-span-full">
              Submit Event
            </button>
          </div>
        </div>
      )}

      {/* Update Form */}
      {showUpdateForm && (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Update Event</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="Event Type" value={formData.event_type} onChange={(e) => setFormData({ ...formData, event_type: e.target.value })} className="border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="Department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="border border-gray-300 rounded px-3 py-2" />
            <input type="datetime-local" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="border border-gray-300 rounded px-3 py-2" />
            <button onClick={handleUpdateEvent} className="bg-yellow-600 text-white px-4 py-2 rounded-lg col-span-full">
              Submit Update
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Statistics & Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold">Upcoming Events ({formatDate(selectedDate)})</h2>
            <p className="text-3xl font-bold text-blue-700">{eventCount}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold">Total Events</h2>
            <p className="text-3xl font-bold text-green-700">{totalEventCount}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Registrations per Event</h2>
            {registrations.map((event, idx) => (
              <div key={idx} className="flex justify-between py-1 border-b text-sm">
                <span>{event.title}</span>
                <span className="font-medium text-gray-700">{event.registration_count}</span>
              </div>
            ))}
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Events on {formatDate(selectedDate)}</h2>
            {eventsOnSelectedDate.length > 0 ? (
              eventsOnSelectedDate.map((event) => (
                <div key={event.event_id} className="flex justify-between items-center border-b py-2">
                  <span>{event.title}</span>
                  <div className="space-x-2">
                    <button onClick={() => handleSelectEventForUpdate(event)} className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded-lg">
                      Update
                    </button>
                    <button onClick={() => handleDeleteEvent(event.event_id)} className="bg-red-700 hover:bg-red-800 text-white text-sm px-3 py-1 rounded-lg">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No events found for selected date</p>
            )}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Select Date</h2>
          <Calendar onChange={setSelectedDate} value={selectedDate} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
