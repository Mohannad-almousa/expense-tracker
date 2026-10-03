# Expense Tracker

Expense Tracker is a full-stack web application for managing personal expenses.
Users can add, edit, delete, and filter expenses, while the application displays summary information such as the total amount, number of expenses, and highest expense.


## How to run

Backend

1. Make sure Node.js and PostgreSQL are installed.
2. Create a PostgreSQL database named expense_tracker.
3. Open the schema.sql file in pgAdmin and run it on the expense_tracker database.
4. Create a .env file in the backend folder.
5. Add the PostgreSQL connection information to the .env file:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=expense_tracker
6. Open the terminal in the backend folder.
7. Install the required packages:
npm install express cors pg dotenv
8. Start the backend:
node server.js
9. The backend will run on:
http://localhost:3000

Frontend
1. Keep the backend server running.
2. Open the project frontend folder in VS Code.
3. Open index.html using Live Server.
4. The frontend connects directly to the backend API:
http://localhost:3000/api/expenses 


API Endpoints

The application provides the following REST API endpoints:

Method Endpoint               Purpose
GET     /api/expenses        Retrieve all expenses
GET     /api/expenses/:id   Retrieve one expense
POST     /api/expenses        Create a new expense
PUT     /api/expenses/:id   Update an expense
DELETE /api/expenses/:id   Delete an expense
## Features

- [✅ ] Add an expense (with validation)
- [✅ ] Delete an expense
- [✅ ] Edit an expense
- [✅ ] Filter by category
- [✅ ] Summary cards (total, count, highest)
- [✅ ] Data is saved in a PostgreSQL database

## Screenshots

1. API testing screenshots using Thunder Client from Phase 1 
2. Desktop view of the Expense Tracker.
3. Mobile view of the Expense Tracker.

## What was the hardest part?
The hardest part was connecting the frontend directly to the backend API and making sure that adding, editing, and deleting expenses updated the table and summary cards correctly. I solved this by using fetch with async/await, handling errors with try/catch, and calling the GET API again after each successful operation to refresh the data from PostgreSQL.

## Project Links

- **GitHub Repository:** [Expense Tracker](https://github.com/Mohannad-almousa/expense-tracker)
- **Demo Video:** [Watch Demo](https://drive.google.com/file/d/10o4xTT1UsXgMdUZLvVuktyrU5OzFhSHb/view?usp=sharing)