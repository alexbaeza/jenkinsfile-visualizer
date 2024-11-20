// src/utils/flow.utils.ts

import { Node, Edge } from 'reactflow';
import { StageData } from '../types';

/**
 * Builds the flow nodes and edges from the transformed stage data.
 * @param data - The transformed stage data.
 * @param edges - The edges generated during transformation.
 * @returns An object containing nodes and edges for React Flow.
 */
export const buildFlow = (
    data: StageData[],
    edges: Edge[]
): { nodes: Node[]; edges: Edge[] } => {
    const nodes: Node[] = data.map((stage) => ({
        id: stage.id,
        type: 'customNode',
        data: { label: stage.name, steps: stage.steps },
        position: stage.position,
    }));

    return { nodes, edges };
};
