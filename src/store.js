import { create } from "zustand";

const useInternalStore = create((set, get) => ({
    // data
    addNodeFlag: false,
    darkMode: false,
    searchbarValue: "",
    servers: [],

    // Searchbar
    setSearchbarValue: (val) => set((state) => ({ searchbarValue: val })),
    resetSearchbarValue: () => set((state) => ({ searchbarValue: "" })),

    setAddNodeFlag: (flagBool) => set((state) => ({ addNodeFlag: flagBool })),
    switchTheme: () => set((state) => ({ darkMode: !state.darkMode })),

    // source managment
    cleanServer: () => set(() => ({ servers: [] })),
    addServer: (name, host, token, color) => set((state) => ({ servers: [...state.servers, { org_name: name, host: host, token: token, color: color }] })),
    removeServer: (index) => set((state) => ({ servers: state.servers.splice(index, 1) }))
}))

export default useInternalStore;