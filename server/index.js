import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import crypto from "crypto";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:8080")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : "*",
  })
);
app.use(express.json({ limit: "1mb" }));

const aiProviderDefault = (process.env.AI_PROVIDER || "openai").toLowerCase();
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const generateInputSchema = z.object({
  skills: z.string().min(2),
  interests: z.string().min(2),
  budget: z.string().min(1),
  locationType: z.string().min(1),
  targetAudience: z.string().min(2),
  goals: z.string().optional(),
  localData: z.string().optional(),
  region: z.string().optional(),
  language: z.string().optional(),
  provider: z.string().optional(),
  sessionId: z.string().optional(),
});

const resultsSchema = z.object({
  businessIdea: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    whyItFits: z.string().min(10),
  }),
  feasibilityScores: z
    .array(
      z.object({
        label: z.string().min(3),
        value: z.number().min(0).max(100),
        iconKey: z.enum(["market", "execution", "capital", "risk"]),
        description: z.string().min(5),
      })
    )
    .length(4),
  roadmap: z
    .array(
      z.object({
        phase: z.string().min(3),
        title: z.string().min(3),
        description: z.string().min(5),
        timeframe: z.string().min(3),
      })
    )
    .length(4),
  pitchSummary: z.string().min(10),
});

const decisionSupportSchema = z.object({
  pros: z.array(z.string()).min(2),
  cons: z.array(z.string()).min(2),
  assumptions: z.array(z.string()).min(2),
  risks: z.array(z.string()).min(2),
  mitigations: z.array(z.string()).min(2),
  revenueSimulation: z.object({
    year1Revenue: z.number().min(0),
    year1Profit: z.number(),
    currency: z.string().min(1),
    notes: z.string().min(5),
  }),
  explainability: z.string().min(10),
});

const aiResponseSchema = z.object({
  results: resultsSchema,
  ideas: z
    .array(
      z.object({
        title: z.string().min(3),
        description: z.string().min(10),
        whyItFits: z.string().min(10),
        localAdaptation: z.string().min(5),
      })
    )
    .min(3)
    .max(5),
  decisionSupport: decisionSupportSchema,
  ethicalSafeguards: z.object({
    biasChecks: z.array(z.string()).min(1),
    inclusivityNotes: z.array(z.string()).min(1),
    harmAvoidance: z.array(z.string()).min(1),
  }),
  localAdaptation: z.object({
    regionFocus: z.string().min(2),
    localEconomyTie: z.string().min(5),
    accessibilityNotes: z.string().min(5),
  }),
});

const feedbackSchema = z.object({
  sessionId: z.string().min(3),
  rating: z.enum(["up", "down"]),
  notes: z.string().optional(),
  resultId: z.string().optional(),
});

const feedbackStore = [];

const stripToJson = (text) => {
  if (!text) return "";
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) return text.trim();
  return text.slice(first, last + 1).trim();
};

const normalizeText = (value, maxLen = 600) => {
  if (!value) return "";
  return String(value).replace(/\s+/g, " ").trim().slice(0, maxLen);
};

const normalizeLanguage = (value) => {
  const raw = normalizeText(value, 40).toLowerCase();
  if (!raw) return "English";
  if (["hi", "hindi"].includes(raw)) return "Hindi";
  if (["en", "english"].includes(raw)) return "English";
  return "English";
};

const containsUnsafeContent = (text) => {
  const blocked = [
    "hate",
    "kill",
    "explosive",
    "weapon",
    "terror",
    "self-harm",
    "suicide",
  ];
  const normalized = String(text || "").toLowerCase();
  return blocked.some((word) => normalized.includes(word));
};

const enforceScoreOrder = (scores) =>
  scores.every((score, index) =>
    ["market", "execution", "capital", "risk"][index] === score.iconKey
  );

const enforceRoadmapPhases = (roadmap) =>
  roadmap.every((step, index) => step.phase === `Phase ${index + 1}`);

const clampScore = (value) => Math.min(100, Math.max(0, Number(value || 0)));

const withClampedScores = (results) => ({
  ...results,
  feasibilityScores: results.feasibilityScores.map((score) => ({
    ...score,
    value: clampScore(score.value),
  })),
});

const ensureProviderAvailable = (provider) => {
  if (provider === "openai" && !openai) {
    return "OPENAI_API_KEY is missing.";
  }
  if (provider === "anthropic" && !anthropic) {
    return "ANTHROPIC_API_KEY is missing.";
  }
  return null;
};

const callOpenAI = async ({ system, user, temperature = 0.7 }) => {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const response = await openai.chat.completions.create({
    model,
    temperature,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  return response.choices[0]?.message?.content || "";
};

const callAnthropic = async ({ system, user, temperature = 0.7 }) => {
  const model = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";
  const response = await anthropic.messages.create({
    model,
    temperature,
    max_tokens: 1200,
    system,
    messages: [{ role: "user", content: user }],
  });
  return response.content?.[0]?.text || "";
};

const callAI = async ({ provider, system, user, temperature }) => {
  if (provider === "anthropic") {
    return callAnthropic({ system, user, temperature });
  }
  return callOpenAI({ system, user, temperature });
};

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/generate", async (req, res) => {
  const parsed = generateInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input." });
  }

  const normalizedInput = {
    skills: normalizeText(parsed.data.skills, 400),
    interests: normalizeText(parsed.data.interests, 300),
    budget: normalizeText(parsed.data.budget, 60),
    locationType: normalizeText(parsed.data.locationType, 60),
    targetAudience: normalizeText(parsed.data.targetAudience, 200),
    goals: normalizeText(parsed.data.goals, 300),
    localData: normalizeText(parsed.data.localData, 400),
    region: normalizeText(parsed.data.region, 80),
    language: normalizeLanguage(parsed.data.language),
  };

  if (
    containsUnsafeContent(
      `${normalizedInput.skills} ${normalizedInput.interests} ${normalizedInput.localData}`
    )
  ) {
    return res.status(400).json({ error: "Input contains unsafe content." });
  }

  const provider = (parsed.data.provider || aiProviderDefault).toLowerCase();
  const providerError = ensureProviderAvailable(provider);
  if (providerError) {
    return res.status(400).json({ error: providerError });
  }

  const language = normalizedInput.language;
  const region = normalizedInput.region || normalizedInput.locationType || "local area";
  const localData = normalizedInput.localData || "No additional local data provided";
  const goals = normalizedInput.goals || "No specific goals provided";

  const system =
    "You are IdeaForge, a structured decision-support engine for aspiring entrepreneurs. Return ONLY valid JSON that matches the schema. No markdown, no extra text. Prioritize inclusivity, local context, and explainability. Avoid harmful, biased, or exclusionary suggestions.";

  const user = `Generate decision-support outputs based on this profile.\n\nUser profile:\n- Skills: ${normalizedInput.skills}\n- Interests: ${normalizedInput.interests}\n- Budget: ${normalizedInput.budget}\n- Location type: ${normalizedInput.locationType}\n- Target audience: ${normalizedInput.targetAudience}\n- Goals: ${goals}\n- Region focus: ${region}\n- Local data: ${localData}\n- Output language: ${language}\n\nReturn JSON with this exact schema:\n{\n  \"results\": {\n    \"businessIdea\": { \"title\": string, \"description\": string, \"whyItFits\": string },\n    \"feasibilityScores\": [\n      { \"label\": string, \"value\": number (0-100), \"iconKey\": \"market\"|\"execution\"|\"capital\"|\"risk\", \"description\": string }\n    ],\n    \"roadmap\": [\n      { \"phase\": string, \"title\": string, \"description\": string, \"timeframe\": string }\n    ],\n    \"pitchSummary\": string\n  },\n  \"ideas\": [\n    { \"title\": string, \"description\": string, \"whyItFits\": string, \"localAdaptation\": string }\n  ],\n  \"decisionSupport\": {\n    \"pros\": [string],\n    \"cons\": [string],\n    \"assumptions\": [string],\n    \"risks\": [string],\n    \"mitigations\": [string],\n    \"revenueSimulation\": { \"year1Revenue\": number, \"year1Profit\": number, \"currency\": string, \"notes\": string },\n    \"explainability\": string\n  },\n  \"ethicalSafeguards\": {\n    \"biasChecks\": [string],\n    \"inclusivityNotes\": [string],\n    \"harmAvoidance\": [string]\n  },\n  \"localAdaptation\": {\n    \"regionFocus\": string, \"localEconomyTie\": string, \"accessibilityNotes\": string\n  }\n}\n\nRules:\n- Provide 3-5 ideas with practical, low-barrier options for underserved users.\n- In results.feasibilityScores provide exactly 4 items with the iconKey order: market, execution, capital, risk.\n- Provide 4 roadmap steps with phases (Phase 1..4).\n- Keep outputs concise, practical, and explainable.\n- Use the requested output language.\n`;

  try {
    const raw = await callAI({
      provider,
      system,
      user,
      temperature: 0.6,
    });

    const jsonText = stripToJson(raw);
    const parsedJson = JSON.parse(jsonText);
    const validated = aiResponseSchema.parse(parsedJson);

    if (!enforceScoreOrder(validated.results.feasibilityScores)) {
      return res.status(422).json({ error: "Invalid score order." });
    }

    if (!enforceRoadmapPhases(validated.results.roadmap)) {
      return res.status(422).json({ error: "Invalid roadmap phases." });
    }

    const resultsWithClampedScores = withClampedScores(validated.results);

    res.json({
      resultId: crypto.randomUUID(),
      results: resultsWithClampedScores,
      ideas: validated.ideas,
      decisionSupport: validated.decisionSupport,
      ethicalSafeguards: validated.ethicalSafeguards,
      localAdaptation: validated.localAdaptation,
      provider,
      sessionId: parsed.data.sessionId || null,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate results." });
  }
});

app.post("/api/feedback", (req, res) => {
  const parsed = feedbackSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input." });
  }

  feedbackStore.push({
    ...parsed.data,
    receivedAt: new Date().toISOString(),
  });

  res.json({ status: "ok" });
});

const port = Number(process.env.PORT) || 5001;
app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
