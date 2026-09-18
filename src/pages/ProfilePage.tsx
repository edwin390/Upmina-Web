import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Edit, EditRow, Profile } from "@/types";
import EditCard from "@/components/community/EditCard";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [edits, setEdits] = useState<Edit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    async function load() {
      setIsLoading(true);
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      const { data: profileRow } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (profileRow) {
        setProfile({
          id: profileRow.id,
          username: profileRow.username,
          displayName: profileRow.display_name ?? undefined,
          avatarUrl: profileRow.avatar_url ?? undefined,
          bio: profileRow.bio ?? undefined,
          role: profileRow.role,
          createdAt: profileRow.created_at,
        });

        const { data: editRows } = await supabase
          .from("edits")
          .select("*")
          .eq("author_id", profileRow.id)
          .eq("status", "approved")
          .order("created_at", { ascending: false });

        if (editRows) {
          setEdits(
            editRows.map((row: EditRow) => ({
              id: row.id,
              authorId: row.author_id,
              title: row.title,
              description: row.description ?? undefined,
              videoPath: row.video_path,
              thumbnailPath: row.thumbnail_path ?? undefined,
              status: row.status,
              createdAt: row.created_at,
              updatedAt: row.updated_at,
            })),
          );
        }
      }
      setIsLoading(false);
    }

    load();
  }, [username]);

  if (isLoading) {
    return <p className="mx-auto max-w-6xl px-4 py-16 text-text-muted">Cargando perfil…</p>;
  }

  if (!profile) {
    return <p className="mx-auto max-w-6xl px-4 py-16 text-text-muted">Usuario no encontrado.</p>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 flex items-center gap-4">
        <img
          src={profile.avatarUrl ?? "/images/default-avatar.png"}
          alt={profile.username}
          className="h-20 w-20 rounded-full border border-border-subtle object-cover"
        />
        <div>
          <h1 className="font-display text-3xl tracking-wide">
            {profile.displayName ?? profile.username}
          </h1>
          <p className="text-text-secondary">@{profile.username}</p>
          {profile.bio && <p className="mt-1 text-text-secondary">{profile.bio}</p>}
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-text-primary">Edits</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {edits.map((edit) => (
          <EditCard key={edit.id} edit={edit} onVote={() => {}} />
        ))}
      </div>
    </div>
  );
}
