import sqlite3  # or import psycopg2 for PostgreSQL

# Connect to the database (SQLite example)
conn = sqlite3.connect('your_database.db')  # Change to your database name
cursor = conn.cursor()

# Create the uploaded_pdfs table
cursor.execute('''
CREATE TABLE IF NOT EXISTS uploaded_pdfs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    extracted_text TEXT
);
''')

# Commit changes and close the connection
conn.commit()

# Verify table creation
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Tables in the database:", tables)

conn.close()
