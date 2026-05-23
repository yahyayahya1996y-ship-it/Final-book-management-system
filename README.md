# Final Book Management System

A final exam demo project built with **Next.js**, **TypeScript**, and **API Routes**.  
The goal of this project is to demonstrate authentication, authorization, JWT, 2FA, Cloudflare human verification, role-based CRUD, environment variables, GitHub workflow, CI/CD, and deployment.

This project is not a full commercial management system. It is a focused demo project created to show the required backend and frontend concepts working together in one Next.js application.

---

## Project Overview

This application is a simple **Book Management System** with two roles:

- **Admin**
- **Student**

Both users can log in and access the same books page, but they have different permissions.

### Admin Can

- View books
- Add books
- Edit books
- Delete books
- Logout

### Student Can

- View books only
- Logout

---

## Main Features

- Next.js App Router
- TypeScript
- API Routes / Route Handlers
- Fake backend using local arrays
- JWT authentication
- Password hashing using bcryptjs
- Email/password login
- OTP / 2FA verification after login
- Cloudflare Turnstile human verification before login
- HTTP-only cookie for JWT token
- Role-based authorization
- Admin CRUD for books
- Student view-only access
- Environment variables
- GitHub branches: main and develop
- CI/CD pipeline using GitHub Actions
- Deployment using Vercel

---

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- JWT / jsonwebtoken
- bcryptjs
- Nodemailer
- Cloudflare Turnstile
- Git and GitHub
- GitHub Actions
- Vercel

---

## Project Structure

```txt
src/
  app/
    api/
      auth/
        signup/
          route.ts
        login/
          route.ts
        verify-2fa/
          route.ts
        logout/
          route.ts
        me/
          route.ts
      books/
        route.ts
        [id]/
          route.ts

    signup/
      page.tsx
    login/
      page.tsx
    verify-2fa/
      page.tsx
    dashboard/
      page.tsx
    books/
      page.tsx
    page.tsx

  components/
  data/
    fakeDb.ts
  lib/
    auth.ts
    currentUser.ts
    email.ts
    jwt.ts
    password.ts
    turnstile.ts
  types/
    book.ts
    user.ts