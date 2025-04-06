-- Inserting sample users (admins and students)
INSERT INTO Users (name, email, password, role) VALUES
('Admin User', 'admin@moevents.com', 'adminpassword', 'admin'),
('Student User', 'student@moevents.com', 'studentpassword', 'student');

-- Inserting sample events
INSERT INTO Events (title, description, event_type, department, date, time, location, created_by) VALUES
('Tech Talk: AI and the Future', 'An insightful talk on AI technology trends.', 'Seminar', 'Computer Science', '2025-04-10', '10:00:00', 'UCM Auditorium', 1),
('Workshop on Web Development', 'Hands-on workshop on building web applications.', 'Workshop', 'Engineering', '2025-04-15', '14:00:00', 'Engineering Hall', 1);

-- Inserting sample registrations
INSERT INTO Registrations (user_id, event_id) VALUES
(2, 1),  -- Student User registering for the Tech Talk
(2, 2);  -- Student User registering for the Web Development Workshop

-- Inserting sample feedback
INSERT INTO Feedback (user_id, event_id, rating, comment) VALUES
(2, 1, 5, 'Great session! Very informative and engaging.');
