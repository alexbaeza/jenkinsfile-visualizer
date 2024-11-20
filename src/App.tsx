import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { ViewUpdate } from '@uiw/react-codemirror';
import { parseJenkinsfile } from './utils/parser.utils';
import { Stage, StageData } from './types';
import { Edge } from 'reactflow';
import JenkinsfileInput from "./Components/JenkinsFileInput/JenkinsfileInput";
import PipelineView from "./Views/PipelineView";
import {transformStagesToStageData} from "./utils/transform.utils";
import LayoutToggle from "./Components/LayoutToggle";

const sampleJenkinsfile = `
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
            }
        }
        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        echo 'Running Unit Tests...'
                    }
                }
                stage('Integration Tests') {
                    steps {
                        echo 'Running Integration Tests...'
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
            }
        }
    }
}
`;

const App: React.FC = () => {
    const [jenkinsfileContent, setJenkinsfileContent] = useState<string>(sampleJenkinsfile);
    const [transformedData, setTransformedData] = useState<StageData[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isParsing, setIsParsing] = useState<boolean>(false);
    const [isColumnlayout, setColumnLayout] = useState<boolean>(true);

    // Debounced parse function to optimize performance
    const debouncedParse = React.useRef(
        debounce((content: string) => {
            setIsParsing(true);
            try {
                const parsedStages: Stage[] = parseJenkinsfile(content);
                const { transformed, edges } = transformStagesToStageData(parsedStages);
                setTransformedData(transformed);
                setEdges(edges);
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Failed to parse the Jenkinsfile.');
                setTransformedData([]);
                setEdges([]);
            } finally {
                setIsParsing(false);
            }
        }, 500)
    ).current;

    useEffect(() => {
        if (jenkinsfileContent.trim() === '') {
            setTransformedData([]);
            setEdges([]);
            setError(null);
            return;
        }
        debouncedParse(jenkinsfileContent);
        // Cleanup on unmount
        return () => {
            debouncedParse.cancel();
        };
    }, [jenkinsfileContent, debouncedParse]);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Jenkinsfile Visualizer</h1>
                {/* Layout Toggle */}
                <LayoutToggle
                    active={isColumnlayout}
                    onToggle={() => setColumnLayout(!isColumnlayout)
                }
                />
            </div>

            <div
                className={`flex ${
                    isColumnlayout ? 'md:flex-row' : 'md:flex-col-reverse'
                } gap-8`}
            >
                {/* Jenkinsfile Input Section */}
                <JenkinsfileInput
                    jenkinsfileContent={jenkinsfileContent}
                    onChange={(value: string, viewUpdate: ViewUpdate) => {
                        setJenkinsfileContent(value);
                    }}
                    useColumnLayout={isColumnlayout}
                    error={error}
                />
                {/* Pipeline Visualization Section */}
                <PipelineView isParsing={isParsing} data={transformedData} edges={edges} />

            </div>
        </div>
    );
};

export default App;
