import { NextResponse } from "next/server";
import { stages } from "@/lib/seed";
import { getCandidates } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getCandidates());
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
    throw error;
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Request body must be a JSON object." }, { status: 400 });
  }
  const required = ["name", "email", "role"];
  if (required.some((key) => typeof body[key] !== "string" || !body[key].trim())) {
    return NextResponse.json({ error: "Name, email, and role are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const candidates = getCandidates();
  if (candidates.some((candidate) => candidate.email.toLowerCase() === body.email.trim().toLowerCase())) {
    return NextResponse.json({ error: "A candidate with this email already exists." }, { status: 409 });
  }
  const stage = stages.includes(body.stage) ? body.stage : "Applied";
  const candidate = {
    id: `c-${Date.now()}`,
    name: body.name.trim(),
    email: body.email.trim(),
    phone: typeof body.phone === "string" ? body.phone.trim() : "",
    role: body.role.trim(),
    department: typeof body.department === "string" && body.department.trim() ? body.department.trim() : "Engineering",
    experience: Math.max(0, Number(body.experience) || 0),
    skills: Array.isArray(body.skills) ? body.skills.filter((skill) => typeof skill === "string").map((skill) => skill.trim()).filter(Boolean) : [],
    score: Math.min(100, Math.max(0, Number(body.score) || 70)),
    stage,
    appliedAt: new Date().toISOString(),
    linkedin: typeof body.linkedin === "string" ? body.linkedin.trim() : "",
    resume: typeof body.resume === "string" ? body.resume.trim() : "",
    rating: 0,
    notes: [],
    activity: []
  };
  candidates.unshift(candidate);
  return NextResponse.json(candidate, { status: 201 });
}
