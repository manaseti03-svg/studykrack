import React from "react";
import Library from "@/components/Library";
import VaultIngest from "@/components/VaultIngest";
import TopicPulse from "@/components/TopicPulse";

export default function VaultPage() {
  return (
    <div className="min-h-[500px] md:min-h-[800px] space-y-12">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <VaultIngest />
        <TopicPulse />
      </div>
      <Library />
    </div>
  );
}
