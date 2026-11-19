// Shared handle so any component can scroll through Lenis instead of fighting it.
let instance = null

export const setLenis = (l) => {
  instance = l
}

export function scrollToTop() {
  if (instance) instance.scrollTo(0, { duration: 1.4 })
  else window.scrollTo({ top: 0 })
}
