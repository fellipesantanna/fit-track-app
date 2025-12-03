(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/supabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSupabaseBrowserClient",
    ()=>createSupabaseBrowserClient,
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
"use client";
;
function createSupabaseBrowserClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://axreigchbfreakpofgxr.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4cmVpZ2NoYmZyZWFrcG9mZ3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTIyODcsImV4cCI6MjA4MDE4ODI4N30.bdtlEaPVyFwa6FkGgv6TG8SxUTZgD6VpdwrEmv6lW-Q"));
}
const supabase = createSupabaseBrowserClient();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/mappers/routine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api/routines.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "routinesApi",
    ()=>routinesApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mappers$2f$routine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mappers/routine.ts [app-client] (ecmascript)");
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
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("routines").select(`
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
        return data.map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mappers$2f$routine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapDbRoutine"]);
    },
    /* ---------- GET BY ID ---------- */ async getById (id) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("routines").select(`
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mappers$2f$routine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapDbRoutine"])(data);
    },
    /* ---------- CREATE ---------- */ async create (input) {
        // 1) Criar rotina
        const { data: routine, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("routines").insert({
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
            const { error: exError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("routine_exercises").insert(exercisePayload);
            if (exError) throw exError;
        }
        return routinesApi.getById(routine.id);
    },
    /* ---------- UPDATE (FINAL) ---------- */ async update (id, input) {
        // Garantir usuário autenticado
        const { data: auth } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        const userId = auth?.user?.id;
        if (!userId) throw new Error("Usuário não autenticado");
        const payload = toDbRoutinePayload(input, userId);
        // 1) Atualizar nome da rotina
        const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("routines").update({
            name: payload.name,
            user_id: userId
        }).eq("id", id);
        if (updateError) throw updateError;
        // 2) Apagar exercícios antigos
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("routine_exercises").delete().eq("routine_id", id);
        // 3) Recriar exercícios atualizados
        const newItems = payload.exercises.map((e)=>({
                routine_id: id,
                exercise_id: e.exercise_id ?? e.exerciseId,
                position: e.position,
                suggested_sets: e.suggested_sets ?? e.suggestedSets ?? null,
                suggested_reps: e.suggested_reps ?? e.suggestedReps ?? null,
                advanced_technique: e.advanced_technique ?? e.advancedTechnique ?? ""
            }));
        const { error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("routine_exercises").insert(newItems);
        if (insertError) throw insertError;
        // 4) Retornar rotina final
        return await routinesApi.getById(id);
    },
    /* ---------- DELETE ---------- */ async delete (id) {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("routines").delete().eq("id", id);
        if (error) throw error;
        return true;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/mappers/session.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api/session.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sessionsApi",
    ()=>sessionsApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mappers$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mappers/session.ts [app-client] (ecmascript)");
;
;
const sessionsApi = {
    async getAll () {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("sessions").select(`
        id,
        routine_id,
        started_at,
        finished_at,
        session_exercises (
          id,
          exercise_id,
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
        return data.map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mappers$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapDbSession"]);
    },
    async getById (id) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("sessions").select(`
        id,
        routine_id,
        started_at,
        finished_at,
        session_exercises (
          id,
          exercise_id,
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mappers$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapDbSession"])(data);
    },
    async create (input) {
        const { data: userData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        const userId = userData?.user?.id;
        if (!userId) throw new Error("Usuário não autenticado");
        // 1) Criar sessão
        const { data: session, error: err1 } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("sessions").insert({
            user_id: userId,
            routine_id: input.routineId,
            started_at: input.startedAt,
            finished_at: input.finishedAt
        }).select("*").single();
        if (err1) throw err1;
        // 2) Criar exercícios da sessão
        for (const ex of input.exercises){
            const { data: dbEx, error: err2 } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("session_exercises").insert({
                session_id: session.id,
                exercise_id: ex.exerciseId
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
                const { error: err3 } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("sets").insert(setsPayload);
                if (err3) throw err3;
            }
        }
        return this.getById(session.id);
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/mappers/exercise.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapDbExercise",
    ()=>mapDbExercise,
    "toDbExercisePayload",
    ()=>toDbExercisePayload
]);
function mapDbExercise(row) {
    return {
        id: row.id,
        name: row.name,
        category: row.category,
        createdAt: new Date(row.created_at),
        userId: row.user_id,
        suggestedReps: row.suggested_reps,
        suggestedWeight: row.suggested_weight,
        suggestedTime: row.suggested_time,
        suggestedDistance: row.suggested_distance
    };
}
function toDbExercisePayload(ex) {
    return {
        name: ex.name,
        category: ex.category,
        user_id: ex.userId,
        suggested_reps: ex.suggestedReps ?? null,
        suggested_weight: ex.suggestedWeight ?? null,
        suggested_time: ex.suggestedTime ?? null,
        suggested_distance: ex.suggestedDistance ?? null
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api/exercise.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "exercisesApi",
    ()=>exercisesApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mappers$2f$exercise$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mappers/exercise.ts [app-client] (ecmascript)");
;
;
const exercisesApi = {
    async getAll () {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("exercises").select("*").order("name", {
            ascending: true
        });
        if (error) throw error;
        return data.map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mappers$2f$exercise$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapDbExercise"]);
    },
    async getById (id) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("exercises").select("*").eq("id", id).single();
        if (error) throw error;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mappers$2f$exercise$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapDbExercise"])(data);
    },
    async create (dto, userId) {
        const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mappers$2f$exercise$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toDbExercisePayload"])({
            ...dto,
            userId
        });
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("exercises").insert(payload).select().single();
        if (error) throw error;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mappers$2f$exercise$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapDbExercise"])(data);
    },
    async delete (id) {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("exercises").delete().eq("id", id);
        if (error) throw error;
        return true;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
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
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
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
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/sessao/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SessionPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$routines$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/routines.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/session.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$exercise$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/exercise.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function SessionPage() {
    _s();
    const search = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const routineId = search.get("routine");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [routine, setRoutine] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sets, setSets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // momento que o treino começou
    const [startedAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "SessionPage.useState": ()=>new Date()
    }["SessionPage.useState"]);
    // exercícios desta sessão (com sets sendo preenchidos pelo usuário)
    const [sessionExercises, setSessionExercises] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // =========================================================
    // Carregar rotina + exercícios
    // =========================================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SessionPage.useEffect": ()=>{
            async function load() {
                if (!routineId) {
                    router.push("/rotinas");
                    return;
                }
                setLoading(true);
                try {
                    const [r, allExercises] = await Promise.all([
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$routines$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["routinesApi"].getById(routineId),
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$exercise$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["exercisesApi"].getAll()
                    ]);
                    setRoutine(r);
                    const prepared = r.exercises.map({
                        "SessionPage.useEffect.load.prepared": (re, idx)=>{
                            const ex = allExercises.find({
                                "SessionPage.useEffect.load.prepared.ex": (e)=>e.id === re.exerciseId
                            }["SessionPage.useEffect.load.prepared.ex"]);
                            return {
                                exerciseId: re.exerciseId,
                                name: ex?.name ?? "Exercício",
                                category: ex?.category ?? "peso_reps",
                                position: re.position ?? idx,
                                sets: []
                            };
                        }
                    }["SessionPage.useEffect.load.prepared"]);
                    setSessionExercises(prepared);
                } finally{
                    setLoading(false);
                }
            }
            load();
        }
    }["SessionPage.useEffect"], [
        routineId,
        router
    ]);
    // =========================================================
    // Adicionar um set simples (por enquanto só reps)
    // =========================================================
    function addSet(exerciseIndex) {
        setSessionExercises((prev)=>{
            const next = [
                ...prev
            ];
            const ex = next[exerciseIndex];
            ex.sets.push({
                id: crypto.randomUUID(),
                reps: 10,
                weightKg: null,
                durationSec: null,
                distanceM: null
            });
            return next;
        });
    }
    // =========================================================
    // Finalizar treino
    // =========================================================
    async function finalizarTreino() {
        if (!routine) {
            alert("Rotina não carregada.");
            return;
        }
        setSaving(true);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sessionsApi"].create({
                routineId: routineId,
                startedAt: startedAt,
                finishedAt: new Date(),
                exercises: sets.map((ex)=>({
                        exerciseId: ex.exerciseId,
                        category: ex.category,
                        sets: ex.sets.map((s)=>({
                                id: s.id ?? crypto.randomUUID(),
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
    // =========================================================
    // UI
    // =========================================================
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center items-center min-h-[70vh]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                className: "w-8 h-8 animate-spin"
            }, void 0, false, {
                fileName: "[project]/app/sessao/page.tsx",
                lineNumber: 149,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/sessao/page.tsx",
            lineNumber: 148,
            columnNumber: 7
        }, this);
    }
    if (!routine) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6",
            children: "Rotina não encontrada."
        }, void 0, false, {
            fileName: "[project]/app/sessao/page.tsx",
            lineNumber: 155,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 max-w-3xl mx-auto flex flex-col gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold",
                children: routine.name
            }, void 0, false, {
                fileName: "[project]/app/sessao/page.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, this),
            sessionExercises.map((ex, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg border p-4 bg-card",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "font-semibold",
                            children: ex.name
                        }, void 0, false, {
                            fileName: "[project]/app/sessao/page.tsx",
                            lineNumber: 164,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-muted-foreground mb-1",
                            children: [
                                "Categoria: ",
                                ex.category
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/sessao/page.tsx",
                            lineNumber: 165,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: ()=>addSet(idx),
                            className: "mt-3",
                            variant: "outline",
                            children: "+ Registrar set"
                        }, void 0, false, {
                            fileName: "[project]/app/sessao/page.tsx",
                            lineNumber: 169,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-3 flex flex-col gap-2",
                            children: [
                                ex.sets.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border rounded-md p-2 flex justify-between text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "Set ",
                                                    i + 1
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/sessao/page.tsx",
                                                lineNumber: 183,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    s.reps,
                                                    " reps"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/sessao/page.tsx",
                                                lineNumber: 184,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, s.id, true, {
                                        fileName: "[project]/app/sessao/page.tsx",
                                        lineNumber: 179,
                                        columnNumber: 15
                                    }, this)),
                                ex.sets.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-muted-foreground",
                                    children: "Nenhum set registrado ainda."
                                }, void 0, false, {
                                    fileName: "[project]/app/sessao/page.tsx",
                                    lineNumber: 189,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/sessao/page.tsx",
                            lineNumber: 177,
                            columnNumber: 11
                        }, this)
                    ]
                }, ex.exerciseId, true, {
                    fileName: "[project]/app/sessao/page.tsx",
                    lineNumber: 163,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                className: "bg-green-600 hover:bg-green-700 mt-6",
                onClick: finalizarTreino,
                disabled: saving,
                children: saving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            className: "w-4 h-4 animate-spin mr-2"
                        }, void 0, false, {
                            fileName: "[project]/app/sessao/page.tsx",
                            lineNumber: 204,
                            columnNumber: 13
                        }, this),
                        "Salvando treino..."
                    ]
                }, void 0, true) : "Finalizar treino"
            }, void 0, false, {
                fileName: "[project]/app/sessao/page.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/sessao/page.tsx",
        lineNumber: 159,
        columnNumber: 5
    }, this);
}
_s(SessionPage, "otcVEzANGvPSkPzM5Eu98VKTYpg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = SessionPage;
var _c;
__turbopack_context__.k.register(_c, "SessionPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_45c425e9._.js.map