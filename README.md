# Waqt Career Explorer - Firebase Integrated

This project is a comprehensive career exploration platform integrated with Firebase for data storage and authentication.

## Prerequisites
- Node.js (v18 or higher)
- npm
- Firebase Project

## Local Installation

1. **Extract the zip file** to a folder of your choice.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Firebase**:
   Ensure `firebase-applet-config.json` is present in the root directory with your Firebase project credentials.
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.

## Project Structure
- `src/`: React frontend source code.
- `server.ts`: Express backend using Firebase Admin SDK for email and IP logging.
- `firebase-applet-config.json`: Firebase configuration.
- `package.json`: Project dependencies and scripts.

## Notes
- The application uses Firebase Firestore for data storage and Firebase Authentication for admin access.
- The frontend is built with React, Vite, Tailwind CSS, and Recharts.
- Animations are powered by Framer Motion.
