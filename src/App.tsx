import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { ViewUpdate } from '@uiw/react-codemirror';
import { parseJenkinsfile } from './utils/parser.utils';
import { Stage } from './types';
import JenkinsfileInput from "./components/JenkinsFileInput/JenkinsfileInput";
import PipelineView from "./Views/PipelineView";
import LayoutToggle from "./components/LayoutToggle";
import useScreenSize from "./hooks/useScreenSize";

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
    const screenSize = useScreenSize();
    const [jenkinsfileContent, setJenkinsfileContent] = useState<string>(sampleJenkinsfile);
    const [parsedData, setParsedData] = useState<Stage[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isParsing, setIsParsing] = useState<boolean>(false);
    const [isColumnlayout, setColumnLayout] = useState<boolean>(true);

    // Debounced parse function to optimize performance
    const debouncedParse = React.useRef(
        debounce((content: string) => {
            setIsParsing(true);
            try {
                const parsedStages: Stage[] = parseJenkinsfile(content);
                setParsedData(parsedStages)
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Failed to parse the Jenkinsfile.');
                setParsedData([]);
            } finally {
                setIsParsing(false);
            }
        }, 500)
    ).current;
    useEffect(() => {
        if (screenSize.width < 800) {
            setColumnLayout(false)
        }
    }, [screenSize]);

    useEffect(() => {
        if (jenkinsfileContent.trim() === '') {
            setParsedData([]);
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
                    isColumnlayout ? 'flex-row' : 'flex-col-reverse'
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
                <PipelineView isParsing={isParsing} data={parsedData} />

            </div>
        </div>
    );
};

export default App;
