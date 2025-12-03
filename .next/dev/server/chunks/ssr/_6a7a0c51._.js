module.exports = [
"[project]/lib/supabase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSupabaseBrowserClient",
    ()=>createSupabaseBrowserClient,
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-ssr] (ecmascript)");
"use client";
;
function createSupabaseBrowserClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://axreigchbfreakpofgxr.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4cmVpZ2NoYmZyZWFrcG9mZ3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTIyODcsImV4cCI6MjA4MDE4ODI4N30.bdtlEaPVyFwa6FkGgv6TG8SxUTZgD6VpdwrEmv6lW-Q"));
}
const supabase = createSupabaseBrowserClient();
}),
"[project]/lib/mappers/routine.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapDbRoutine",
    ()=>mapDbRoutine,
    "toDbRoutinePayload",
    ()=>toDbRoutinePayload
]);
function mapDbRoutine(db) {
    return {
        id: db.id,
        name: db.name,
        createdAt: db.created_at,
        userId: db.user_id,
        exercises: (db.routine_exercises ?? []).map((ex)=>({
                id: ex.id,
                exerciseId: ex.exercise_id,
                position: ex.position,
                suggestedSets: ex.suggested_sets ?? null,
                suggestedReps: ex.suggested_reps ?? null,
                advancedTechnique: ex.advanced_technique ?? ""
            }))
    };
}
function mapDbRoutineExercise(row) {
    return {
        id: row.id,
        exerciseId: row.exercise_id,
        position: row.position ?? 0,
        suggestedSets: row.suggested_sets ?? null,
        suggestedReps: row.suggested_reps ?? null,
        advancedTechnique: row.advanced_technique ?? ""
    };
}
function toDbRoutinePayload(routine) {
    return {
        name: routine.name,
        user_id: routine.userId,
        exercises: routine.exercises.map((e)=>({
                exercise_id: e.exerciseId,
                position: e.position,
                suggested_sets: e.suggestedSets ?? null,
                suggested_reps: e.suggestedReps ?? null,
                advanced_technique: e.advancedTechnique ?? ""
            }))
    };
}
}),
"[project]/lib/api/routines.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "routinesApi",
    ()=>routinesApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mappers$2f$routine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mappers/routine.ts [app-ssr] (ecmascript)");
;
;
/* ============================================================
   HELPERS
============================================================ */ function toDbRoutinePayload(routine, userId) {
    return {
        name: routine.name,
        user_id: userId,
        exercises: routine.exercises.map((e)=>({
                exercise_id: e.exerciseId,
                position: e.position,
                suggested_sets: e.suggestedSets ?? null,
                suggested_reps: e.suggestedReps ?? null,
                advanced_technique: e.advancedTechnique ?? ""
            }))
    };
}
const routinesApi = {
    /* ---------- GET ALL ---------- */ async getAll () {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("routines").select(`
        id,
        name,
        created_at,
        user_id,
        routine_exercises (
          id,
          exercise_id,
          position,
          suggested_sets,
          suggested_reps,
          advanced_technique
        )
      `).order("created_at", {
            ascending: false
        });
        if (error) throw error;
        return data.map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mappers$2f$routine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapDbRoutine"]);
    },
    /* ---------- GET BY ID ---------- */ async getById (id) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("routines").select(`
        id,
        name,
        created_at,
        user_id,
        routine_exercises (
          id,
          exercise_id,
          position,
          suggested_sets,
          suggested_reps,
          advanced_technique
        )
      `).eq("id", id).single();
        if (error) throw error;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mappers$2f$routine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapDbRoutine"])(data);
    },
    /* ---------- CREATE ---------- */ async create (input) {
        // 1) Criar rotina
        const { data: routine, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("routines").insert({
            name: input.name,
            user_id: input.userId
        }).select("*").single();
        if (error) throw error;
        // 2) Criar exercícios da rotina
        if (input.exercises.length > 0) {
            const exercisePayload = input.exercises.map((e)=>({
                    routine_id: routine.id,
                    exercise_id: e.exerciseId,
                    position: e.position,
                    suggested_sets: e.suggestedSets ?? null,
                    suggested_reps: e.suggestedReps ?? null,
                    advanced_technique: e.advancedTechnique ?? ""
                }));
            const { error: exError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("routine_exercises").insert(exercisePayload);
            if (exError) throw exError;
        }
        return routinesApi.getById(routine.id);
    },
    /* ---------- UPDATE (FINAL) ---------- */ async update (id, input) {
        // Garantir usuário autenticado
        const { data: auth } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        const userId = auth?.user?.id;
        if (!userId) throw new Error("Usuário não autenticado");
        const payload = toDbRoutinePayload(input, userId);
        // 1) Atualizar nome da rotina
        const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("routines").update({
            name: payload.name,
            user_id: userId
        }).eq("id", id);
        if (updateError) throw updateError;
        // 2) Apagar exercícios antigos
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("routine_exercises").delete().eq("routine_id", id);
        // 3) Recriar exercícios atualizados
        const newItems = payload.exercises.map((e)=>({
                routine_id: id,
                exercise_id: e.exercise_id ?? e.exerciseId,
                position: e.position,
                suggested_sets: e.suggested_sets ?? e.suggestedSets ?? null,
                suggested_reps: e.suggested_reps ?? e.suggestedReps ?? null,
                advanced_technique: e.advanced_technique ?? e.advancedTechnique ?? ""
            }));
        const { error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("routine_exercises").insert(newItems);
        if (insertError) throw insertError;
        // 4) Retornar rotina final
        return await routinesApi.getById(id);
    },
    /* ---------- DELETE ---------- */ async delete (id) {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("routines").delete().eq("id", id);
        if (error) throw error;
        return true;
    }
};
}),
"[project]/lib/mappers/session.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/mappers/session.ts
__turbopack_context__.s([
    "mapDbSession",
    ()=>mapDbSession
]);
function mapDbSession(db) {
    return {
        id: db.id,
        routineId: db.routine_id,
        routineName: db.routine_name ?? "",
        startedAt: db.started_at ? new Date(db.started_at) : new Date(),
        finishedAt: db.finished_at ? new Date(db.finished_at) : new Date(),
        exercises: (db.session_exercises ?? []).map((ex)=>({
                id: ex.id,
                exerciseId: ex.exercise_id,
                exerciseName: ex.exercise_name ?? "Exercício",
                category: ex.category ?? "weight-reps",
                position: ex.position ?? 0,
                sets: (ex.sets ?? []).map((s)=>({
                        id: s.id,
                        setIndex: s.set_index,
                        reps: s.reps ?? null,
                        weightKg: s.weight_kg ?? null,
                        durationSec: s.duration_sec ?? null,
                        distanceM: s.distance_m ?? null
                    }))
            }))
    };
}
}),
"[project]/lib/api/session.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sessionsApi",
    ()=>sessionsApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mappers$2f$session$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mappers/session.ts [app-ssr] (ecmascript)");
;
;
const sessionsApi = {
    async getAll () {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("sessions").select(`
        id,
        routine_id,
        routine_name,
        started_at,
        finished_at,
        session_exercises (
          id,
          exercise_id,
          exercise_name,
          category,
          sets (
            id,
            set_index,
            reps,
            weight_kg,
            duration_sec,
            distance_m
          )
        )
      `).order("started_at", {
            ascending: false
        });
        if (error) throw error;
        return data.map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mappers$2f$session$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapDbSession"]);
    },
    async getById (id) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("sessions").select(`
        id,
        routine_id,
        routine_name,
        started_at,
        finished_at,
        session_exercises (
          id,
          exercise_id,
          exercise_name,
          category,
          sets (
            id,
            set_index,
            reps,
            weight_kg,
            duration_sec,
            distance_m
          )
        )
      `).eq("id", id).single();
        if (error) throw error;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mappers$2f$session$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapDbSession"])(data);
    },
    async create (input) {
        const { data: userData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        const userId = userData?.user?.id;
        if (!userId) throw new Error("Usuário não autenticado");
        // 1) Criar sessão
        const { data: session, error: err1 } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("sessions").insert({
            user_id: userId,
            routine_id: input.routineId,
            started_at: input.startedAt,
            finished_at: input.finishedAt
        }).select("*").single();
        if (err1) throw err1;
        // 2) Criar exercícios da sessão
        for (const ex of input.exercises){
            const { data: dbEx, error: err2 } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("session_exercises").insert({
                session_id: session.id,
                exercise_id: ex.exerciseId,
                category: ex.category
            }).select("*").single();
            if (err2) throw err2;
            // 3) Criar sets
            if (ex.sets.length > 0) {
                const setsPayload = ex.sets.map((s, i)=>({
                        session_exercise_id: dbEx.id,
                        set_index: i,
                        reps: s.reps ?? null,
                        weight_kg: s.weightKg ?? null,
                        duration_sec: s.durationSec ?? null,
                        distance_m: s.distanceM ?? null
                    }));
                const { error: err3 } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("sets").insert(setsPayload);
                if (err3) throw err3;
            }
        }
        return this.getById(session.id);
    }
};
}),
"[project]/components/ui/button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
            link: 'text-primary underline-offset-4 hover:underline'
        },
        size: {
            default: 'h-9 px-4 py-2 has-[>svg]:px-3',
            sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
            lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
            icon: 'size-9',
            'icon-sm': 'size-8',
            'icon-lg': 'size-10'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/app/sessao/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SessionPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$routines$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/routines.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$session$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/session.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
"use client";
;
;
;
;
;
;
;
function SessionPage() {
    const search = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const routineId = search.get("routine");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [routine, setRoutine] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [startedAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Date());
    const [sets, setSets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]) // cada exercício terá sets registrados
    ;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function load() {
            if (!routineId) return;
            const r = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$routines$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["routinesApi"].getById(routineId);
            setRoutine(r);
            setSets(r.exercises.map((ex)=>({
                    exerciseId: ex.exerciseId,
                    category: ex.category,
                    sets: []
                })));
            setLoading(false);
        }
        load();
    }, []);
    async function finalizarTreino() {
        if (!routine) {
            alert("Rotina não carregada.");
            return;
        }
        setSaving(true);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$session$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sessionsApi"].create({
                routineId: routineId,
                routineName: routine.name,
                startedAt: new Date(sessionStartTimestamp),
                finishedAt: new Date(),
                exercises: sessionExercises.map((se)=>({
                        exerciseId: se.exerciseId,
                        category: se.category,
                        position: se.position,
                        sets: se.sets.map((s, idx)=>({
                                setIndex: idx,
                                reps: s.reps ?? null,
                                weightKg: s.weightKg ?? null,
                                durationSec: s.durationSec ?? null,
                                distanceM: s.distanceM ?? null
                            }))
                    }))
            });
            router.push("/historico");
        } catch (err) {
            console.error(err);
            alert("Erro ao salvar sessão.");
        } finally{
            setSaving(false);
        }
    }
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center items-center min-h-[70vh]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                className: "w-8 h-8 animate-spin"
            }, void 0, false, {
                fileName: "[project]/app/sessao/page.tsx",
                lineNumber: 83,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/sessao/page.tsx",
            lineNumber: 82,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 max-w-3xl mx-auto flex flex-col gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold",
                children: routine.name
            }, void 0, false, {
                fileName: "[project]/app/sessao/page.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this),
            routine.exercises.map((ex, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg border p-4 bg-card",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "font-semibold",
                            children: ex.name
                        }, void 0, false, {
                            fileName: "[project]/app/sessao/page.tsx",
                            lineNumber: 94,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: ()=>{
                                const next = [
                                    ...sets
                                ];
                                next[idx].sets.push({
                                    id: crypto.randomUUID(),
                                    reps: 10
                                });
                                setSets(next);
                            },
                            className: "mt-3",
                            children: "+ Registrar set"
                        }, void 0, false, {
                            fileName: "[project]/app/sessao/page.tsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-3 flex flex-col gap-2",
                            children: sets[idx].sets.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border rounded-md p-2 flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                "Set ",
                                                i + 1
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/sessao/page.tsx",
                                            lineNumber: 110,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "10 reps"
                                        }, void 0, false, {
                                            fileName: "[project]/app/sessao/page.tsx",
                                            lineNumber: 111,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, s.id, true, {
                                    fileName: "[project]/app/sessao/page.tsx",
                                    lineNumber: 109,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/sessao/page.tsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, this)
                    ]
                }, ex.id, true, {
                    fileName: "[project]/app/sessao/page.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                className: "bg-green-600 hover:bg-green-700 mt-6",
                onClick: finalizarTreino,
                children: "Finalizar treino"
            }, void 0, false, {
                fileName: "[project]/app/sessao/page.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/sessao/page.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_6a7a0c51._.js.map