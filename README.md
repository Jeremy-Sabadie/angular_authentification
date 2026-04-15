# Angular Material Management App

## Project Overview

This project is a modern Angular application built using Standalone Components, Reactive Forms, and a JSON Server as a mock backend.

It demonstrates:
- Authentication system (login)
- Route protection with guards
- Lazy loading
- Full CRUD operations on a "materials" resource
- Clean and responsive UI

---

## Tech Stack

- Angular (Standalone Architecture)
- Reactive Forms
- Angular Router (Lazy Loading)
- JSON Server (Mock API)
- SweetAlert2 (UI feedback)
- Custom CSS (responsive design)

---

## Authentication

- Login form with validation (email and password)
- Authentication simulated via JSON Server
- User session stored in localStorage
- Protected routes using AuthGuard

---

## Features

### Login
- Reactive form validation
- API call to JSON Server
- Redirect to dashboard on success

### Dashboard
- Display materials in a table
- Responsive UI
- Toggle visibility of the list

### CRUD Operations
- Create new material
- Edit material via modal popup
- Delete material with confirmation
- Automatic refresh after each action

### UX Enhancements
- Confirmation popups using SweetAlert2
- Modal-based editing
- Clean and modern interface
- Responsive layout (mobile, tablet, desktop)

---

## Data Model

Each material contains:

```json
{
  "id": number,
  "serialNumber": string,
  "dateMiseEnService": string,
  "dateFinGarantie": string
}
