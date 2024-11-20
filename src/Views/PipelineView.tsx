// src/Views/PipelineView.tsx

import React from 'react';
import { Edge } from 'reactflow';
import { StageData } from '../types';
import PipelineVisualization from "../Components/PipelineVisualizer/PipelineVisualization";

interface PipelineViewProps {
    isParsing: boolean;
    data: StageData[];
    edges: Edge[];
}

const PipelineView: React.FC<PipelineViewProps> = ({isParsing, data, edges }) => {

    return (<div className="flex-1 flex flex-col">
        <h2 className="text-xl font-semibold mb-2">Pipeline Visualization</h2>
        {isParsing && (
            <div className="flex-1 flex items-center justify-center border rounded p-4 bg-white">
                <p className="text-blue-500">Parsing Jenkinsfile...</p>
            </div>
        )}
        {!isParsing && data.length > 0 ? (
            <PipelineVisualization data={data} edges={edges}/>
        ) : (
            !isParsing && (
                <div className="flex-1 flex items-center justify-center border rounded p-4 bg-white">
                    <p className="text-gray-500">Your pipeline visualization will appear here.</p>
                </div>
            )
        )}
    </div>)
};

export default PipelineView;
