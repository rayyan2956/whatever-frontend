"use client";

import { useRef, useState, type ChangeEvent } from "react";
import type { User } from "@/api/types";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toFormError } from "@/lib/errors";
import { checkImage, IMAGE_TYPES, uploadFile } from "@/lib/upload";
import { Alert, Avatar, Button } from "./ui";

// Profile photo: picked, uploaded straight to storage, then saved on the profile.
export function AvatarEditor({ user }: { user: User }) {
  const { setUser } = useAuth();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"upload" | "remove" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onPick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const problem = checkImage(file);
    if (problem) {
      setError(problem);
      return;
    }
    setBusy("upload");
    setError(null);
    try {
      const avatarKey = await uploadFile("AVATAR", file);
      setUser(await api<User>("/me", { method: "PATCH", body: { avatarKey } }));
    } catch (err) {
      setError(toFormError(err).message);
    } finally {
      setBusy(null);
    }
  }

  async function onRemove() {
    setBusy("remove");
    setError(null);
    try {
      setUser(await api<User>("/me", { method: "PATCH", body: { avatarKey: null } }));
    } catch (err) {
      setError(toFormError(err).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <Avatar name={user.name} src={user.avatarUrl} className="size-16 text-xl" />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            loading={busy === "upload"}
            disabled={busy !== null}
            onClick={() => input.current?.click()}
          >
            {user.avatarUrl ? "Change photo" : "Add photo"}
          </Button>
          {user.avatarUrl && (
            <Button type="button" variant="ghost" loading={busy === "remove"} disabled={busy !== null} onClick={onRemove}>
              Remove
            </Button>
          )}
        </div>
        <input
          ref={input}
          type="file"
          accept={IMAGE_TYPES.join(",")}
          className="sr-only"
          tabIndex={-1}
          aria-label="Choose a profile photo"
          onChange={onPick}
        />
      </div>
      <p className="text-sm text-stone-500">JPG, PNG or WebP, up to 10 MB.</p>
      {error && <Alert>{error}</Alert>}
    </div>
  );
}
