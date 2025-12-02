export function setupKeyboardBehavior() {
  if (typeof window === "undefined") return

  // Fechar teclado ao tocar fora de inputs
  const handleClickOutside = (e: MouseEvent | TouchEvent) => {
    const target = e.target as HTMLElement

    // Verificar se o clique foi fora de um input/textarea
    if (
      target.tagName !== "INPUT" &&
      target.tagName !== "TEXTAREA" &&
      !target.closest("input") &&
      !target.closest("textarea")
    ) {
      // Remover foco do elemento ativo
      const activeElement = document.activeElement as HTMLElement
      if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
        activeElement.blur()
      }
    }
  }

  document.addEventListener("touchstart", handleClickOutside)
  document.addEventListener("mousedown", handleClickOutside)

  return () => {
    document.removeEventListener("touchstart", handleClickOutside)
    document.removeEventListener("mousedown", handleClickOutside)
  }
}

export function scrollInputIntoView(element: HTMLElement) {
  if (typeof window === "undefined") return

  setTimeout(() => {
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    })
  }, 300)
}
