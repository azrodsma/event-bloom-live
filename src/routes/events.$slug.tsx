import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/events/$slug")({
  component: EventLayout,
});

function EventLayout() {
  return (
    <div className="safe-x">
      <Outlet />
    </div>
  );
}
