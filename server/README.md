# IdeaForge Backend

A production-feasible, hackathon-demonstrable **structured AI decision-support pipeline** for underserved entrepreneurs.

> **This is NOT a chatbot. This is a structured AI decision-support pipeline.**

## 🎯 System Goals (Reskill Alignment)

- Convert minimal human context into personalized business guidance
- Reduce cognitive and time burden for underserved users
- Provide explainable, ethical, locally-adapted recommendations

**Backend Priorities:**
- Clarity > Complexity
- Guidance > Automation
- Trust > Intelligence theatrics

## 📐 Architecture Overview

```
User Input
    ↓
┌─────────────────────────┐
│ 1. Validation &         │  Accepts vague inputs, normalizes text,
│    Normalization        │  never rejects for lack of clarity
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ 2. Context Builder      │  Builds structured context with local
│                         │  economy data, audience insights
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ 3. LLaMA-4 Scout        │  PRIMARY MODEL: Generates domain ideas
│    (Idea Generation)    │  and raw reasoning
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ 4. GPT-5.2              │  SECONDARY MODEL: Structures outputs,
│    (Structuring/Safety) │  enforces schemas, applies safety
│                         │  ⚠️ NEVER generates ideas
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ 5. Feasibility &        │  Calculates scores, revenue ranges,
│    Simulation           │  budget suitability (all estimates)
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ 6. Ethical Safeguards   │  Filters harmful content, checks bias,
│                         │  ensures inclusive output
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ 7. Response Formatter   │  Creates frontend-safe JSON,
│                         │  no raw model responses exposed
└─────────────────────────┘
    ↓
Frontend-safe Output
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- OpenAI API key (required)
- Anthropic API key (optional)

### Installation

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your API keys
```

### Running

```bash
# Development
npm run dev

# Production
npm start

# Legacy server (original implementation)
npm run legacy
```

The server will start at `http://localhost:5001`

## 📡 API Endpoints

### `POST /api/generate`
Main idea generation pipeline.

**Request Body:**
```json
{
  "skills": "teaching, writing, public speaking",
  "interests": "education, community building",
  "budget": "1k-5k",
  "locationType": "semi-urban",
  "targetAudience": "students and young professionals",
  "goals": "Build sustainable income",
  "localData": "Near a university town",
  "region": "Agra",
  "language": "English"
}
```

**Response:**
```json
{
  "resultId": "uuid",
  "sessionId": "uuid",
  "results": {
    "businessIdea": { "title": "...", "description": "...", "whyItFits": "..." },
    "feasibilityScores": [...],
    "roadmap": [...],
    "pitchSummary": "..."
  },
  "ideas": [...],
  "decisionSupport": {
    "pros": [...],
    "cons": [...],
    "risks": [...],
    "mitigations": [...],
    "revenueSimulation": {
      "year1RevenueMin": 5000,
      "year1RevenueMax": 15000,
      "disclaimer": "..."
    },
    "budgetSuitability": "good",
    "easeOfExecution": "moderate"
  },
  "ethicalSafeguards": {...},
  "localAdaptation": {...},
  "metadata": {...}
}
```

### `POST /api/feedback`
Submit thumbs up/down feedback.

```json
{
  "sessionId": "uuid",
  "rating": "up",
  "resultId": "uuid"
}
```

### `GET /api/health`
Health check with AI availability status.

### `GET /api/session/:sessionId`
Retrieve session data.

### `GET /api/result/:resultId`
Retrieve a previously generated result.

## 🧠 Dual-Model Strategy

### Primary: LLaMA-4 Scout
- **Role:** Generate domain ideas and raw reasoning
- **Training Intent:** Low-budget, small-scale business cases
- **Temperature:** 0.7 (higher creativity)

### Secondary: GPT-5.2
- **Role:** Structure, refine, enforce safety
- **Strict Rules:**
  - NEVER generates ideas from scratch
  - ONLY structures outputs
  - ONLY enforces schemas
  - ONLY refines language
  - ONLY applies safety constraints
- **Temperature:** 0.3 (consistent, structured)

## 🔒 Ethical Safeguards

The backend implements multiple layers of protection:

1. **Input Safety Filter** - Blocks harmful content before processing
2. **Output Safety Validation** - Checks for exploitative suggestions
3. **Bias Detection** - Scans for demographic assumptions
4. **Financial Misinformation Checks** - Flags unrealistic claims

All outputs include:
- Bias check confirmations
- Inclusivity notes
- Harm avoidance documentation

## 📊 Simulation Logic

**Key Principles:**
- Use **ranges**, not exact figures
- Label all outputs as **estimates**
- Prefer **interpretability** over accuracy

Revenue simulations include:
- Year 1 revenue range (min-max)
- Year 1 profit range (min-max)
- Clear disclaimers about uncertainty

## 💾 Firebase Integration (Optional)

Used **ONLY** for:
- Session storage
- Input context caching
- Output persistence (short-lived)
- Feedback collection

**NOT** used for:
- Sensitive personal data
- Long-term user tracking
- Complex schemas

## 🔄 Fallback System

For demo reliability:
- Pre-cached safe responses by budget tier and location
- Automatic fallback on AI failure
- Clear system state communication

## 📁 Project Structure

```
server/
├── server.js                 # Main entry point
├── index.js                  # Legacy server
├── package.json
├── .env.example
└── src/
    ├── config/
    │   └── index.js          # Configuration management
    ├── schemas/
    │   └── index.js          # Zod validation schemas
    ├── pipeline/
    │   ├── index.js          # Pipeline exports
    │   ├── validation.js     # Input validation & normalization
    │   ├── contextBuilder.js # Context building & prompts
    │   ├── aiOrchestration.js # Dual-model orchestration
    │   ├── feasibilitySimulation.js # Scoring & revenue
    │   ├── ethicalSafeguards.js # Safety filters
    │   ├── responseFormatter.js # Output formatting
    │   └── fallback.js       # Demo fallbacks
    └── storage/
        └── firebase.js       # Storage abstraction
```

## 🌍 Scalability Notes

Designed for:
- **Multilingual expansion** (Hindi/English ready)
- **Regional adaptation** (local economy profiles)
- **Model swapping** (clean interfaces)
- **Incubator integration** (extensible output format)

## 📝 License

This project is part of the Reskill initiative for human-centric innovation.

---

**Remember:** This backend exists to support human potential, not replace human agency. Every output is designed to guide, not automate.
