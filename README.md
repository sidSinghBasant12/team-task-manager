# TaskForge AI - Deployment Guide (Railway)

This project is a full-stack AI-powered Task Management platform. Follow these steps to deploy it to Railway.

## 1. Prepare your GitHub Repository
1. Initialize a git repo in the root of the project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Ready for deployment"
   ```
2. Create a new repository on GitHub and push your code.

## 2. Deploy Database & Redis on Railway
1. Go to [Railway.app](https://railway.app/) and create a new project.
2. Click **Add Service** -> **Database** -> **PostgreSQL**.
3. Click **Add Service** -> **Database** -> **Redis**.

## 3. Deploy Backend
1. Click **Add Service** -> **GitHub Repo** -> Select your repository.
2. Go to the **Variables** tab of the backend service and add:
   - `PORT`: 5000
   - `DATABASE_URL`: Click "Add Reference" and select your PostgreSQL connection string.
   - `REDIS_URL`: Click "Add Reference" and select your Redis connection string.
   - `JWT_SECRET`: A long random string.
   - `NODE_ENV`: production
   - `FRONTEND_URL`: Your Railway Frontend URL (you'll get this after deploying frontend).

## 4. Deploy Frontend
1. Click **Add Service** -> **GitHub Repo** -> Select the same repository.
2. Set the **Root Directory** to `frontend` (if prompted, otherwise specify in Settings).
3. Add Variables:
   - `NEXT_PUBLIC_API_URL`: Your Railway Backend URL.

## 5. Deployment Checklist
- [x] **Role-Based Access Control**: Already implemented.
- [x] **Backend start script**: Added to `package.json`.
- [x] **Prisma generation**: Automated via `postinstall`.
- [x] **Environment Variables**: Managed via Railway dashboard.

## Submission Details
- **Live URL**: (Paste your Railway Frontend URL here)
- **GitHub Repo**: (Paste your GitHub Repo Link here)
