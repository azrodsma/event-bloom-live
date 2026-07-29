import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { listPostComments, createComment, deleteComment } from "@/lib/social.functions";
import { useAuth } from "@/hooks/use-auth";

export function CommentThread({ postId, eventId }: { postId: string; eventId: string }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const fetchComments = useServerFn(listPostComments);
  const addComment = useServerFn(createComment);
  const removeComment = useServerFn(deleteComment);
  const [text, setText] = useState("");

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments({ data: { postId } }),
  });

  const mut = useMutation({
    mutationFn: (content: string) => addComment({ data: { postId, content } }),
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey: ["comments", postId] });
      qc.invalidateQueries({ queryKey: ["posts", eventId] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });

  const del = useMutation({
    mutationFn: (id: string) => removeComment({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments", postId] });
      qc.invalidateQueries({ queryKey: ["posts", eventId] });
      toast.success("Commentaire supprimé");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });

  return (
    <div className="mt-3 space-y-3 border-t border-border/60 pt-3">
      {isLoading ? (
        <div className="h-8 animate-pulse rounded-xl bg-muted" />
      ) : comments.length === 0 ? (
        <p className="text-xs text-muted-foreground">Soyez le premier à commenter.</p>
      ) : (
        <ul className="space-y-2">
          {comments.map((c) => (
            <li key={c.id} className="group flex items-start gap-2 rounded-2xl bg-muted/60 px-3 py-2 text-sm">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground">{c.author_name ?? "Invité"}</p>
                <p className="whitespace-pre-wrap break-words">{c.content}</p>
              </div>
              {user?.id && c.author_id === user.id && (
                <button
                  onClick={() => {
                    if (confirm("Supprimer ce commentaire ?")) del.mutate(c.id);
                  }}
                  disabled={del.isPending}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-destructive group-hover:opacity-100 disabled:opacity-40"
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {user ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (text.trim()) mut.mutate(text.trim());
          }}
          className="flex items-center gap-2"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Votre commentaire…"
            className="flex-1 rounded-full bg-muted px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={mut.isPending || !text.trim()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-white shadow-glow disabled:opacity-50"
            aria-label="Envoyer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <p className="text-xs text-muted-foreground">Connectez-vous pour commenter.</p>
      )}
    </div>
  );
}
