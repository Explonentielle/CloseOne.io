"use client";

import DashboardTab from "@/components/dashboard/DashBoardTab";
import KpiDailyHistoryTab from "@/components/dashboard/KpiDailyHistoryTab";
import KpiDailyModal from "@/components/dashboard/KpiDailyModal";
import KpiWeeklyModal from "@/components/dashboard/KpiWeeklyModal";
import KpiWeeklyTab from "@/components/dashboard/KpiWeeklyTab";
import { useState } from "react";

const tabs = [
  { key: "dashboard", label: "Dashboard" },
  { key: "kpiDaily", label: "KPI Daily" },
  { key: "kpiWeekly", label: "KPI Weekly" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const DashboardView = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);

  return (
    <div className="animate-fade-in max-w-[1440px] mx-auto space-y-4">
      {/* Barre d'onglets + boutons d'action */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-1 p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === t.key
                  ? "bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] border border-[hsl(var(--primary)/0.25)]"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "dashboard" && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowDailyModal(true)}
              className="flex items-center gap-2.5 px-[18px] py-[10px] rounded-[10px] bg-[hsl(var(--card))] border border-[hsl(var(--primary)/0.3)] text-[hsl(var(--primary))] text-sm font-medium hover:bg-[hsl(var(--primary)/0.1)] hover:border-[hsl(var(--primary))] transition-all"
            >
              <span className="w-[18px] h-[18px] rounded-[5px] bg-[hsl(var(--primary)/0.15)] flex items-center justify-center text-[11px] font-bold text-[hsl(var(--primary))]">
                D
              </span>
              KPI Daily
            </button>
            <button
              onClick={() => setShowWeeklyModal(true)}
              className="flex items-center gap-2.5 px-[18px] py-[10px] rounded-[10px] bg-[hsl(var(--card))] border border-[hsl(var(--warning)/0.3)] text-[hsl(var(--warning))] text-sm font-medium hover:bg-[hsl(var(--warning)/0.1)] hover:border-[hsl(var(--warning))] transition-all"
            >
              <span className="w-[18px] h-[18px] rounded-[5px] bg-[hsl(var(--warning)/0.15)] flex items-center justify-center text-[11px] font-bold text-[hsl(var(--warning))]">
                W
              </span>
              KPI Weekly
            </button>
          </div>
        )}
      </div>

      <div key={activeTab} className="animate-fade-in">
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "kpiDaily" && <KpiDailyHistoryTab />}
        {activeTab === "kpiWeekly" && <KpiWeeklyTab />}
      </div>

      <KpiDailyModal open={showDailyModal} onClose={() => setShowDailyModal(false)} />
      <KpiWeeklyModal open={showWeeklyModal} onClose={() => setShowWeeklyModal(false)} />
    </div>
  );
};

export default DashboardView;