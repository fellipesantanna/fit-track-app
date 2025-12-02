"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { exercisesApi } from "@/lib/exercises"
import { routinesApi } from "@/lib/routines"
import type { Exercise } from "@/lib/types"
import { ExerciseSelector } from "@/components/exercise-selector-broken"

interface CreateRoutineDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void // agora só notifica o parent para recarregar
}

export function CreateRoutineDialog({ open, onOpenChange, onSuccess }: CreateRoutineDialogProps) {
  const [name, setName] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selected, setSelected] = useState<
    { exercise: Exercise; suggestedSets?: number; suggestedReps?: number; advancedTechnique?: string }[]
  >([])
  const [showExerciseSelector, setShowExerciseSelector] = useState(false)
  const [loading, setLoading] = useState(false)

  // Carregar exercícios do Supabase
  useEffect(() => {
    if (!open) return

    async function load() {
      const all = await exercisesApi.getAll()
      setExercises(all)
    }
    load()
  }, [open])

  const handleAddExercise = (exercise: Exercise) => {
    if (selected.some((s) => s.exercise.id === exercise.id)) return
    setSelected([...selected, { exercise }])
    setShowExerciseSelector(false)
  }

  const handleRemove = (exerciseId: string) => {
    setSelected(selected.filter((s) => s.exercise.id !== exerciseId))
  }

  const handleSaveRoutine = async () => {
    if (!name.trim() || selected.length === 0) return

    try {
      setLoading(true)

      await routinesApi.create({
        name: name.trim(),
        exerciseIds: selected.map((s) => s.exercise.id),
        exerciseConfig: Object.fromEntries(
          selected.map((s, index) => [
            s.exercise.id,
            {
              suggestedSets: s.suggestedSets,
              suggestedReps: s.suggestedReps,
              advancedTechnique: s.advancedTechnique,
              order: index,
            },
          ]),
        ),
      })

      onSuccess()
      onOpenChange(false)
      setName("")
      setSelected([])
    } catch (err) {
      console.error("Erro ao criar rotina:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar rotina</DialogTitle>
        </DialogHeader>

        {/* Nome da rotina */}
        <div className="space-y-3">
          <Label>Nome da rotina</Label>
          <Input placeholder="Ex: Treino A - Peito" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {/* Lista de exercícios adicionados */}
        <div className="space-y-3 mt-4">
          <Label>Exercícios</Label>

          {selected.length === 0 && <p className="text-muted-foreground text-sm">Nenhum exercício adicionado ainda.</p>}

          {selected.map((s) => (
            <div key={s.exercise.id} className="p-3 border rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium">{s.exercise.name}</p>
                <p className="text-xs text-muted-foreground">{s.exercise.category}</p>
              </div>

              <Button variant="ghost" size="sm" onClick={() => handleRemove(s.exercise.id)}>
                Remover
              </Button>
            </div>
          ))}
        </div>

        {/* Botão adicionar exercício */}
        <Button variant="outline" className="w-full mt-4 bg-transparent" onClick={() => setShowExerciseSelector(true)}>
          Adicionar exercício
        </Button>

        {/* Botões */}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button
            className="flex-1"
            onClick={handleSaveRoutine}
            disabled={loading || !name.trim() || selected.length === 0}
          >
            {loading ? "Salvando..." : "Salvar rotina"}
          </Button>
        </div>

        {/* Selector modal */}
        <ExerciseSelector
          open={showExerciseSelector}
          onOpenChange={setShowExerciseSelector}
          onSelect={handleAddExercise}
        />
      </DialogContent>
    </Dialog>
  )
}
