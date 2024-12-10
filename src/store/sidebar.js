import { create } from "zustand";

const useSidebarStore = create( set => ({
    collapse: false,
    toggle: () => set( state => ({ collapse: !state.collapse })),
}))

export default useSidebarStore