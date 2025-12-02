"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { sessionsApi } from "@/lib/api/session";
import { routinesApi } from "@/lib/api/routines";
import { Session } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [routinesCount, setRoutinesCount] = useState(0);

  // 🚀 Sessão limpa e sem loops
  useEffect(() => {
    let mounted = true;

    async function loadDashboard(userId: string) {
      try {
        setLoading(true);

        const [sessionsRes, routinesRes] = await Promise.all([
          sessionsApi.getAll(userId),
          routinesApi.getAll(userId),
        ]);

        if (!mounted) return;

        setSessions(sessionsRes);
        setRoutinesCount(routinesRes.length);
      } catch (err) {
        console.error("Erro no dashboard:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        // 🚫 Se não tem sessão → login (sem loop)
        if (!session) {
          router.replace("/auth/login");
          return;
        }

        // ✔ Sessão pronta → carrega dados
        await loadDashboard(session.user.id);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      {loading ? (
        <p>Carregando…</p>
      ) : (
        <div>
          <p>Total de rotinas: {routinesCount}</p>
          <p>Total de sessões: {sessions.length}</p>
        </div>
      )}
    </div>
  );
}
