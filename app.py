from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
import mysql.connector
import random
import time
import threading

app = Flask(__name__)

# Secret key for session management
app.secret_key = 'your_secret_key_here'

# MySQL connection
def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",        # Database host
        user="root",             # Database username
        password="",             # Database password
        database="maintenance_iot"  # Your database name
    )
    return connection

# Route for the login page
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # Query to check if the user exists
        query = "SELECT * FROM accounts WHERE username = %s AND password = %s"
        cursor.execute(query, (username, password))
        user = cursor.fetchone()

        cursor.close()
        connection.close()

        if user:
            # Store user id in session for future use
            session['user_id'] = user['id']
            session['username'] = user['username']
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password!', 'danger')
            return redirect(url_for('login'))

    return render_template('login.html')

# Route for the dashboard (after login)
@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))  # Redirect to login if not logged in
    
    return render_template('index.html', username=session['username'])

# Function to generate random machine data
def generate_machine_data(machine_id):
    temperature = random.randint(20, 30)
    humidity = random.randint(30, 70)
    energy_consumption = random.randint(50, 150)
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')

    # Insert generated data into the database
    connection = get_db_connection()
    cursor = connection.cursor()

    query = """
    INSERT INTO machine_data (machine_id, timestamp, temperature, humidity, energy_consumption)
    VALUES (%s, %s, %s, %s, %s)
    """
    cursor.execute(query, (machine_id, timestamp, temperature, humidity, energy_consumption))
    connection.commit()

    cursor.close()
    connection.close()

# Simulate machine data (to test your functionality)
def simulate_data():
    machine_ids = [1, 2, 3]
    while True:
        for machine_id in machine_ids:
            generate_machine_data(machine_id)
        time.sleep(15)

# Start the background task for data simulation
def start_background_task():
    thread = threading.Thread(target=simulate_data)
    thread.daemon = True  # Daemonize the thread so it dies with the main program
    thread.start()

# Fetch latest machine data from the database
@app.route('/get_latest_data')
def get_latest_data():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
    SELECT * FROM machine_data
    ORDER BY timestamp DESC LIMIT 1
    """
    cursor.execute(query)
    data = cursor.fetchone()

    cursor.close()
    connection.close()

    return jsonify(data)

# Route for logging out
@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('username', None)
    return redirect(url_for('login'))

# Run the background task before the first request
if __name__ == '__main__':
    start_background_task()  # Start the background task explicitly here
    app.run(debug=True)
