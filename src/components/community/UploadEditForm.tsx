import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

const MAX_SIZE_BYTES = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = ["video/mp4", "video/webm"];

interface UploadEditFormProps {
  authorId: string;
  onUploaded?: () => void;
}

export default function UploadEditForm({ authorId, onUploaded }: UploadEditFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Selecciona un archivo de video.");
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Solo se permiten archivos .mp4 o .webm.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("El archivo no puede superar los 100MB.");
      return;
    }

    setIsSubmitting(true);
    try {
      const path = `${authorId}/${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("edits")
        .upload(path, file);
      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("edits").insert({
        author_id: authorId,
        title,
        description,
        video_path: path,
        status: "pending",
      });
      if (insertError) throw insertError;

      setTitle("");
      setDescription("");
      setFile(null);
      onUploaded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir el edit.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-border-subtle bg-bg-surface p-4">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm text-text-secondary">
          Título
        </label>
        <input
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-border-subtle bg-bg-base px-3 py-2 text-text-primary outline-none focus:border-accent-secondary"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm text-text-secondary">
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-border-subtle bg-bg-base px-3 py-2 text-text-primary outline-none focus:border-accent-secondary"
        />
      </div>

      <div>
        <label htmlFor="file" className="mb-1 block text-sm text-text-secondary">
          Video (mp4/webm, máx. 100MB)
        </label>
        <input
          id="file"
          type="file"
          accept="video/mp4,video/webm"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-text-secondary"
        />
      </div>

      {error && <p className="text-sm text-accent-live">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-accent-primary px-4 py-2 font-semibold text-text-inverse shadow-glow-primary disabled:opacity-50"
      >
        {isSubmitting ? "Subiendo…" : "Subir edit"}
      </button>
    </form>
  );
}
