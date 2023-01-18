import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="admin",
    password="yourpassword"
)

cursor = db.cursor()
db.execute("CREATE DATABASE database")