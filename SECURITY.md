# Security Policy

## Supported Versions

AICYGRAM is currently in **Active Hackathon Development**. While security best practices are followed during development, this is not an enterprise-grade production release.

## Reporting a Vulnerability

As this project does not currently have a dedicated security contact email, please raise any security concerns privately with the maintainers through the repository's available direct contact mechanisms, or by opening a general inquiry issue. Please do not report actual sensitive secrets or exploits in public issues.

## Architectural Security Guidelines

Contributors deploying or extending AICYGRAM must follow these guidelines:

1. **Keep Secrets Server-Side:** Backend secrets (`JWT_SECRET`, `GROQ_API_KEY`, `SUPABASE_SERVICE_KEY`, and `DATABASE_URL`) must never be hardcoded into source code, exposed in public configuration files, or sent to the frontend.
2. **Environment Variables:** Never commit `.env`, `.env.local`, or any file containing live credentials to Git. Use the provided `.env.example` files to document required configuration.
3. **Frontend Limitations:** The React frontend must only consume the secure REST API. Do not embed privileged API keys directly into the client applications.
4. **Credential Rotation:** Historical commits in this repository may have inadvertently exposed test credentials during early prototyping. **All production deployments must rotate and generate completely new, strong cryptographic keys before use.**
5. **No Penetration Testing:** The current implementation has not undergone a formal security audit or penetration testing. Rely on the provided security measures (JWT, bcrypt) but exercise caution in a production environment.
