import { createFileRoute, Outlet } from "@tanstack/react-router";
import { eventErrorComponent, eventNotFoundComponent } from "@/components/RouteState";

export const Route = createFileRoute("/events/$slug")({
  component: EventLayout,
  notFoundComponent: eventNotFoundComponent,
  errorComponent: eventErrorComponent,
});

function EventLayout() {
  return (
    <div className="safe-x">
      <Outlet />
    </div>
  );
}
