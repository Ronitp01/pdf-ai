import sqlite3

# Connect to the database
conn = sqlite3.connect('your_database.db')  # Change to your database name
cursor = conn.cursor()

# Query the uploaded_pdfs table
cursor.execute("SELECT * FROM uploaded_pdfs;")
rows = cursor.fetchall()

# Print the results
if rows:
    print("Contents of the uploaded_pdfs table:")
    for row in rows:
        print(row)
else:
    print("The uploaded_pdfs table is empty.")

# Close the connection
conn.close()
