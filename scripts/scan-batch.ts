#!/usr/bin/env tsx
/**
 * Scan batch : lance le scanner sur une liste de prospects.
 *
 * Lit un fichier data/prospects.json au format :
 *   [{ "ref": "2026-X042", "url": "https://example.com" }, ...]
 *
 * Sort un fichier par prospect dans data/scans/<ref>.json
 *
 * Usage :
 *   npm run scan:batch
 *   npm run scan:batch -- --concurrency 4
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { scan } from "../src/lib/scanner";

interface ProspectInput {
  ref: string;
  url: string;
}

const CONCURRENCY = parseInt(
  process.argv[process.argv.indexOf("--concurrency") + 1] || "2",
  10,
);

async function main() {
  const inputPath = resolve(process.cwd(), "data/prospects.json");
  const outputDir = resolve(process.cwd(), "data/scans");

  if (!existsSync(inputPath)) {
    console.error(`✗ Fichier introuvable : ${inputPath}`);
    console.error(`  Créer un fichier au format :`);
    console.error(`  [{ "ref": "2026-X042", "url": "https://example.com" }, ...]`);
    process.exit(1);
  }

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const prospects: ProspectInput[] = JSON.parse(readFileSync(inputPath, "utf-8"));
  console.log(`\n→ Scan batch de ${prospects.length} prospects (concurrence: ${CONCURRENCY})\n`);

  let succeeded = 0;
  let failed = 0;

  // Process by chunks to limit concurrency
  for (let i = 0; i < prospects.length; i += CONCURRENCY) {
    const chunk = prospects.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      chunk.map(async (prospect) => {
        console.log(`  [${prospect.ref}] Scan de ${prospect.url}...`);
        const result = await scan({ url: prospect.url });
        const outputPath = resolve(outputDir, `${prospect.ref}.json`);
        writeFileSync(outputPath, JSON.stringify(result, null, 2));
        console.log(`  [${prospect.ref}] ✓ Score ${result.scores.global}/100`);
      }),
    );

    for (const r of results) {
      if (r.status === "fulfilled") succeeded++;
      else {
        failed++;
        console.error(`  ✗ Échec :`, r.reason);
      }
    }
  }

  console.log(`\n✓ Terminé. ${succeeded} succès, ${failed} échecs.`);
  console.log(`📁 Rapports dans : ${outputDir}\n`);
}

main();
