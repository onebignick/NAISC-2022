import sqlite3

conn = sqlite3.connect('database.db')
cur = conn.cursor()

cur.execute('''
    CREATE TABLE IF NOT EXISTS Authors(
    author_id INTEGER PRIMARY KEY,
    author_name TEXT)
''')

cur.execute('''
    CREATE TABLE IF NOT EXISTS Sources(
        source_id INTEGER PRIMARY KEY,
        source_name TEXT)
''')

cur.execute('''
    CREATE TABLE IF NOT EXISTS Articles(
        article_id INTEGER PRIMARY KEY,
        article_title TEXT,
        article_description TEXT,
        article_url TEXT,
        article_url_to_image TEXT,
        article_date_published TEXT,
        article_content TEXT,
        article_source_id INTEGER,
        article_author_id INTEGER,
        FOREIGN KEY (article_source_id) REFERENCES Sources(source_id),
        FOREIGN KEY (article_author_id) REFERENCES Authors(author_id)
    )
''')
