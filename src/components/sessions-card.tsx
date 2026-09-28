"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toFormError } from "@/lib/errors";
import { describeDevice, formatDateTime } from "@/lib/format";
import { Alert, Button, Card, Spinner } from "./ui";

interface Session {
  id: string;
  clientApp: string;
  deviceName: string | null;
  ip: string | null;
  userAgent: string | null;
  lastUsedAt: string;
  current: boolean;
}

// "Logged-in devices" (PRD §11.2): see active sessions and sign any of them out.
export function SessionsCard() {
  const { logoutAll } = useAuth();
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(
    () =>
      api<Session[]>("/auth/sessions")
        .then(setSessions)
        .catch((err) => setError(toFormError(err).message)),
    [],
  );

  useEffect(() => {
    let active = true;
    api<Session[]>("/auth/sessions")
      .then((result) => active && setSessions(result))
      .catch((err) => active && setError(toFormError(err).message));
    return () => {
      active = false;
    };
  }, []);

  async function revoke(id: string) {
    setBusy(id);
    try {
      await api(`/auth/sessions/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(toFormError(err).message);
    } finally {
      setBusy(null);
    }
  }

  async function signOutEverywhere() {
    setBusy("all");
    try {
      await logoutAll();
    } catch (err) {
      setError(toFormError(err).message);
      setBusy(null);
    }
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-stone-900">Logged-in devices</h2>
          <p className="mt-1 text-sm text-stone-600">Sign out anything you don&apos;t recognise.</p>
        </div>
        <Button variant="danger" onClick={signOutEverywhere} loading={busy === "all"}>
          Log out everywhere
        </Button>
      </div>
      {error && <div className="mt-4"><Alert>{error}</Alert></div>}
      {!sessions ? (
        <Spinner className="mt-6 size-5 text-brand-700" />
      ) : (
        <ul className="mt-4 divide-y divide-stone-100">
          {sessions.map((session) => (
            <li key={session.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-stone-900">
                  {describeDevice(session.deviceName, session.userAgent)}
                  {session.current && (
                    <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                      This device
                    </span>
                  )}
                </p>
                <p className="truncate text-sm text-stone-500">
                  Last active {formatDateTime(session.lastUsedAt)}
                  {session.ip ? ` · ${session.ip}` : ""}
                </p>
              </div>
              {!session.current && (
                <Button variant="secondary" onClick={() => revoke(session.id)} loading={busy === session.id}>
                  Log out
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
