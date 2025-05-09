
import { ReactNode } from "react";
import BaseLayout from "@/components/layout/BaseLayout";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <BaseLayout>
      {children}
    </BaseLayout>
  );
}
