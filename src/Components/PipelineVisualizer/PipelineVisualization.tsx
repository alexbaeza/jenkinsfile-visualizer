import React, { useState, useRef } from 'react';
import ReactFlow, {
    Node,
    Edge,
    ReactFlowProvider,
    Background,
    Controls,
    MiniMap,
} from 'reactflow';
import { toPng } from 'html-to-image'; // Import html-to-image

import 'reactflow/dist/style.css';
import './xy-theme.css';
import '@xyflow/react/dist/style.css';
import { StageData } from '../../types';
import { AnimatedSVGEdge } from "./Edges/AnimatedSVGEdge";
import CustomNode from "./Nodes/CustomNode";

interface PipelineViewProps {
    data: StageData[];
    edges: Edge[];
}

const edgeTypes = {
    animated: AnimatedSVGEdge,
};
const defaultEdgeOptions = {
    animated: true,
    type: 'smoothstep',
};
const nodeClassName = (node: any) => node.type;

const PipelineVisualization: React.FC<PipelineViewProps> = ({ data, edges }) => {
    const visualizationRef = useRef<HTMLDivElement>(null); // Ref for visualization container
    const nodes: Node[] = data.map((stage) => ({
        id: stage.id,
        type: 'customNode',
        data: { label: stage.name, steps: stage.steps },
        position: stage.position,
        sourcePosition: stage.sourcePosition || 'right',
        targetPosition: stage.targetPosition || 'left',
    }));

    const animatedEdges = edges.map((edge) => ({
        ...edge,
        type: 'smoothstep', // Use the custom edge type
    }));

    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    const onNodeClick = (_: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
    };

    const handleDownload = async () => {
        if (visualizationRef.current) {
            try {
                const pngDataUrl = await toPng(visualizationRef.current, {
                    backgroundColor: '#ffffff', // Set a background color
                    filter: (node) => {
                        // Exclude elements with the following class selectors
                        if (
                            node.classList &&
                            (node.classList.contains('react-flow__controls') ||
                                node.classList.contains('react-flow__attribution'))
                        ) {
                            return false; // Exclude these elements
                        }
                        return true; // Include all other elements
                    },
                });
                const link = document.createElement('a');
                link.href = pngDataUrl;
                link.download = 'pipeline-visualization.png';
                link.click();
            } catch (error) {
                console.error('Error generating PNG:', error);
            }
        }
    };

    return (
        <ReactFlowProvider>
            <div className="relative">
                {/* Download Button */}
                <button
                    onClick={handleDownload}
                    className="absolute top-2 right-2 z-10 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 shadow"
                >
                    Download PNG
                </button>

                {/* Visualization Container */}
                <div
                    ref={visualizationRef} // Attach ref here
                    className="h-[500px] border rounded shadow-md bg-white relative"
                >
                    <ReactFlow
                        nodes={nodes}
                        edges={animatedEdges}
                        onNodeClick={onNodeClick}
                        nodeTypes={{ customNode: CustomNode }}
                        edgeTypes={edgeTypes}
                        fitView
                        attributionPosition="bottom-left"
                        defaultEdgeOptions={defaultEdgeOptions}
                    >
                        <Background color="#aaa" gap={16} />
                        <MiniMap zoomable pannable nodeClassName={nodeClassName} />
                        <Controls />
                    </ReactFlow>
                </div>

                {selectedNode && (
                    <div className="absolute top-4 right-4 bg-gray-800 text-white p-4 rounded shadow-lg max-w-xs w-96">
                        <h2 className="text-xl font-bold mb-2">{selectedNode.data.label}</h2>
                        {selectedNode.data.steps && selectedNode.data.steps.length > 0 && (
                            <>
                                <h3 className="text-lg font-semibold">Steps:</h3>
                                <ul className="list-disc list-inside">
                                    {selectedNode.data.steps.map((step: string, idx: number) => (
                                        <li key={idx}>{step}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                        <button
                            className="mt-4 px-3 py-1 bg-red-500 rounded hover:bg-red-600"
                            onClick={() => setSelectedNode(null)}
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </ReactFlowProvider>
    );
};

export default PipelineVisualization;
