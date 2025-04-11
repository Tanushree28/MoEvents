import React, { useState } from "react";
import "../styles/admindashboard.css";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/atoms/card";

function AdminDashboard() {
  const [showCreateEventForm, setShowCreateEventForm] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDepartment, setEventDepartment] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventId, setEventId] = useState(1);
  const [createdBy, setCreatedBy] = useState(0);

  const { logout } = useAuth();

  const upcomingEvents = [
    {
      id: 1,
      title: "Tech Conference",
      date: "2025-04-10",
      description: "A conference on the latest tech trends.",
    },
    {
      id: 2,
      title: "Hackathon",
      date: "2025-04-11",
      description: "48-hour coding marathon.",
    },
    {
      id: 3,
      title: "AI Seminar",
      date: "2025-04-12",
      description: "Seminar on AI in Education.",
    },
    {
      id: 4,
      title: "Career Fair",
      date: "2025-04-13",
      description: "Networking event with recruiters.",
    },
  ];

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    const newEvent = {
      title: eventTitle,
      description: eventDescription,
      event_type: eventType,
      department: eventDepartment,
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      event_id: eventId,
      created_by: createdBy,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Event created successfully:", data);

        // ✅ Close the form
        setShowCreateEventForm(false);

        // ✅ Reset form fields
        setEventTitle("");
        setEventDate("");
        setEventDescription("");
        setEventType("");
        setEventDepartment("");
        setEventTime("");
        setEventLocation("");
        setEventId(eventId + 1); // optional increment
        setCreatedBy(0);
      } else {
        console.error("Failed to create event", response.statusText);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>MoEvents Admin Panel</h1>
        <button
          onClick={logout}
          type="button"
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Logout
        </button>
        <nav className="dashboard-nav">
          <button onClick={() => setShowCreateEventForm(true)}>
            Create Event
          </button>
          <button>Update Event</button>
          <button>Calendar</button>
        </nav>
      </header>

      {showCreateEventForm && (
        <div className="create-event-form">
          <h2>Create New Event</h2>
          <form onSubmit={handleCreateEvent}>
            <label>Title:</label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              required
            />
            <label>Date:</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
            <label>Description:</label>
            <textarea
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              required
            />
            <label>Event Type:</label>
            <input
              type="text"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              required
            />
            <label>Department:</label>
            <input
              type="text"
              value={eventDepartment}
              onChange={(e) => setEventDepartment(e.target.value)}
              required
            />
            <label>Time:</label>
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              required
            />
            <label>Location:</label>
            <input
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              required
            />
            <label>Event ID:</label>
            <input
              type="number"
              value={eventId}
              onChange={(e) => setEventId(Number(e.target.value))}
              required
            />
            <label>Created By:</label>
            <input
              type="number"
              value={createdBy}
              onChange={(e) => setCreatedBy(Number(e.target.value))}
              required
            />
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setShowCreateEventForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
      <h2>Upcoming Events This Week</h2>
      <div className="event-scroll">
        {upcomingEvents.map((event) => (
          <Card>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Date:</strong> {event.date}
              </p>
              <p>{event.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <footer className="dashboard-footer">
        <p>© 2025 MoEvents. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default AdminDashboard;
