# Configurable Overtime Management Portal

A full-stack web application designed to manage employee overtime through configurable calculation rules and role-based approval workflows.

The project was developed as part of my Bachelor of Engineering thesis at South-Eastern Finland University of Applied Sciences (Xamk).

📖 [Read the published thesis](https://urn.fi/URN:NBN:fi:amk-2026060321732)

## Project Overview

Overtime policies can vary between organisations, employee groups and working conditions. Hard-coding these rules makes a system difficult to maintain.

This project explores a configurable approach where overtime rules and calculation logic can be managed more flexibly. It also provides structured workflows for employees, managers and HR administrators.

The project focuses not only on the user interface, but also on application architecture, data flow, access control and the connection between business rules and overtime calculations.

## Core Features

- Secure user authentication
- Role-based access control
- Employee overtime submission
- Manager review and approval workflow
- Configurable overtime calculation rules
- Employee and user management
- Overtime history and status tracking
- Protected application routes
- Responsive web interface

## User Roles

### Employee

- Submit overtime entries
- View personal overtime records
- Follow the status of submitted requests

### Manager

- Review employee submissions
- Approve or reject overtime requests
- Monitor overtime records within the team

### HR Administrator

- Manage users and roles
- Configure overtime rules
- Access organisation-level overtime information

## System Flow

1. An employee submits an overtime entry.
2. The application validates the submitted information.
3. The configured rules are applied to the overtime data.
4. The request is sent to the appropriate approval workflow.
5. A manager reviews and approves or rejects the request.
6. The result is stored and made available to authorised users.

## Technology Stack

- **Framework:** Next.js
- **Language:** JavaScript
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens
- **Authorisation:** Role-Based Access Control
- **API:** Next.js server-side API routes
- **Version Control:** Git and GitHub

## Architecture

The application separates the main system responsibilities into:

- User interface and client-side interactions
- Authentication and authorisation
- Server-side API handling
- Business rules and overtime calculations
- Database access and persistent storage

This structure helps keep the application easier to understand, maintain and extend when organisational rules change.

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- MongoDB or a MongoDB Atlas account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/raorizwan1092/portal.git
cd portal
```

2. Install the dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the project root and add the required environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the development server:

```bash
npm run dev
```

5. The deployed application is available here:

🔗 [Open the HR Management Portal](https://portal-of-hr.vercel.app/signin)

## Screenshots
<img width="1009" height="458" alt="p1" src="https://github.com/user-attachments/assets/51c16712-77a1-4854-92a7-3404ad892673" />
<img width="966" height="438" alt="P2" src="https://github.com/user-attachments/assets/d2b8d7b0-1609-4b9e-98bf-f05b30f31e63" />
<img width="1036" height="461" alt="p3" src="https://github.com/user-attachments/assets/ebd9a5ae-3de0-4157-9596-abb296d59e24" />

## Academic Publication

**Thesis:** Design and Implementation of a Configurable Overtime Calculator with Role-Based Management Portal

**Author:** Muhammad Rizwan Hafeez  
**Institution:** South-Eastern Finland University of Applied Sciences (Xamk)  
**Published:** 2026

[View the thesis in Theseus](https://urn.fi/URN:NBN:fi:amk-2026060321732)

## Author

**Muhammad Rizwan Hafeez**  
Full-Stack Developer based in Helsinki, Finland

- [LinkedIn](https://www.linkedin.com/in/rizwan-hafeez-4395b7242/)
- [raorizwanhafeez@gmail.com](mailto:raorizwanhafeez@gmail.com)
