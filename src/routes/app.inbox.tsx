import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/inbox")({
  beforeLoad: () => {
    throw redirect({ to: "/app/messages" });
  },
});
