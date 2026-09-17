import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Edit } from "@/types";
import EditCard from "./EditCard";

type SortMode = "recent" | "top";

export default function EditsFeed() {
  const [edits, setEdits] = useState<Edit[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [isLoading, setIsLoading] = useState(true);

  const loadEdits = useCallback(async () => {
    setIsLoading(true);
    let query = supabase
      .from("edits")
      .select("*, votes(value)")
      .eq("status", "approved");

    query =
      sortMode === "recent"
        ? query.order("created_at", { ascending: false })
        : query.order("created_at", { ascending: false }); // el score se recalcula abajo

    const { data, error } = await query;
    if (!error && data) {
      const withScore: Edit[] = data.map((row: any) => ({
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
        voteScore: (row.votes ?? []).reduce(
          (sum: number, v: { value: number }) => sum + v.value,
          0,
        ),
      }));

      if (sortMode === "top") {
        withScore.sort((a, b) => (b.voteScore ?? 0) - (a.voteScore ?? 0));
      }
      setEdits(withScore);
    }
    setIsLoading(false);
  }, [sortMode]);

  useEffect(() => {
    loadEdits();
  }, [loadEdits]);

  async function handleVote(editId: string, value: 1 | -1) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("votes")
      .upsert({ user_id: user.id, edit_id: editId, value }, { onConflict: "user_id,edit_id" });

    loadEdits();
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setSortMode("recent")}
          className={`rounded-md px-3 py-1.5 text-sm ${
            sortMode === "recent"
              ? "bg-accent-primary text-text-inverse"
              : "bg-bg-elevated text-text-secondary"
          }`}
        >
          Recientes
        </button>
        <button
          type="button"
          onClick={() => setSortMode("top")}
          className={`rounded-md px-3 py-1.5 text-sm ${
            sortMode === "top"
              ? "bg-accent-primary text-text-inverse"
              : "bg-bg-elevated text-text-secondary"
          }`}
        >
          Top semanal
        </button>
      </div>

      {isLoading && <p className="text-text-muted">Cargando edits…</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {edits.map((edit) => (
          <EditCard key={edit.id} edit={edit} onVote={handleVote} />
        ))}
      </div>

      {!isLoading && edits.length === 0 && (
        <p className="text-text-muted">
          Todavía no hay edits aprobados. ¡Sé el primero en subir uno!
        </p>
      )}
    </div>
  );
}
