// src/types/index.ts

import {Position} from "reactflow";


export interface Stage {
    name: string;
    type: 'stage' | 'parallel';
    steps?: string[];
    branches?: Stage[];
}

export interface StageData {
    id: string;
    name: string;
    steps: string[];
    position: { x: number; y: number };
    data: {
        label: string;
        steps?: string[];
    };
    isParallelBranch?: boolean;
    branches?: StageData[];
    sourcePosition: Position;
    targetPosition: Position;
}
