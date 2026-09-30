# Contributing to AICYGRAM

Thank you for your interest in contributing to the AICYGRAM platform! As this is currently an active hackathon project, contributions are generally focused on meeting SIH26063 objectives.

## Repository Structure

The project is structured as a monorepo containing both the client application and the API service:

* **`/frontend`**: The React + Vite client application. All UI components, routing, and styling live here.
* **`/backend`**: The Go + Gin REST API server. All business logic, database migrations, AI handlers, and authentication live here.

## Getting Started

1. **Clone the repository.**
2. **Review the README.md** for detailed local setup instructions, including Docker configurations for the local PostgreSQL database.
3. **Configure your environment.** Copy the provided `.env.example` templates in both `frontend/` and `backend/` and provide valid local configuration parameters. **Do not commit your `.env` files.**

## Contribution Guidelines

* **Keep changes focused:** Avoid large, sweeping pull requests that mix multiple feature additions.
* **Respect the architecture:** Maintain the clear boundary between the React frontend and the Go backend. All data must flow through the REST API.
* **Run checks before submitting:** 
  * Ensure the frontend builds cleanly (`npm run build`).
  * Ensure the backend builds without errors (`go build ./...`).
* **Secrets:** Never commit API keys, passwords, or JWT secrets to the repository.

This repository is maintained by a hackathon team, so there are currently no rigid release trains or complex branching requirements. Please coordinate with team members before undertaking major refactors.
