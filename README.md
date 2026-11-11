# Nishant Porwal

## Local development

Use Node.js 24.x. The `.nvmrc` file selects that major version with `nvm use`. Then run `npm install` and `npm run dev`. Run `npm run build` to create a production build. npm is configured to reject other Node versions early. The production build uses webpack because the current Tailwind/Turbopack combination fails while loading an ES module.

I'm a Computer Science student at NIT Delhi, graduating in 2027. I build real-time applications, backend systems, and applied machine learning tools. This portfolio brings together my projects, research, and experience.

[Resume](https://drive.google.com/file/d/1SkFmQX3bo4iyR0NWr1x7IlfQAKm05A3s/view?usp=sharing) · [GitHub](https://github.com/nishant203code) · [LinkedIn](https://www.linkedin.com/in/nishantporwal203/) · [Email](mailto:nishantporwal203@gmail.com)

## Experience

**Research Intern — DAViSE Lab, NIT Delhi** (June 2026 – July 2026)

Worked on TerraAlert, connecting satellite-image segmentation with landslide localization, hazard-aware routing, and alert dissemination.

**Web Developer — NIT Delhi** (June 2025 – December 2025)

Migrated the institute website from WordPress to Next.js and built internal faculty applications, working across interfaces, REST APIs, and data storage.

## Projects

| Project | What I worked on |
| --- | --- |
| [PeerLink](https://peerlink-7ya7.onrender.com/) · [Source](https://github.com/nishant203code/PeerLink) | Live peer-to-peer video calls with WebRTC, WebSocket signaling, and authentication. |
| [CodeTracker](https://code-tracker-bh1n.vercel.app/) · [Source](https://github.com/nishant203code/CodeTracker) | A coding practice log with revision priorities, a dashboard, and browser-extension capture. |
| [TerraAlert](https://github.com/nishant203code/TeraAlert---Landslide-Detection-Early-Warning-System) | Geospatial landslide detection and hazard-aware route planning using satellite imagery. |
| [Legal AI Assistant](https://github.com/nishant203code/Legal-AI-Assistant-Model-Serving-Deployment) | A Flutter interface for document questions and summaries, connected to model inference endpoints. |
| [IT Support RAG](https://github.com/nishant203code/IT-Support-RAG) | Retrieval-based answers from support tickets, with source attribution. |
| [AI Mock Interviewer](https://automated-ai-mock-interviewer.vercel.app/) · [Source](https://github.com/nishant203code/Automated-AI-Mock-Interviewer) | Role-specific practice interviews with question generation, recorded answers, and feedback history. |
| [Optimizing Pathfinding](https://github.com/nishant203code/OptimisingPathfinding-Dijisktra-AStar-main) | User-created map graphs, a Flask pathfinding endpoint, and route visualization. |
| [Portfolio](https://nishantporwal.vercel.app/) · [Source](https://github.com/nishant203code/Portfolio) | Responsive project case studies, persistent themes, and accessible navigation built with Next.js. |
| [Unity Aid](https://github.com/nishant203code/Unity_Aid) | A Flutter/Firebase community-support app with NGO discovery, donation cases, and shared updates. |

## System Status

The homepage checks the `liveUrl` entries in `src/content/projects.ts` through the same-origin Next.js `/api/status` route. It accepts no target URL or query parameters and does not follow redirects. Run with `npm run dev`, or `npm run build` and `npm run start`; static-only hosting cannot execute these checks.

Checks measure server-to-site time until HTTP response headers, not browser latency or full application health. Successful responses taking at least 3 seconds are degraded but still count as successes. Other HTTP errors are failures; redirects, 401/403/429 responses, network errors, and 20-second timeouts are unavailable rather than evidence of an outage. A cold start may exceed the timeout.

The client polls every 30 seconds while the page is visible, cancels on hide/unmount, and times out its own request after 25 seconds. The server shares concurrent checks and retains results for 25 seconds per running instance; this is best-effort request reduction, not a distributed rate limit. Serverless requests still consume hosting resources. No checks run on a schedule without visitors.

The last 24 real observations form the history; cached timestamps are counted only once. The percentage includes all determinate checks since this page mounted, not just those 24, and excludes unknown results. It resets on reload or leaving the homepage. A failed monitoring request marks current status unavailable without inventing an upstream check. No historical uptime is claimed.

## Skills

- **Web and backend:** TypeScript, React, Next.js, Node.js, REST APIs, WebRTC, WebSockets.
- **Machine learning:** Python, PyTorch, computer vision, retrieval-augmented generation, model serving.
- **Data and infrastructure:** MongoDB, PostgreSQL, Supabase, Docker, Git.

## Beyond projects

At NIT Delhi, I also contribute as:

- Senior Coordinator and Design Head, Training and Placement Cell.
- Coordinator, UpVision Technical Club.
- Editorial Board Member, institutional newsletter.
- Organizing Committee Member, ICCSDT International Conference.

You can find more about my background in my [resume](https://drive.google.com/file/d/1SkFmQX3bo4iyR0NWr1x7IlfQAKm05A3s/view?usp=sharing) or reach me at [nishantporwal203@gmail.com](mailto:nishantporwal203@gmail.com).
