// Server-side broadcast to Supabase Realtime. Clients subscribed to the
// matching channel receive the event without us re-opening the postgres
// row to anon RLS — the message content is whatever we send here.

type BroadcastEvent = "queue_update" | "event_status";

export async function broadcastToEvent(
  eventId: string,
  event: BroadcastEvent,
  payload: Record<string, unknown> = {}
): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;

  try {
    await fetch(`${url}/realtime/v1/api/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        messages: [{ topic: `event:${eventId}`, event, payload }],
      }),
    });
  } catch (err) {
    console.error("Realtime broadcast failed:", err);
  }
}
