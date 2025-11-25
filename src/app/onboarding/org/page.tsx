import { Metadata } from "next";
import { OrgForm } from "./org-form";

export const metadata: Metadata = {
  title: "Onboarding | Organization Setup",
  description:
    "Set up your organization details to customize your Complēre experience",
};

export default function OrganizationOnboarding() {
  return <OrgForm />;
}
