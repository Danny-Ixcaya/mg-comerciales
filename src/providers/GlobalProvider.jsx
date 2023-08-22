import { create } from 'zustand'

/* Estado global para la sidebar */
export const useStore = create((set) => ({
  // Estado inicial
  sidebar: true,
  // Función para cambiar el estado
  showSidebar: () => set((state) => ({ sidebar: !state.sidebar })),
}))

/* const [subNav, setSubNav] = useState(false)
  const showSubNav = () => setSubNav(!subNav) */
export const useSubItem = create((set) => ({
  subNav: false,
  showSubNav: () => set((state) => ({ subNav: !state.subNav })),
}))

export const useTitle = create((set) => ({
  title: '',
  setTitle: () => set((state) => ({title: state.title}))
}))

// Valor de cajaAbierta de localStorage
let condicional = localStorage.getItem('cajaAbierta')
export const useBoxisOpen = create((set) => ({
  // Estado inicial condicional
  // si condicional aún no tiene nada en localStorage, el estado inicia en false -> caja cerrada
  boxOpen: condicional === null || undefined ? false 
  // si ya hay valor en localStorage inicia en true
  : condicional === "true" ? true 
  : null,
  // Función para cambiar el estado
  setBoxOpen: (newState) => set(() => ({ boxOpen: newState }))
  // toggleBoxOpen: () => set((state) => ({boxOpen: !state.boxOpen}))
}))