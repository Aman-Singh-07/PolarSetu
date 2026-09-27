# Workspace Rules for PolarSetu

1. **Source of Truth**: The Stitch UI design in `stitch_polarsetu_polar_knowledge_outreach_platform/polarsetu/DESIGN.md` is the primary visual source of truth. Do NOT invent new visual systems, change colors randomly, or introduce new typography.
2. **Architecture Constraints**: 
   - Backend MUST be Go + Gin.
   - Frontend MUST be React + Vite + TypeScript.
   - Do NOT introduce Next.js, Node/Express, Python, or microservices.
3. **Data Integrity**: Do NOT silently convert prototype/demo data into "official" information. Never invent authors, dates, statistics, citations or page numbers.
4. **AI Rules**:
   - MUST be Source-Grounded. No generic chatbot.
   - Use ONLY retrieved context for factual claims.
   - If context is insufficient, explicitly state "The available sources do not provide enough evidence."
5. **Outreach & Review**: Generated content from the Outreach Studio MUST NOT be automatically published. It must enter a `DRAFT — human review required` state.
6. **Development Workflow**: Follow the Antigravity workflow: Analyze -> Plan -> Implement small phase -> Run/Test -> Verify -> Document -> Move to next phase. Do NOT generate the whole application in one uncontrolled operation.
