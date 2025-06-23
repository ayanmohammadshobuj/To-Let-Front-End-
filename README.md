# To-Let (Frontend)

A web application for property listings, daily deals, and user management, built with Angular.

## Features

- User authentication (login, register, profile)
- Property ad creation and management
- Daily deals and explore menu
- User notifications
- Favorites, messages, and settings
- Responsive design with Bootstrap

## Tech Stack

- Angular 18
- Bootstrap 5
- RxJS
- Font Awesome

## Prerequisites

- Node.js (v18 or higher recommended)
- npm

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ayanmohammadshobuj/To-Let-Front-End-.git
   cd to-let

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
3. **Run the development server:**
   ```bash
   npm start
  or
   ```bash
   ng serve
   Open in browser: Visit http://localhost:4200


Project Structure
src/app/layout/header/ - Header component (navigation, user dropdown)
src/app/features/home/ - Home page and related features
src/app/core/authentication/ - Auth service and guards
Styling
Bootstrap and Font Awesome are included via angular.json:
node_modules/bootstrap/dist/css/bootstrap.min.css
node_modules/font-awesome/css/font-awesome.min.css
Notes
Angular Material is not used due to version conflicts.
All UI components use Bootstrap and custom CSS.
License
MIT
