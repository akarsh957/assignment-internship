import { seedCandidates } from "@/lib/seed";

const copy = (value) => JSON.parse(JSON.stringify(value));

export function getCandidates() {
  if (!globalThis.__earlyJobsCandidates) {
    globalThis.__earlyJobsCandidates = copy(seedCandidates);
  }
  return globalThis.__earlyJobsCandidates;
}

export function replaceCandidates(candidates) {
  globalThis.__earlyJobsCandidates = candidates;
  return candidates;
}
