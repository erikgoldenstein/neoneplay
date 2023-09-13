import { useCallback, useEffect } from 'react';
import { useStore, getBezierPath, EdgeLabelRenderer } from 'reactflow';
import { getEdgeParams } from './utils.js';


// Credit: Taken from React Flow example: 
// https://reactflow.dev/docs/examples/edges/floating-edges/

function FloatingEdge({ id, source, target, markerEnd, style, label }) {
    const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
    const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

    if (!sourceNode || !targetNode) {
        return null;
    }

    const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX: sx,
        sourceY: sy,
        sourcePosition: sourcePos,
        targetPosition: targetPos,
        targetX: tx,
        targetY: ty,
    });

    return (
        <>
            <path
                id={id}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
                style={{ ...style, strokeWidth: 3 }}
            />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` 
                    }}
                    className="nodrag nopan
                    p-1 bg-slate-200/50 rounded-md text-bold text-xs"
                >
                    {label}
                </div>
            </EdgeLabelRenderer>
        </>
    );
}

export default FloatingEdge;
