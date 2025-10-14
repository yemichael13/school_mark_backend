USE school_mark_db;

-- Insert admin with hashed password (password: admin123)
INSERT INTO admins (name, email, password)
VALUES ('Admin User', 'admin@school.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert teachers with hashed passwords (password: teacher123)
INSERT INTO teachers (name, email, password)
VALUES
('Alice Teacher', 'alice@school.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Bob Teacher', 'bob@school.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert students
INSERT INTO students (name, class) VALUES
('John Doe', 'Grade 8'),
('Jane Smith', 'Grade 8'),
('Mike Johnson', 'Grade 9'),
('Sarah Wilson', 'Grade 9');

-- Insert subjects
INSERT INTO subjects (name) VALUES
('Mathematics'),
('English'),
('Science'),
('History');
