import { createFileRoute } from "@tanstack/react-router";

import { CreateTextForm } from "@/components/sections/create-text-form";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return <CreateTextForm />;
}
