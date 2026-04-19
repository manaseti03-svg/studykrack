"use client";
import React, { useContext } from "react";
import SearchRadar from "@/components/SearchRadar";
import { DashboardContext } from "../layout";

import DailyOperations from "@/components/DailyOperations";

export default function DashboardPage() {
  const { setActiveNode } = useContext(DashboardContext);

  return (
    <div className="min-h-[500px] md:min-h-[800px] space-y-8">
      <DailyOperations />
      <SearchRadar onSelectNode={(node: any) => setActiveNode(node)} />
    </div>
  );
}
