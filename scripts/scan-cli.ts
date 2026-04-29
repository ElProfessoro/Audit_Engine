#!/usr/bin/env tsx
/**
 * Scan CLI : lance un scan sur une URL et affiche le résultat.
 *
 * Usage :
 *   npm run scan -- https://example.com
 *   npm run scan -- https://example.com --output result.json
 */

import { writeFileSync } from "node:fs";
import { scan } from "../src/lib/scanner";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: npm run scan -- <url> [--output <path>]");
    process.exit(1);
  }

  const url = args[0];
  const outputIndex = args.indexOf("--output");
  const outputPath = outputIndex !== -1 ? args[outputIndex + 1] : null;

  console.log(`\n→ Scan de ${url}...\n`);

  try {
    const start = Date.now();
    const result = await scan({ url });
    const duration = Date.now() - start;

    console.log(`✓ Scan terminé en ${(duration / 1000).toFixed(1)}s`);
    console.log(`\n📊 Résumé :`);
    console.log(`   Score global       : ${result.scores.global}/100`);
    console.log(`   Cookies détectés   : ${result.cookies.length}`);
    console.log(`   Scripts tiers      : ${result.thirdPartyScripts.length}`);
    console.log(`   Anomalies critiques: ${result.anomalies.filter(a => a.severity === "critical").length}`);
    console.log(`   Anomalies modérées : ${result.anomalies.filter(a => a.severity === "moderate").length}`);
    console.log(`   Points vigilance   : ${result.anomalies.filter(a => a.severity === "watch").length}`);

    if (outputPath) {
      writeFileSync(outputPath, JSON.stringify(result, null, 2));
      console.log(`\n📄 Rapport complet écrit dans ${outputPath}`);
    } else {
      console.log("\n💡 Pour le rapport complet : --output result.json");
    }
  } catch (error) {
    console.error(`\n✗ Échec du scan :`, error);
    process.exit(1);
  }
}

main();
