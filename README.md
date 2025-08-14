# 📦 Inventory Management System

A full-stack **Inventory Management System** for managing products, suppliers, employees, customers, and transactions. Built using:

- **React + TypeScript + TailwindCSS** (Frontend)
- **Flask (Python)** (Backend)
- **MySQL** (Database)

---

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS, Radix UI
- **Backend**: Python, Flask, Flask-CORS
- **Database**: MySQL
- **Other Libraries**: Axios, React Hook Form

---

## Database Schema Summary

- customer(cust_id(pk), name, email, address, ph_no, transaction_id(fk))
- product(prod_id(pk), prod_name, mrp, stock, supplier_id(fk))
- employee(emp_id(pk), emp_name, designation, salary)
- supplier(supplier_id(pk), product_id(fk), product_name, date, quantity, transaction_id(fk))
- transaction(transaction_id(pk), date, mode, amount, emp_id(fk))

## Getting Started

### 1. Clone the Repository

```bash

MySQL
CREATE DATABASE shop;

CREATE TABLE customer (cust_id INT NOT NULL PRIMARY KEY, name VARCHAR(50), email VARCHAR(100), address VARCHAR(255), ph_no VARCHAR(15), transaction_id INT, KEY transaction_id (transaction_id));
CREATE TABLE employee (emp_id INT NOT NULL PRIMARY KEY, name VARCHAR(100), position VARCHAR(100), salary DECIMAL(10,2), email VARCHAR(100), hire_date DATE);
CREATE TABLE low_stock_products (prod_id INT NOT NULL, prod_name VARCHAR(50), stock INT);
CREATE TABLE membership (cust_id INT NOT NULL PRIMARY KEY, name VARCHAR(100), frequency INT DEFAULT 0);
CREATE TABLE product (prod_id INT NOT NULL PRIMARY KEY, prod_name VARCHAR(50), mrp DECIMAL(10,2), stock INT, category VARCHAR(100), supplier_id INT);
CREATE TABLE supplier (supplier_id INT NOT NULL PRIMARY KEY, name VARCHAR(100), contact_person VARCHAR(100), email VARCHAR(100), phone VARCHAR(20), address TEXT);
CREATE TABLE transaction (transaction_id INT NOT NULL PRIMARY KEY, cust_id INT, prod_id INT, quantity INT, total_amount DECIMAL(10,2), transaction_date DATE, transaction_type VARCHAR(50), KEY cust_id (cust_id), KEY prod_id (prod_id));
CREATE TABLE work_experience (emp_id INT NOT NULL PRIMARY KEY, duration VARCHAR(100));

----------------

git clone https://github.com/swrjks/Inventory_Management_System.git
cd Inventory_Management_System

----------------

Inventory_Management_System-main\backend\app.py
Change your MySql password

----------------
Open terminal 
cd backend
python -m venv dbms
dbms\Scripts\activate 

pip install flask flask-cors mysql-connector-python
pip install mysql-connector
pip install python-dotenv

python app.py

----------------

Open new terminal
cd frontend
npm install axios
npm install
npm run dev
