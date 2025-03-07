# Compta Project

## Overview

Compta Project is a SaaS application designed to manage accounting processes effectively.
Built using **Next.js** with **TypeScript**, the project uses **pnpm** as the package manager for a modern, efficient development experience.
The project leverages **pgtable** for defining database schemas and types, ensuring strong type safety and easy integration with the database.

## Project Structure

The project is organized into a modular structure to ensure clarity, maintainability, and scalability. Below is a high-level map of the project's key components:

### 1. **Components**

- **Companies Component**
  - 📈 Manages UI and logic for displaying and interacting with company data.
- **Transactions Component**
  - 💳 Handles functionality and UI for managing financial transactions.
- **Accounts Component**
  - 💰 Manages the display and interaction for accounts data.

### 2. **Services**

Each component has an associated service in the `services` directory. These services handle business logic and interact with the database via the utility functions defined in `db.ts`. Examples include:

- **CompanyService**: 🔧 Functions for CRUD operations on companies.
- **TransactionService**: 🔧 Logic for handling transactions.
- **AccountService**: 🔧 Manages operations related to accounts.

### 3. **Database Integration**

- **db.ts**: 💿 Centralized file for database interaction.
  - Defines database tables and schema using **pgtable**.
  - Includes utility functions for querying and mutating the database.

### 4. **Types**

- 🌐 All column types for the `accounts`, `transactions`, and `companies` tables are defined in the `types` directory for type safety and reusability.
- Example types include:
  - `companies-types`
  - `transactions-types`
  - `account-type`
    `

## Usage

### Adding Companies

Use the **Companies Component** to manage company data. The `CompanyService` interacts with the database to handle actions like adding, editing, and deleting companies.

### Managing Transactions

The **Transactions Component** allows users to view and manage financial transactions. The `TransactionService` ensures data integrity and proper database interaction.

### Viewing Accounts

The **Accounts Component** displays account information. Use the `AccountService` for actions like fetching account balances and details.

## Technologies Used

- 📈 **Next.js**: Framework for server-side rendering and building modern web applications.
- 🎨 **TypeScript**: Ensures type safety and maintainability.
- ⚡️ **pnpm**: Fast and efficient package manager.
- 🌐 **pgtable**: Simplifies database schema and type management.
- 📄 **PostgreSQL**: Robust and scalable relational database.
- 🔢 **Zod**: Schema declaration and validation for TypeScript.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
