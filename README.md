# Chaurasiya Mobile Review App

A mobile-first web application designed to streamline Google Reviews for Chaurasiya Mobile in Sakaldiha, Chandauli.

## Features
- **One-Tap Review**: Users can select a rating, choose a template or generate one via AI, and copy/open Google with one tap.
- **AI-Powered**: Uses Gemini API to generate natural, concise (1-1.5 lines) reviews.
- **Static Templates**: Includes a large library of pre-written reviews to minimize API usage.
- **Modern UI**: Built with Next.js, Tailwind CSS, and Framer Motion for a premium mobile experience.

## Tech Stack
- **Frontend**: Next.js (React), Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **AI**: Google Gemini API

## Setup

### Prerequisites
- Node.js installed
- Google Gemini API Key

### Backend Setup
1. Navigate to `backend` folder
2. Create `.env` file:
   ```env
   PORT=5001
   GEMINI_API_KEY=your_api_key_here
   ```
3. Install dependencies: `npm install`
4. Start server: `npm start`

### Frontend Setup
1. Navigate to `frontend` folder
2. Create `.env.local` file:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
   NEXT_PUBLIC_GOOGLE_REVIEW_URL=https://search.google.com/local/writereview?placeid=ChIJeWPseN8ZjjkRPvRjXlF6AvQ
   ```
3. Install dependencies: `npm install`
4. Start dev server: `npm run dev`

## Deployment
- Frontend can be deployed to Vercel or Netlify.
- Backend can be deployed to Render, Railway, or Heroku.
- Remember to update the `NEXT_PUBLIC_BACKEND_URL` in production.
