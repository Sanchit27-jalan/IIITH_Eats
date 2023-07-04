import sqlite3

conn = sqlite3.connect('example.db')

c = conn.cursor()
c.execute("CREATE TABLE orders (item VARCHAR(50), price INT, count INT);")
conn.commit()

conn.close()