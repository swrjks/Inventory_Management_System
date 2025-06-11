from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_connection

from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="9448",
        database="shop"
    )

@app.route('/api/recent-transactions', methods=['GET'])
def get_recent_transactions():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT transaction_id, total_amount, transaction_date
        FROM transaction
        ORDER BY transaction_date DESC
        LIMIT 3
    """)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@app.route('/api/low-stock', methods=['GET'])
def get_low_stock():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT prod_name, stock
        FROM product
        WHERE stock < 10
        ORDER BY stock ASC
        LIMIT 3
    """)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@app.route('/')
def home():
    return "Backend is running!"

@app.route('/customers', methods=['GET'])
def get_customers():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM customer")
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/customers', methods=['POST'])
def add_customer():
    try:
        data = request.get_json()
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO customer (cust_id, name, email, address, ph_no, transaction_id)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (data['cust_id'], data['name'], data['email'], data['address'], data['ph_no'], data['transaction_id']))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Customer added successfully"})
    except Exception as e:
        return jsonify({"error": str(e)})
    
@app.route('/customers/<int:cust_id>', methods=['PUT'])
def update_customer(cust_id):
    data = request.get_json()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE customer
        SET name=%s, email=%s, address=%s, ph_no=%s, transaction_id=%s
        WHERE cust_id=%s
    """, (
        data['name'],
        data['email'],
        data['address'],
        data['ph_no'],
        data.get('transaction_id'),
        cust_id
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Customer updated"})

@app.route('/customers/<int:cust_id>', methods=['DELETE'])
def delete_customer(cust_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM customer WHERE cust_id = %s", (cust_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Customer deleted"})


# -------------------------
# PRODUCT ROUTES
# -------------------------

@app.route('/products', methods=['GET'])
def get_products():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM product")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@app.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()
    print("🛠️ Product data received from frontend:", data)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO product (prod_id, prod_name, mrp, stock, category, supplier_id)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        data['prod_id'],
        data['prod_name'],
        data['mrp'],
        data['stock'],
        data.get('category', ''),     # <- safe!
        data['supplier_id']
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Product added"})


@app.route('/products/<int:prod_id>', methods=['PUT'])
def update_product(prod_id):
    data = request.get_json()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE product
        SET prod_name=%s, mrp=%s, stock=%s, category=%s, supplier_id=%s
        WHERE prod_id=%s
    """, (
        data['prod_name'],
        data['mrp'],
        data['stock'],
        data['category'],
        data['supplier_id'],
        prod_id
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Product updated"})

@app.route('/products/<int:prod_id>', methods=['DELETE'])
def delete_product(prod_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM product WHERE prod_id = %s", (prod_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Product deleted"})


# -------------------------
# EMPLOYEE ROUTES
# -------------------------

@app.route('/employees', methods=['GET'])
def get_employees():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM employee")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@app.route('/employees', methods=['POST'])
def add_employee():
    data = request.get_json()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO employee (emp_id, name, email, position, salary, hire_date)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        data['emp_id'],
        data['name'],
        data['email'],
        data['position'],
        data['salary'],
        data['hire_date']
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Employee added"})

@app.route('/employees/<int:emp_id>', methods=['PUT'])
def update_employee(emp_id):
    data = request.get_json()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE employee
        SET name=%s, email=%s, position=%s, salary=%s, hire_date=%s
        WHERE emp_id=%s
    """, (
        data['name'],
        data['email'],
        data['position'],
        data['salary'],
        data['hire_date'],
        emp_id
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Employee updated"})

@app.route('/employees/<int:emp_id>', methods=['DELETE'])
def delete_employee(emp_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM employee WHERE emp_id = %s", (emp_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Employee deleted"})

# -------------------------
# SUPPLIER ROUTES
# -------------------------

@app.route('/suppliers', methods=['GET'])
def get_suppliers():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM supplier")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@app.route('/suppliers', methods=['POST'])
def add_supplier():
    data = request.get_json()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO supplier (supplier_id, name, contact_person, email, phone, address)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        data['supplier_id'],
        data['name'],
        data['contact_person'],
        data['email'],
        data['phone'],
        data['address']
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Supplier added"})

@app.route('/suppliers/<int:supplier_id>', methods=['PUT'])
def update_supplier(supplier_id):
    data = request.get_json()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE supplier
        SET name=%s, contact_person=%s, email=%s, phone=%s, address=%s
        WHERE supplier_id=%s
    """, (
        data['name'],
        data['contact_person'],
        data['email'],
        data['phone'],
        data['address'],
        supplier_id
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Supplier updated"})

@app.route('/suppliers/<int:supplier_id>', methods=['DELETE'])
def delete_supplier(supplier_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM supplier WHERE supplier_id = %s", (supplier_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Supplier deleted"})

# -------------------------
# TRANSACTION ROUTES
# -------------------------

@app.route('/transactions', methods=['GET'])
def get_transactions():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM transaction")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@app.route('/transactions', methods=['POST'])
def add_transaction():
    data = request.get_json()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO transaction (transaction_id, cust_id, prod_id, quantity, total_amount, transaction_date, transaction_type)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (
        data['transaction_id'],
        data['cust_id'],
        data['prod_id'],
        data['quantity'],
        data['total_amount'],
        data['transaction_date'],
        data['transaction_type']
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Transaction added"})

@app.route('/transactions/<int:transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    data = request.get_json()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE transaction
        SET cust_id=%s, prod_id=%s, quantity=%s, total_amount=%s, transaction_date=%s, transaction_type=%s
        WHERE transaction_id=%s
    """, (
        data['cust_id'],
        data['prod_id'],
        data['quantity'],
        data['total_amount'],
        data['transaction_date'],
        data['transaction_type'],
        transaction_id
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Transaction updated"})

@app.route('/transactions/<int:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM transaction WHERE transaction_id = %s", (transaction_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Transaction deleted"})


if __name__ == '__main__':
    app.run(debug=True)
    
