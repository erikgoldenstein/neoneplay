import { useCallback, useEffect } from 'react';
import { useStore, getBezierPath, EdgeText } from 'reactflow';
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
            <EdgeText
                x={labelX}
                y={((sx > tx) ? labelY + 15 : labelY - 15)}
                label={label}
                labelBgPadding= {[8, 4]}
                labelBgBorderRadius = {4}
                labelBgStyle = {{ fill: '#A9A9A9', color: '#fff', fillOpacity: 0.4 }}
            />
        </>
    );
}

export default FloatingEdge;
