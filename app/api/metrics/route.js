import { NextResponse } from "next/server";
import { stages } from "@/lib/seed";
import { getCandidates } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const candidates = getCandidates();
  const byStage = stages.map((stage) => ({
    stage,
    count: candidates.filter((candidate) => candidate.stage === stage).length
  }));
  const roleCounts = candidates.reduce((counts, candidate) => {
    counts[candidate.department] = (counts[candidate.department] || 0) + 1;
    return counts;
  }, {});
  const activity = candidates
    .flatMap((candidate) => (candidate.activity || []).map((item) => ({ ...item, candidate: candidate.name, role: candidate.role })))
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 6);
  const offers = candidates.filter((candidate) => ["Offer", "Hired"].includes(candidate.stage)).length;
  const hired = candidates.filter((candidate) => candidate.stage === "Hired").length;

  return NextResponse.json({
    total: candidates.length,
    active: candidates.filter((candidate) => !["Hired", "Rejected"].includes(candidate.stage)).length,
    interviews: candidates.filter((candidate) => candidate.stage === "Interview").length,
    hired,
    acceptanceRate: offers ? Math.round((hired / offers) * 100) : 0,
    byStage,
    byDepartment: Object.entries(roleCounts).map(([name, value]) => ({ name, value })),
    activity
  });
}
