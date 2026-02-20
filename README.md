# GoldenLoft 🕊️

GoldenLoft is a modern Pigeon Management System designed to help fanciers track their birds, manage lofts, and monitor statistics.

## Project Structure

- **Backend**: NestJS (Node.js framework) with Prisma ORM and PostgreSQL.
- **Frontend**: Next.js 15 (React framework) with TailwindCSS and Shadcn UI.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL Database
- npm or yarn

## Getting Started

### 1. Database Setup

Ensure your PostgreSQL database is running. Update the connection string in `backend/.env`.

### 2. Backend Setup

```bash
cd backend
# Install dependencies
npm install

# Setup Environment Variables
cp .env.example .env
# Edit .env with your database credentials

# Run Database Migrations
npx prisma migrate dev

# Start Server
npm run start:dev
```

The backend runs on `http://localhost:4000` (default).

### 3. Frontend Setup

```bash
cd frontend
# Install dependencies
npm install

# Setup Environment Variables
cp .env.example .env.local
# Check NEXT_PUBLIC_API_URL matches backend

# Start Development Server
npm run dev
```

The frontend runs on `http://localhost:3000`.

## Scripts

**Backend**

- `npm run start:dev`: Run in development mode with watch.
- `npm run build`: Build for production.
- `npm run lint`: Lint code.
- `npm test`: Run tests.

**Frontend**

- `npm run dev`: Run in development mode.
- `npm run build`: Build for production.
- `npm run start`: Start production server.

## Troubleshooting

- **Database Connection Error**: Check `backend/.env` `DATABASE_URL` and ensure Postgres is running.
- **CORS Error**: Ensure `CORS_ORIGINS` in `backend/.env` includes the frontend URL (`http://localhost:3000`).
- **Build Failures**: Run `npm install` again to ensure all dependencies are fresh. Clear `.next` or `dist` folders if issues persist.

## License

[Add License Here]
