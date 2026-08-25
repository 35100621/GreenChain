import psycopg2

conn = psycopg2.connect(
    host='localhost',
    database='greenchain',
    user='greenchain_user',
    password='greenchain_pass'
)

print('Connected successfully')
conn.close()