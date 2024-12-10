import { create } from "zustand";

const useNavbarStore = create( set => ({
    title: 'Dashboard',
    setTitle: (title) => set( () => ({ title })),
}))

export default useNavbarStore