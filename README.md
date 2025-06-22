# 🧾 Expense Tracker Backend

A backend service built with **Node.js**, **Prisma**, and **MySQL** for tracking expenses.

---

## 🚀 Getting Started

Follow the instructions below to set up and run the project on your local machine.

---

## 📦 Requirements

- [Node.js]
- [npm]
- [MySQL]
- [Prisma]

---

## ⚙️ Step 1: Create the Database

Manually create a MySQL database before starting the app.

```sql
CREATE DATABASE expense_tracker;
```

---

## 🔐 Step 2: Configure Environment Variables

Create a `.env` file in the root directory and add your database connection string:

```env
DATABASE_URL="mysql://your_user:your_password@localhost:3306/expense_tracker"
```

> Replace `your_user`, `your_password`, and `expense_tracker` with your actual database credentials.

---

## 📦 Step 3: Install Dependencies

Install all required Node.js packages:

```bash
npm install
```

---

## 🛠️ Step 4: Set Up Prisma

Generate the Prisma client and apply migrations to your database:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

## ▶️ Step 5: Start the Application

Start the backend server:

```bash
npm start
```

By default, it runs at: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Step 6: Visualize the Database (Optional)

To open Prisma Studio and explore your data:

```bash
npx prisma studio
```

Then open your browser at:

```
http://localhost:5555
```