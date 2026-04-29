import { notFound } from "next/navigation";
import { loadProspect } from "@/lib/data/load-prospect";
import { AuditShell } from "@/components/layout/AuditShell";

interface AuditPageProps {
  params: Promise<{ ref: string }>;
}

export default async function AuditPage({ params }: AuditPageProps) {
  const { ref } = await params;
  const prospect = await loadProspect(ref);

  if (!prospect) {
    notFound();
  }

  return <AuditShell prospect={prospect} />;
}
