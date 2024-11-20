// src/utils/transform.utils.ts

import {Stage, StageData} from '../types';
import {Edge, MarkerType, Position} from 'reactflow';

const NODE_WIDTH = 150;         // Fixed width for nodes
const NODE_HEIGHT = 60;         // Fixed height for nodes
const HORIZONTAL_SPACING = 100; // Horizontal spacing between nodes
const VERTICAL_SPACING = 80;    // Vertical spacing between nodes in parallel

export const transformStagesToStageData = (
    stages: Stage[],
    x: number = 0,
    y: number = 0,
    processedStages: Set<string> = new Set()
): { transformed: StageData[]; nextX: number; edges: Edge[] } => {
    const result = processStages(stages, x, y, [], processedStages);
    return { transformed: result.transformed, nextX: result.nextX, edges: result.edges };
};

interface ProcessResult {
    transformed: StageData[];
    edges: Edge[];
    nextX: number;
    previousNodeIds: string[];
    minY: number;
    maxY: number;
}

function processStages(
    stages: Stage[],
    x: number,
    y: number,
    previousNodeIds: string[],
    processedStages: Set<string>
): ProcessResult {
    const transformed: StageData[] = [];
    const edges: Edge[] = [];
    let currentX = x;
    let currentY = y;
    let currentPreviousNodeIds = previousNodeIds;
    let minY = y;
    let maxY = y;

    for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];

        if (processedStages.has(stage.name)) {
            continue;
        }
        processedStages.add(stage.name);

        const id = `stage-${stage.name.replace(/\s+/g, '-')}`;

        if (stage.type === 'parallel' && stage.branches) {
            // Process parallel branches
            const branchTransformed: StageData[] = [];
            const branchEdges: Edge[] = [];
            const branchIds: string[] = [];
            let branchY = currentY;
            let maxNextX = currentX;
            let branchMinY = branchY;
            let branchMaxY = branchY;

            // Process each branch recursively
            for (const branch of stage.branches) {
                const branchResult = processStages(
                    [branch],
                    currentX,
                    branchY,
                    currentPreviousNodeIds,
                    processedStages
                );

                branchTransformed.push(...branchResult.transformed);
                branchEdges.push(...branchResult.edges);
                branchIds.push(...branchResult.previousNodeIds);

                if (branchResult.nextX > maxNextX) {
                    maxNextX = branchResult.nextX;
                }

                branchY = branchResult.maxY + VERTICAL_SPACING; // Position next branch below the current one

                // Update branch minY and maxY
                if (branchResult.minY < branchMinY) {
                    branchMinY = branchResult.minY;
                }
                if (branchResult.maxY > branchMaxY) {
                    branchMaxY = branchResult.maxY;
                }
            }

            transformed.push(...branchTransformed);
            edges.push(...branchEdges);

            // After processing branches, set previousNodeIds to branchIds
            currentPreviousNodeIds = branchIds;
            currentX = maxNextX; // Update currentX to the farthest x among branches
            minY = Math.min(minY, branchMinY);
            maxY = Math.max(maxY, branchMaxY);
        } else {
            // Position of the current node
            const position = { x: currentX, y: currentY };
            const stageData: StageData = {
                id,
                name: stage.name,
                steps: stage.steps || [],
                position,
                data: { label: stage.name, steps: stage.steps },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
            };
            transformed.push(stageData);

            // Edges from previous nodes to current node
            currentPreviousNodeIds.forEach((prevId) => {
                edges.push({
                    id: `e-${prevId}-${id}`,
                    source: prevId,
                    target: id,
                    type: 'smoothstep',
                    style: { stroke: '#b1b1b7', strokeWidth: 2 },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: '#b1b1b7',
                    },
                });
            });

            // Update previousNodeIds to current node id
            currentPreviousNodeIds = [id];

            // Update minY and maxY
            minY = Math.min(minY, currentY);
            maxY = Math.max(maxY, currentY + NODE_HEIGHT);

            // Increment x for next sequential node
            currentX += NODE_WIDTH + HORIZONTAL_SPACING;
        }
    }

    return {
        transformed,
        edges,
        nextX: currentX,
        previousNodeIds: currentPreviousNodeIds,
        minY,
        maxY,
    };
}
