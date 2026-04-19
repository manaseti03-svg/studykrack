"use client";
import React from "react";
import Library from "@/components/Library";

import VaultIngest from "@/components/VaultIngest";

export default function VaultPage() {
  return (
    <div className="min-h-[500px] md:min-h-[800px] space-y-12">
      <VaultIngest />
      <Library />
    </div>
  );
}
