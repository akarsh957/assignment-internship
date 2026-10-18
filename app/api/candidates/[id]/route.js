import { NextResponse } from "next/server";
import { stages } from "@/lib/seed";
import { getCandidates } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  const { id } = await params;
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
  const candidates = getCandidates();
  const candidate = candidates.find((item) => item.id === id);
  if (!candidate) return NextResponse.json({ error: "Candidate not found." }, { status: 404 });

  const hasStage = Object.hasOwn(body, "stage");
  const hasRating = Object.hasOwn(body, "rating");
  if (hasStage) {
    if (!stages.includes(body.stage)) return NextResponse.json({ error: "Invalid hiring stage." }, { status: 400 });
  }
  let rating;
  if (hasRating) {
    rating = Number(body.rating);
    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 0 and 5." }, { status: 400 });
    }
  }

  if (hasStage) {
    if (candidate.stage !== body.stage) {
      candidate.activity.unshift({ id: `a-${Date.now()}`, from: candidate.stage, to: body.stage, at: new Date().toISOString() });
      candidate.stage = body.stage;
    }
  }
  if (hasRating) {
    candidate.rating = rating;
  }
  if (typeof body.note === "string" && body.note.trim()) {
    candidate.notes.unshift({
      id: `n-${Date.now()}`,
      text: body.note.trim(),
      author: typeof body.author === "string" && body.author.trim() ? body.author.trim() : "Recruiter",
      createdAt: new Date().toISOString()
    });
  }
  return NextResponse.json(candidate);
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  const candidates = getCandidates();
  const index = candidates.findIndex((candidate) => candidate.id === id);
  if (index < 0) return NextResponse.json({ error: "Candidate not found." }, { status: 404 });
  candidates.splice(index, 1);
  return NextResponse.json({ success: true });
}
