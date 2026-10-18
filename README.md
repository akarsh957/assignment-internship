# EarlyJobs Mini ATS

A lightweight applicant tracking workspace built with Next.js. It provides a recruiting dashboard for reviewing candidates, tracking hiring stages, recording notes and ratings, and viewing pipeline metrics.

> **Demo-data notice:** Candidate records are held in server process memory and reset to the sample data when the process restarts. On serverless hosting, changes may not persist between requests or instances. The API has no authentication. Do not use this deployment to store real or sensitive candidate information without adding persistent storage and appropriate access controls.

## Features

- Dashboard for candidate pipeline and recruiting metrics
- Candidate records with role, department, experience, skills, and application score
- Hiring stages: Applied, Screening, Interview, Offer, Hired, and Rejected
- Candidate ratings, recruiter notes, and stage-change activity
- Sample candidate data for trying the interface

## Tech stack

- Next.js 16 with the App Router
- React 19
- Tailwind CSS 4
- Recharts
- Lucide icons

## Getting started

Requirements: Node.js 20.9 or later and npm.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The home page redirects to `/dashboard`.

## Available scripts

```bash
npm run dev    # Start the local development server
npm run lint   # Lint app, components, and lib
npm run build  # Create a production build
npm run start  # Serve the production build locally
```

## API

All API routes return JSON.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/candidates` | List candidates |
| `POST` | `/api/candidates` | Add a candidate; requires `name`, `email`, and `role` |
| `PATCH` | `/api/candidates/:id` | Update a candidate's `stage` and/or `rating`, or add a `note` |
| `DELETE` | `/api/candidates/:id` | Delete a candidate |
| `GET` | `/api/metrics` | Get pipeline totals, stage and department breakdowns, and recent activity |

Example:

```json
{
  "name": "Taylor Morgan",
  "email": "taylor@example.com",
  "role": "Frontend Engineer",
  "department": "Engineering",
  "experience": 4,
  "skills": ["React", "Next.js"]
}
```

Send the example as the JSON body of a `POST` request to `/api/candidates`.

## Deploy to Vercel

Import this GitHub repository into Vercel and deploy it as a Next.js project. Alternatively, use the Vercel CLI:

```bash
npx vercel
npx vercel --prod
```

The project uses the standard Next.js build configuration and does not require environment variables. Remember that its in-memory demo data is not durable or suitable for real candidate records.
