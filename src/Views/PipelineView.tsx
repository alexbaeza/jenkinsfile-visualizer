// src/Views/PipelineView.tsx

import React from 'react';
import {Stage} from '../types';
import PipelineVisualization from "../components/PipelineVisualizer/PipelineVisualization";
import {transformStagesToStageData} from "../utils/transform.utils";

interface PipelineViewProps {
    isParsing: boolean;
    data: Stage[];
}

const PipelineView: React.FC<PipelineViewProps> = ({isParsing, data}) => {

    const {transformed, edges} = transformStagesToStageData(data);

    return (<div className="flex-1 flex flex-col">
        <h2 className="text-xl font-semibold mb-2">Pipeline Visualization</h2>
        {isParsing && (
            <div className="flex-1 flex items-center justify-center border rounded p-4 bg-white">
                <p className="text-blue-500">Parsing Jenkinsfile...</p>
            </div>
        )}
        {!isParsing && data.length > 0 ? (
            <PipelineVisualization data={transformed} edges={edges}/>
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
