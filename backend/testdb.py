import sqlite3

# connect to database
conn = sqlite3.connect('database.db')
cur = conn.cursor()

cur.execute('''INSERT INTO Sources (source_name) VALUES (?)''', ("CNN",))

conn.commit()
cur.execute('''
            SELECT source_name FROM Sources WHERE source_name='CNN'
        ''')

print(cur.fetchall())