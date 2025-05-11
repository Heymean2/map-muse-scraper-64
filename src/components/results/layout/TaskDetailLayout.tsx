
import { ReactNode } from "react";
import BaseLayout from "@/components/layout/BaseLayout";

interface TaskDetailLayoutProps {
  children: ReactNode;
}

export default function TaskDetailLayout({ children }: TaskDetailLayoutProps) {
  return (
    <BaseLayout hideRail={true}>
      {children}
    </BaseLayout>
  );
}
