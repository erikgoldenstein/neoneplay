// import { useCallback } from 'react';
import { create } from 'zustand';
import {
    Connection,
    setEdges,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    applyNodeChanges,
    applyEdgeChanges,
} from 'reactflow';

// import initialNodes from './nodes';
// import initialEdges from './edges';

const initialNodes = [
    // { id: 'https://api.one-record.de/logistics-objects/57d0664e-50b3-4060-b8d5-1d3ba383a8d3', type: 'LO', dragHandle: '#node-header', data: { uri: 'https://api.one-record.de/logistics-objects/57d0664e-50b3-4060-b8d5-1d3ba383a8d3' }, position: { x: 500, y: 500 } },
];

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useRFStore = create((set, get) => ({
    nodes: initialNodes,
    edges: [],

    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes)
        });
    },
    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges)
        });
    },

    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },


    addEdge: (edge) => {
        let exists = false;
        for (let index in get().edges) {
            // console.log("current:", get().edges[index].id, "id is equal:", (get().edges[index].id == edge.id))
            if (get().edges[index].id == edge.id) {
                exists = true
            }
        }
        if (!exists) {
            set({
                edges: [...get().edges, edge]
            });
        }
    }


}));

export default useRFStore;