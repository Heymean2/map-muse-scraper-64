
import { ReactNode } from "react";
import BaseLayout from "@/components/layout/BaseLayout";

interface DashboardLayoutProps {
  children: ReactNode;
  hideRail?: boolean;
  hideSidebar?: boolean;
}

export default function DashboardLayout({ children, hideRail, hideSidebar }: DashboardLayoutProps) {
  return (
    <BaseLayout hideRail={hideRail} hideSidebar={hideSidebar}>
      {children}
    </BaseLayout>
  );
}
