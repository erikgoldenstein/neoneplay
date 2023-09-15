import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls, Background, useReactFlow, Connection, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import LOCard from './LOCard';
import useRFStore from '@/storeRF';
import useInternalStore from '@/store';
import FloatingEdge from './Edge/FloatingEdge';
import FloatingConnectionLine from './Edge/FloatingConnectionLine';
import EventPanel from './Events/EventPanel';


const Canvas = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const reactFlowInstance = useReactFlow();
    const rfCanvasRef = useRef(0)
    const { setAddNodeFlag, addNodeFlag, resetSearchbarValue, searchbarValue } = useInternalStore()

    const nodeTypes = useMemo(() => ({ LO: LOCard }), []);
    const edgeTypes = useMemo(() => ({ floating: FloatingEdge }), [])

    const onPaneClick = (event) => {
        if (addNodeFlag) {
            setAddNodeFlag(false)
            const bounds = rfCanvasRef.current.getBoundingClientRect();
            const position = reactFlowInstance.project({
                x: event.clientX - bounds.left,
                y: event.clientY - bounds.top
            })
            setNodes(nds => nds.concat({
                id: searchbarValue,
                type: 'LO',
                dragHandle: '#node-header',
                data: {
                    uri: searchbarValue,
                },
                position: position,
            }
            ))
            resetSearchbarValue();
        }
    }


    return (
        <div className="absolute left-0 top-0 w-full h-full z-0 "
            style={{ flexDirection: "column", display: "flex", flexGrow: 1, height: "100%" }}>
            <ReactFlow className='dark:bg-slate-600 transition-color duration-300 '
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                connectionLineComponent={FloatingConnectionLine}
                minZoom={0.25}
                onPaneClick={onPaneClick}
                ref={rfCanvasRef}
                style={{ cursor: (addNodeFlag ? "cell" : "") }}
            >
                <MiniMap />
                <Controls />

                <Background color='black' variant='dots' />
            </ReactFlow>
            <EventPanel
                selectedObject=''
            />
        </div>
    );
};

export default Canvas;
