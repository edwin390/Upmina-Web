import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Edit, EditRow } from "@/types";
import { formatRelativeDate } from "@/lib/format";

export default function ModerationPanel() {
  const [pending, setPending] = useState<Edit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [note, setNote] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from("edits")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (!error && data) {
      setPending(
        data.map((row: EditRow) => ({
          id: row.id,
          authorId: row.author_id,
          title: row.title,
          description: row.description ?? undefined,
          videoPath: row.video_path,
          thumbnailPath: row.thumbnail_path ?? undefined,
          status: row.status,
          moderationNote: row.moderation_note ?? undefined,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        })),
      );
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function resolve(editId: string, status: "approved" | "rejected") {
    if (!supabase) return;

    await supabase
      .from("edits")
      .update({ status, moderation_note: note[editId] ?? null })
      .eq("id", editId);
    load();
  }

  if (isLoading) {
    return <p className="text-text-muted">Cargando edits pendientes…</p>;
  }

  if (pending.length === 0) {
    return <p className="text-text-muted">No hay edits pendientes de revisión.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {pending.map((edit) => (
        <div
          key={edit.id}
          className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-bg-surface p-4 md:flex-row"
        >
          <div className="aspect-video w-full flex-shrink-0 bg-black md:w-64">
            <video src={edit.videoPath} controls className="h-full w-full" />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <p className="font-medium text-text-primary">{edit.title}</p>
            {edit.description && (
              <p className="text-sm text-text-secondary">{edit.description}</p>
            )}
            <p className="text-xs text-text-muted">
              Subido {formatRelativeDate(edit.createdAt)}
            </p>

            <textarea
              placeholder="Nota de moderación (opcional)"
              value={note[edit.id] ?? ""}
              onChange={(e) => setNote((n) => ({ ...n, [edit.id]: e.target.value }))}
              rows={2}
              className="w-full rounded-md border border-border-subtle bg-bg-base px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-secondary"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => resolve(edit.id, "approved")}
                className="rounded-md bg-accent-success px-3 py-1.5 text-sm font-semibold text-text-inverse"
              >
                Aprobar
              </button>
              <button
                type="button"
                onClick={() => resolve(edit.id, "rejected")}
                className="rounded-md bg-accent-live px-3 py-1.5 text-sm font-semibold text-white"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
