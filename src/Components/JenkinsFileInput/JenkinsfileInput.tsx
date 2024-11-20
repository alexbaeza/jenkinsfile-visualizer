import React from 'react';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import {StreamLanguage} from "@codemirror/language";
import {groovy} from "@codemirror/legacy-modes/mode/groovy"; // Import Groovy language support

interface JenkinsfileInputProps {
    jenkinsfileContent: string;
    onChange: (value: string, viewUpdate: ViewUpdate) => void;
    error: string | null;
    useColumnLayout: boolean; // Add layout prop
}

const JenkinsfileInput: React.FC<JenkinsfileInputProps> = ({
                                                               jenkinsfileContent,
                                                               onChange,
                                                               error,
                                                               useColumnLayout,
                                                           }) => {
    return (
        <div
            className={`flex flex-col ${
                useColumnLayout  ? 'md:w-1/2 max-w-[50%]' : 'w-full'
            }`}
        >
            <h2 className="text-xl font-semibold mb-2">Paste Your Jenkinsfile</h2>
            <CodeMirror
                height={"80vh"}
                minHeight={"500px"}
                value={jenkinsfileContent}
                basicSetup
                onChange={onChange}
                className="flex-1 border rounded p-2"
                extensions={[StreamLanguage.define(groovy)]}
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default JenkinsfileInput;
