# Waqt Career Explorer

This project is a comprehensive career exploration platform.

## Prerequisites
- Node.js (v18 or higher)
- npm

## Local Installation

1. **Extract the zip file** to a folder of your choice.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.

## Project Structure
- `src/`: React frontend source code.
- `api/index.ts`: Express backend for visitor tracking and email notifications.
- `package.json`: Project dependencies and scripts.

## Notes
- The application uses an in-memory visitor counter and local API for appointments.
- The frontend is built with React, Vite, Tailwind CSS, and Recharts.
- Animations are powered by Motion.

trigger: redeploy with fixed vercel config
