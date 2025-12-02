"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DumbbellIcon } from "@/components/icons"
import { storage } from "@/lib/storage"
import type { Exercise, ExerciseCategory } from "@/lib/types"
import { categoryLabels, categoryDescriptions } from "@/lib/utils/category"

interface EditExerciseDialogProps {
  exercise: Exercise | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditExerciseDialog({ exercise, open, onOpenChange, onSuccess }: EditExerciseDialogProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState<ExerciseCategory>("weight-reps")
  const [photoUrl, setPhotoUrl] = useState("")
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (exercise) {
      setName(exercise.name)
      setCategory(exercise.category)
      setPhotoUrl(exercise.photoUrl || "")
    }
  }, [exercise])

  useEffect(() => {
    if (open && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
    }
  }, [open])

  const handleSave = () => {
    if (!name.trim() || !exercise) return

    storage.updateExercise(exercise.id, {
      name: name.trim(),
      category,
      photoUrl: photoUrl || undefined,
    })

    onSuccess()
    onOpenChange(false)
  }

  const categories: ExerciseCategory[] = ["weight-reps", "bodyweight-reps", "duration", "distance-duration"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar exercício</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center">
              {photoUrl ? (
                <img
                  src={photoUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <DumbbellIcon className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-photo-url">URL da foto (opcional)</Label>
            <Input
              id="edit-photo-url"
              placeholder="https://exemplo.com/foto.jpg"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-exercise-name">Nome do exercício</Label>
            <Input
              ref={nameInputRef}
              id="edit-exercise-name"
              placeholder="Ex: Supino reto"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Categoria do exercício</Label>
            <RadioGroup value={category} onValueChange={(value) => setCategory(value as ExerciseCategory)}>
              {categories.map((cat) => (
                <div key={cat} className="flex items-start space-x-3 space-y-0 p-3 rounded-lg border">
                  <RadioGroupItem value={cat} id={`edit-${cat}`} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={`edit-${cat}`} className="font-medium cursor-pointer">
                      {categoryLabels[cat]}
                    </Label>
                    <p className="text-sm text-muted-foreground">{categoryDescriptions[cat]}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="flex-1" onClick={handleSave} disabled={!name.trim()}>
              Salvar alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
