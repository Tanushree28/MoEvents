import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import weekday from "dayjs/plugin/weekday";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { useAuth } from '../contexts/AuthContext';

dayjs.extend(isBetween);
dayjs.extend(weekday);

const StudentDashboard = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventsOnSelectedDate, setEventsOnSelectedDate] = useState([]);
  const { login} = useAuth();

  // Dummy user_id (you can replace this with actual logged-in user's ID later)
  const userId = 8;

  // Fetch all events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/events/");
        setAllEvents(res.data);
      } catch (error) {
        console.error("Error fetching all events:", error);
      }
    };
    fetchEvents();
  }, []);

  // Fetch events for selected date
  useEffect(() => {
    const fetchEventsByDate = async () => {
      const formatted = dayjs(selectedDate).format("YYYY-MM-DD");
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/events/upcoming/${formatted}`
        );
        setEventsOnSelectedDate(res.data);
      } catch (error) {
        console.error("Error fetching date-specific events:", error);
      }
    };
    fetchEventsByDate();
  }, [selectedDate]);

  // Filter events for this week
  const thisWeek = () => {
    const start = dayjs().weekday(0);
    const end = dayjs().weekday(6);

    return allEvents.filter((event) =>
      dayjs(event.date).isBetween(start, end, null, "[]")
    );
  };

  // Handle Register Button
  const handleRegister = async (eventId) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/registration/", {
        user_id: userId,
        event_id: eventId,
      });
      alert("Successfully registered!");
      console.log(res.data);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Failed to register for the event.");
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Week View */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">This Week's Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {thisWeek().map((event) => (
            <div
              key={event.event_id}
              className="bg-white shadow rounded-xl p-4 border border-red-200"
            >
              <h3 className="text-lg font-bold text-red-700">{event.title}</h3>
              <p className="text-sm">{event.description}</p>
              <p className="text-sm font-medium mt-2">
                📅 {event.date} ⏰ {event.time}
              </p>
              <p className="text-sm">📍 {event.location}</p>
              <button
                onClick={() => handleRegister(event.event_id)}
                className="mt-3 bg-red-700 text-white px-4 py-1 rounded hover:bg-red-800 transition"
              >
                Register
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Calendar View */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Events by Date</h2>
        <Calendar onChange={setSelectedDate} value={selectedDate} />
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            Events on {dayjs(selectedDate).format("MMMM D, YYYY")}
          </h3>
          {eventsOnSelectedDate.length === 0 ? (
            <p className="text-gray-500">No events on this day.</p>
          ) : (
            <div className="space-y-3">
              {eventsOnSelectedDate.map((event) => (
                <div
                  key={event.event_id}
                  className="p-4 border border-gray-200 rounded-xl bg-white shadow"
                >
                  <h4 className="text-red-700 font-semibold">{event.title}</h4>
                  <p>{event.description}</p>
                  <p className="text-sm mt-1">⏰ {event.time}</p>
                  <p className="text-sm">📍 {event.location}</p>
                  <button
                    onClick={() => handleRegister(event.event_id)}
                    className="mt-2 bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800 transition"
                  >
                    Register
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
