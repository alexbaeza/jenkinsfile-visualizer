// src/Views/PipelineView.tsx

import React from 'react';
import { Edge } from 'reactflow';
import { StageData } from '../types';
import PipelineVisualization from '../components/PipelineVisualization';

interface PipelineViewProps {
    data: StageData[];
    edges: Edge[];
}

const PipelineView: React.FC<PipelineViewProps> = ({ data, edges }) => {
    return <PipelineVisualization data={data} edges={edges} />;
};

export default PipelineView;
