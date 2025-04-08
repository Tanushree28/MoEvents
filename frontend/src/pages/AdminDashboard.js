import React from 'react';
import '../styles/admindashboard.css';

function AdminDashboard() {
  const upcomingEvents = [
    { id: 1, title: 'Tech Conference', date: '2025-04-10', description: 'A conference on latest tech trends.' },
    { id: 2, title: 'Hackathon', date: '2025-04-11', description: '48-hour coding marathon.' },
    { id: 3, title: 'AI Seminar', date: '2025-04-12', description: 'Seminar on AI in Education.' },
    { id: 4, title: 'Career Fair', date: '2025-04-13', description: 'Networking event with recruiters.' },
  ];

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>MoEvents Admin Panel</h1>
        <nav className="dashboard-nav">
          <button>Create Event</button>
          <button>Update Event</button>
          <button>Calendar</button>
        </nav>
      </header>

      <main className="dashboard-main">
        <section className="chart-section">
          <div className="chart-card">
            <h2>Bar Chart Placeholder</h2>
            <div className="chart-placeholder"></div>
          </div>
          <div className="chart-card">
            <h2>Pie Chart Placeholder</h2>
            <div className="chart-placeholder"></div>
          </div>
        </section>

        <section className="upcoming-events">
          <h2>Upcoming Events This Week</h2>
          <div className="event-scroll">
            {upcomingEvents.map(event => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p><strong>Date:</strong> {event.date}</p>
                <p>{event.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>© 2025 MoEvents. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default AdminDashboard;
