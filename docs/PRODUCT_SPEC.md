# PRODUCT SPECIFICATION: PolarSetu

## Project Overview
- **Working Name**: PolarSetu ("From Polar Research to Public Understanding")
- **Problem Statement ID**: SIH26063
- **Problem Creator**: Ministry of Earth Sciences (MoES) / NCPOR
- **Goal**: Build a unified discovery, evidence, and outreach layer for India's Polar Science.

## Core Pillars
1. **Discover**: Find resources across the polar corpus using universal search, filters, maps, and timelines.
2. **Understand**: Get context without losing source traceability. (Evidence-linked AI answers).
3. **Connect**: Explicitly relate expeditions, projects, reports, datasets, publications, and media.
4. **Create**: Turn source material into audience-specific drafts via Polar Outreach Studio.
5. **Review**: Keep science communication controlled via an approval queue.
6. **Share**: Publish approved content in the right format.

## Key Differentiators (Hackathon Focus)
- **Source-Grounded AI**: No generic chatbot. AI answers must explicitly cite sources (document ID, page, section). The UI must distinguish between sourced facts and uncertainty. If evidence is insufficient, it refuses to answer.
- **Polar Outreach Studio**: Generates drafts (Student, Researcher, General Public, Media) from selected scientific sources.
- **Human Review Gate**: AI-generated content is NEVER auto-published. It enters a draft state (`DRAFT — human review required`) and must be explicitly approved.
- **Resource Relationships**: A relational implementation mapping `Expedition -> Project -> Report -> Dataset -> Publication -> Media`.

## Visual Identity
Must follow the approved `DESIGN.md` (Stitch UI). 
- **Palette**: Deep polar midnight (`#0B132B`), glacial azure (`#0284C7`), ice white (`#F8FAFC`).
- **Aesthetic**: Serious scientific, institutional, premium, trustworthy.
