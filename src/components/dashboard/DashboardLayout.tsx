
import { ReactNode } from "react";
import BaseLayout from "@/components/layout/BaseLayout";

interface DashboardLayoutProps {
  children: ReactNode;
  hideRail?: boolean;
}

export default function DashboardLayout({ children, hideRail }: DashboardLayoutProps) {
  return (
    <BaseLayout hideRail={hideRail}>
      {children}
    </BaseLayout>
  );
}
