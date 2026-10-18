import ATSWorkspace from "@/components/ATSWorkspace";
import { seedCandidates } from "@/lib/seed";

export default function DashboardPage() {
  return <ATSWorkspace initialCandidates={seedCandidates} />;
}
