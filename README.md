# 📦 Inventory Management System

A full-stack **Inventory Management System** for managing products, suppliers, employees, customers, and transactions. Built using:

- **React + TypeScript + TailwindCSS** (Frontend)
- **Flask (Python)** (Backend)
- **MySQL** (Database)

---

## 🔧 Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS, Radix UI
- **Backend**: Python, Flask, Flask-CORS
- **Database**: MySQL
- **Other Libraries**: Axios, React Hook Form

---

## 🗃️ Database Schema Summary

- customer(cust_id(pk), name, email, address, ph_no, transaction_id(fk))
- product(prod_id(pk), prod_name, mrp, stock, supplier_id(fk))
- employee(emp_id(pk), emp_name, designation, salary)
- supplier(supplier_id(pk), product_id(fk), product_name, date, quantity, transaction_id(fk))
- transaction(transaction_id(pk), date, mode, amount, emp_id(fk))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/swrjks/Inventory_Management_System.git
cd Inventory_Management_System 


cd backend
python -m venv dbms
dbms\Scripts\activate        # On Windows
pip install flask flask-cors mysql-connector-python
python app.py


cd frontend
npm install
npm run dev

