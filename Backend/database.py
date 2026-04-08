import sqlite3
from sqlite3 import Error
import os

DB_FILE = "campus_resources.db"

def create_connection():
    conn = None
    try:
        conn = sqlite3.connect(DB_FILE)
        # Enable row access by column name
        conn.row_factory = sqlite3.Row
        return conn
    except Error as e:
        print(e)
    return conn

def create_tables():
    conn = create_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS resources (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    type TEXT NOT NULL,
                    capacity INTEGER NOT NULL,
                    is_available BOOLEAN NOT NULL DEFAULT 1,
                    location TEXT
                );
            """)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS bookings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    resource_id INTEGER NOT NULL,
                    user_name TEXT NOT NULL,
                    start_time TEXT NOT NULL,
                    end_time TEXT NOT NULL,
                    FOREIGN KEY (resource_id) REFERENCES resources (id)
                );
            """)
            conn.commit()
            
            # Insert some dummy data if empty
            cursor.execute("SELECT count(*) FROM resources")
            if cursor.fetchone()[0] == 0:
                dummy_data = [
                    ('Main Library Room A', 'Study Room', 4, 1, 'Library Floor 1'),
                    ('Computer Lab 101', 'Lab', 30, 1, 'Engineering Building'),
                    ('3D Printer X1', 'Equipment', 1, 1, 'MakerSpace'),
                    ('Conference Room B', 'Meeting Room', 12, 1, 'Student Union'),
                    ('Basketball Court 1', 'Sports', 20, 1, 'Sports Complex')
                ]
                cursor.executemany("INSERT INTO resources (name, type, capacity, is_available, location) VALUES (?, ?, ?, ?, ?)", dummy_data)
                conn.commit()
        except Error as e:
            print(e)
        finally:
            conn.close()

def get_all_resources():
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM resources")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_resource(resource_id):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM resources WHERE id=?", (resource_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def book_resource(resource_id, user_name, start_time, end_time):
    conn = create_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO bookings (resource_id, user_name, start_time, end_time) VALUES (?, ?, ?, ?)",
                       (resource_id, user_name, start_time, end_time))
        cursor.execute("UPDATE resources SET is_available = 0 WHERE id = ?", (resource_id,))
        conn.commit()
        return True
    except Error as e:
        print(e)
        return False
    finally:
        conn.close()

if __name__ == '__main__':
    create_tables()
