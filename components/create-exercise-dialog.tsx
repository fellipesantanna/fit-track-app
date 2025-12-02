"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { exercisesApi } from "@/lib/exercises"
import type { Exercise } from "@/lib/types"
import { categoryLabels } from "@/lib/utils/category"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (exercise: Exercise) => void
}

const CATEGORIES: Exercise["category"][] = [
  "weight-reps",
  "bodyweight-reps",
  "duration",
  "distance-duration",
]

export function CreateExerciseDialog({ open, onOpenChange, onSuccess }: Props) {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [category, setCategory] = useState<Exercise["category"] | "">("")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const reset = () => {
    setName("")
    setCategory("")
    setImageUrl("")
  }

  const handleClose = (value: boolean) => {
    if (!value) reset()
    onOpenChange(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !category) return

    try {
      setLoading(true)
      const created = await exercisesApi.create({
        name: name.trim(),
        category: category as Exercise["category"],
        imageUrl: imageUrl || undefined,
      })

      toast({
        title: "Exercício criado",
        description: "O exercício foi adicionado à sua lista.",
      })

      onSuccess?.(created)
      reset()
      onOpenChange(false)
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Erro ao criar exercício",
        description: error?.message ?? "Tente novamente em alguns instantes.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo exercício</DialogTitle>
          <DialogDescription>Cadastre um exercício para usar nas rotinas e sessões.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exercise-name">Nome</Label>
            <Input
              id="exercise-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Supino reto, Agachamento livre..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as Exercise["category"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de exercício" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {categoryLabels[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exercise-image">Imagem (opcional)</Label>
            <Input
              id="exercise-image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="URL de referência (se quiser)"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading || !name.trim() || !category}>
            {loading ? "Salvando..." : "Salvar exercício"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
