import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

const useInternalStore = create(
    persist(
        (set, get) => ({
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
            addServer: (name, host, token, color, protocol) => set((state) => ({ servers: [...state.servers, { org_name: name, host: host, token: token, color: color, protocol: protocol }] })),
            removeServer: (server) => set((state) => ({
                servers: state.servers.filter(function (item) {
                    return (item.name+'-'+item.host !== server.name+'-'+server.host )
                })
            }))
        }),
        {
            name: 'server-storage'

        }
    ))

export default useInternalStore;