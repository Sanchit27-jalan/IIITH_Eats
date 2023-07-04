import sqlite3
import json

conn = sqlite3.connect('hack.db')
cursor = conn.cursor()
cursor.execute("Select item,count from orders")
data=cursor.fetchall()
print(data)