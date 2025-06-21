import { PageContent } from "@/ui/layout/page-content";
import { PageWidthWrapper } from "@/ui/layout/page-width-wrapper";
import { DashboardClient } from "./dashboard-client";

export default function DashboardPage() {
  return (
    <PageContent title="Dashboard">
      <PageWidthWrapper>
        <DashboardClient />
      </PageWidthWrapper>
    </PageContent>
  );
}
