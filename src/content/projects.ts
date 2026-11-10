export type Project = {
  slug: string;
  title: string;
  category: "Software Engineering" | "Applied AI" | "Research";
  summary: string;
  role: string;
  stack: string[];
  repo: string;
  liveUrl?: string;
  screenshot?: { src: string; width: number; height: number; alt: string; caption: string };
  gallery?: { src: string; width: number; height: number; alt: string; caption: string };
  flow: { title: string; detail: string }[];
  problem: string;
  contributions: string[];
  decisions: { title: string; detail: string }[];
  challenges: string;
  results: string;
  limitations: string;
  nextSteps: string;
  sourceFiles: { label: string; path: string }[];
  revision: string;
};

export const projects: Project[] = [
  {
    slug: "peerlink",
    title: "PeerLink",
    category: "Software Engineering",
    summary: "Peer-to-peer video calls, with custom signaling and a carefully managed connection lifecycle.",
    role: "Full-stack development",
    stack: ["React", "TypeScript", "Node.js", "WebRTC", "WebSockets", "MongoDB", "Docker"],
    repo: "https://github.com/nishant203code/PeerLink",
    liveUrl: "https://peerlink-7ya7.onrender.com/",
    revision: "c64ba8e3738267bc108731b76028b727e5abde75",
    screenshot: { src: "/projects/peerlink-dashboard.jpg", width: 1920, height: 970, alt: "PeerLink dashboard with contact search and video-call controls", caption: "PeerLink dashboard" },
    gallery: { src: "/projects/peerlink-home.jpg", width: 1920, height: 967, alt: "PeerLink landing page introducing its video communication features", caption: "PeerLink home page" },
    flow: [
      { title: "React client", detail: "Contacts, call state & local media" },
      { title: "WebSocket signaling", detail: "SDP offers, answers & ICE candidates" },
      { title: "WebRTC peers", detail: "Browser-to-browser audio & video" },
    ],
    problem: "A video call depends on several asynchronous events: finding a contact, obtaining camera access, negotiating a connection, and handling either participant leaving. The interface and network state need to remain in step through that lifecycle.",
    contributions: [
      "Built the React and TypeScript interface with contact discovery and reactive call state.",
      "Implemented WebSocket message routing for offers, answers, ICE candidates, rejection, and call termination.",
      "Connected JWT cookie authentication and MongoDB-backed user routes; packaged the application with Docker.",
    ],
    decisions: [
      { title: "Separate signaling from media", detail: "The Node server relays connection metadata while WebRTC handles media. This keeps call control explicit without sending the video stream through the application server." },
      { title: "Buffer early ICE candidates", detail: "Candidates can arrive before the peer connection is ready. A client-side buffer defers their application until the connection can accept them." },
    ],
    challenges: "Call teardown crosses sockets, peer connections, and media tracks. The client closes peer connections and stops tracks, while the server removes socket mappings on disconnect. Reconnection and overlapping socket lifetimes need particular care: an old socket closing can affect a newer mapping.",
    results: "PeerLink is deployed and available online, connecting contact discovery and authentication with WebSocket signaling and browser-to-browser audio and video.",
    limitations: "The server keeps connection mappings in memory and supports one mapped socket per user. Production scaling, TURN coverage, malformed-message handling, and reconnection behavior require further testing. Latency and concurrency have not been benchmarked.",
    nextSteps: "Test calls across restrictive networks and add explicit session ownership checks around reconnect and cleanup.",
    sourceFiles: [
      { label: "Signaling server", path: "backend/src/ws/ws.ts" },
      { label: "Call lifecycle", path: "frontend/src/component/VideoCall/videocall.tsx" },
    ],
  },
  {
    slug: "legal-ai-assistant",
    title: "Legal AI Assistant",
    category: "Applied AI",
    summary: "Legal document workflows that connect a Flutter interface with model inference endpoints.",
    role: "Applied AI & application development",
    stack: ["Python", "Flutter", "FastAPI", "Gemma", "Legal LED"],
    repo: "https://github.com/nishant203code/Legal-AI-Assistant-Model-Serving-Deployment",
    revision: "5749267d82ae2b6a427de2e9875690dca5787db7",
    flow: [
      { title: "Document input", detail: "PDF text extraction in Flutter" },
      { title: "Inference API", detail: "Structured requests & model input" },
      { title: "Legal models", detail: "Gemma Q&A & Legal LED summaries" },
    ],
    problem: "Legal documents are long and difficult to navigate. The project explores a shared application interface for asking questions, summarizing text, drafting documents, and categorizing clauses.",
    contributions: [
      "Connected a Flutter chat interface to task-specific HTTP endpoints, with loading and failure states.",
      "Implemented PDF text extraction and structured document submission from the client.",
      "Developed model training and inference notebooks for legal-language tasks, including Gemma-based experimentation.",
    ],
    decisions: [
      { title: "Keep model tasks separate", detail: "The inference notebook wraps Gemma for Q&A and Legal LED for summarization. Separate model interfaces allow task-specific preprocessing and output handling." },
      { title: "Extract text before submission", detail: "The Flutter provider extracts PDF text locally and sends JSON to an endpoint. This simplifies the request contract, but scanned documents need an additional OCR path." },
    ],
    challenges: "Model responses and endpoint response shapes vary. The client accepts answer, response, or result fields and clears its typing indicator after success or failure. Long-document context limits and shared server-side document state remain engineering concerns.",
    results: "The prototype includes a Flutter client, Gemma 3 1B training code, and a FastAPI inference notebook using Gemma and Legal LED.",
    limitations: "The serving example runs from a notebook and uses a tunnel. Production deployment and model quality have not been validated with a reproducible evaluation. Document state needs session isolation, and outputs require human review.",
    nextSteps: "Move notebook serving into a reproducible service, isolate document state per session, and publish a task-specific evaluation with dataset provenance.",
    sourceFiles: [
      { label: "Flutter document and chat provider", path: "legalai_app/lib/legal_chat_provider.dart" },
      { label: "Training notebook", path: "backend/models/clause-classification/gemma_train.ipynb" },
      { label: "Inference notebook", path: "backend/models/qna_engine/inference and api endpoint via kaggle .ipynb" },
    ],
  },
  {
    slug: "terraalert",
    title: "TerraAlert",
    category: "Research",
    summary: "From georeferenced satellite imagery to landslide zones, risk signals, and safer route planning.",
    role: "Research & geospatial ML development",
    stack: ["Python", "DeepLabV3+", "PyTorch", "FastAPI", "Rasterio", "OSMnx"],
    repo: "https://github.com/nishant203code/TeraAlert---Landslide-Detection-Early-Warning-System",
    revision: "56de4b3113324659ed01cf447efeea862d4af0b5",
    flow: [
      { title: "Satellite imagery", detail: "GeoTIFF pixels, transform & CRS" },
      { title: "Segmentation", detail: "Detection masks → geographic zones" },
      { title: "Risk & response", detail: "Hazard-aware routing & alerting" },
    ],
    problem: "A segmentation mask alone is not enough for disaster-response planning. Detections must be located in geographic space and connected to surrounding roads and risk information without losing coordinate accuracy.",
    contributions: [
      "Worked on the satellite-image detection and severity workflow during research at DAViSE Lab.",
      "Connected geospatial segmentation, affected-zone localization, and response planning in the TerraAlert framework.",
      "Developed hazard-aware route optimization and alerting workflows.",
    ],
    decisions: [
      { title: "Preserve geographic metadata", detail: "The upload path accepts GeoTIFF so it can preserve the affine transform and coordinate reference system. Rasterio and coordinate transformation map detected pixels back to latitude and longitude." },
      { title: "Connect detection to routing", detail: "The routing service uses a road graph and a genetic search with shortest-path candidates. It checks whether routes can avoid the landslide zone rather than assuming a safe route always exists." },
    ],
    challenges: "Satellite data can use a projected coordinate system while a map expects WGS84. The implementation transforms coordinates explicitly. Detection also has a heuristic fallback when model weights are absent; that output must not be confused with learned-model inference.",
    results: "The framework connects GeoTIFF ingestion and DeepLabV3+ inference with geographic localization, routing, and risk services.",
    limitations: "Availability of trained weights, satellite coverage, thresholds, and external weather or road data affect output. Detection coverage, accuracy, and latency need a reproducible evaluation. This is a research system and has not been validated for operational emergency decisions.",
    nextSteps: "Evaluate on held-out geospatial regions, separate fallback output from model predictions, and document uncertainty in every risk and route result.",
    sourceFiles: [
      { label: "Image ingestion and localization", path: "backend/services/ml_service.py" },
      { label: "Routing service", path: "backend/services/routing_service.py" },
    ],
  },
  {
    slug: "codetracker",
    title: "CodeTracker",
    category: "Software Engineering",
    summary: "A problem-solving log that turns revision history into a practical next practice session.",
    role: "Full-stack product development",
    stack: ["React", "TypeScript", "TanStack Start", "Supabase", "PostgreSQL", "Chrome Extension"],
    repo: "https://github.com/nishant203code/CodeTracker",
    liveUrl: "https://code-tracker-bh1n.vercel.app/",
    revision: "b81ce83e81a6b1c295db066820d844ea58ceaa49",
    screenshot: { src: "/projects/codetracker-dashboard.png", width: 1906, height: 905, alt: "CodeTracker dashboard showing a problem log, activity heatmap, and topic breakdown", caption: "CodeTracker dashboard" },
    gallery: { src: "/projects/codetracker-revise.png", width: 1895, height: 904, alt: "CodeTracker revision interface for selecting and reviewing practice problems", caption: "CodeTracker revision view" },
    flow: [
      { title: "Capture", detail: "Web form or browser extension" },
      { title: "Problem log", detail: "Identity, status & review history" },
      { title: "Revision selection", detail: "Weighted priorities & outcomes" },
    ],
    problem: "Recording a solved problem is easy; deciding what to revisit is harder. CodeTracker brings capture, problem state, revision history, and practice selection into one workflow.",
    contributions: [
      "Built a problem log with status transitions and duplicate checks based on platform identity or normalized names.",
      "Implemented dynamic revision scoring using status, review count, difficulty, and elapsed time.",
      "Added browser-extension capture and GitHub integration alongside the dashboard and revision interface.",
    ],
    decisions: [
      { title: "Recompute priorities on demand", detail: "Revision selection ranks the current problem set rather than storing a fixed future schedule. Configurable weights make the behavior transparent and easy to adjust." },
      { title: "Use identity before display text", detail: "Duplicate handling prefers platform and problem ID, with normalized names as a fallback. This helps repeated extension submissions map to an existing problem." },
    ],
    challenges: "The same problem can arrive from manual input and browser capture with different text formatting. Duplicate checks and normalization address that mismatch. A small random scoring term varies ties, so revision order is intentionally not fully deterministic.",
    results: "The implementation contains problem-state handling, a weighted revision algorithm, extension code, and dashboard screenshots. Activity counts in the screenshots are product data, not claims about adoption or learning outcomes.",
    limitations: "The revision heuristic has not been evaluated as a learning intervention. Concurrent duplicate submissions and platform changes need testing beyond the existing client checks.",
    nextSteps: "Add evaluation of revision choices and strengthen duplicate guarantees at the data boundary.",
    sourceFiles: [
      { label: "Revision algorithm", path: "src/lib/spaced-repetition.ts" },
      { label: "Problem identity and duplicate checks", path: "src/lib/problems.ts" },
      { label: "Browser extension", path: "extension/background.js" },
    ],
  },
  {
    slug: "it-support-rag",
    title: "IT Support RAG",
    category: "Applied AI",
    summary: "Retrieval-grounded IT answers with ticket context and source attribution.",
    role: "Retrieval pipeline development",
    stack: ["Python", "FastAPI", "LlamaIndex", "Qdrant", "OpenAI"],
    repo: "https://github.com/nishant203code/IT-Support-RAG",
    revision: "cf70bb38b2719a2d0f655fb20533a39284420f55",
    flow: [
      { title: "Ticket knowledge base", detail: "CSV → documents → chunks" },
      { title: "Semantic retrieval", detail: "OpenAI embeddings & Qdrant" },
      { title: "Grounded response", detail: "Retrieved context & source metadata" },
    ],
    problem: "IT troubleshooting knowledge is often spread across past tickets. The project retrieves relevant ticket content before asking a language model to compose an answer.",
    contributions: ["Converted CSV ticket rows into documents with ticket metadata.", "Connected configurable chunking, OpenAI embeddings, Qdrant retrieval, and a FastAPI query endpoint."],
    decisions: [{ title: "Return sources alongside answers", detail: "The query path extracts source nodes and metadata, making the retrieved context inspectable rather than returning only generated prose." }],
    challenges: "A context-only prompt asks the model to abstain when the knowledge base is insufficient. Prompting alone cannot guarantee grounded answers; retrieval coverage and response evaluation remain essential.",
    results: "The pipeline uses text-embedding-3-small and gpt-4.1-mini through LlamaIndex, with compact responses and top-k retrieval. Source metadata is returned with the answer.",
    limitations: "The query endpoint returns complete responses without streaming. Retrieval quality, stale tickets, and unsupported questions need a dedicated evaluation set.",
    nextSteps: "Create answerability and citation checks, and evaluate chunk size and retrieval depth against representative tickets.",
    sourceFiles: [{ label: "Retrieval engine", path: "rag_engine.py" }, { label: "FastAPI query endpoint", path: "main.py" }],
  },
  {
    slug: "ai-mock-interviewer",
    title: "Automated AI Mock Interviewer",
    category: "Applied AI",
    summary: "Role-specific practice interviews, generated questions, recorded answers, and feedback history.",
    role: "AI web application development",
    stack: ["Next.js", "React", "Tailwind CSS", "Gemini", "PostgreSQL", "Drizzle"],
    repo: "https://github.com/nishant203code/Automated-AI-Mock-Interviewer",
    revision: "c6b2aec6fdb9bcc2c45a8a52a3e64416cfa9ad0d",
    flow: [
      { title: "Role & experience", detail: "Position, description & seniority" },
      { title: "Interview generation", detail: "Gemini questions & reference answers" },
      { title: "Practice & feedback", detail: "Answers and history in PostgreSQL" },
    ],
    problem: "Interview practice is more useful when questions reflect the role and experience level. This application keeps question generation, answering, and feedback in a repeatable workflow.",
    contributions: ["Built a role-based question-generation flow with structured JSON parsing and failure handling.", "Connected interview records, user answers, and feedback through a PostgreSQL schema using Drizzle."],
    decisions: [{ title: "Persist the generated interview", detail: "Questions and reference answers are stored with role metadata, and answer records reference the interview ID. This preserves context for later feedback and history." }],
    challenges: "Generated responses can contain Markdown fences or malformed JSON. The question flow cleans common wrappers, parses the result, and handles failures before attempting to save an interview.",
    results: "Users can create practice interviews, record answers, and revisit feedback and interview history.",
    limitations: "Feedback accuracy and improvements in interview outcomes have not been measured. Generated reference answers and feedback are not an objective hiring assessment. API availability, privacy, and model-output validation need review before wider use.",
    nextSteps: "Validate every generated question against a schema and test feedback consistency on a representative set of answers.",
    sourceFiles: [{ label: "Interview generation", path: "app/dashboard/_components/AddNewInterview.jsx" }, { label: "Database schema", path: "utils/schema.js" }],
  },
];
