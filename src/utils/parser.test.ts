import { Stage } from '../types';
import {parseJenkinsfile} from "./parser.utils";

// Sample Jenkinsfile content
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

// Expected Output
const expectedOutput: Stage[] = [
    {
        name: "Build",
        type: "stage",
        steps: ["Building..."],
        branches: []
    },
    {
        name: "Test",
        type: "parallel",
        branches: [
            {
                name: "Unit Tests",
                type: "stage",
                steps: ["Running Unit Tests..."],
                branches: []
            },
            {
                name: "Integration Tests",
                type: "stage",
                steps: ["Running Integration Tests..."],
                branches: []
            }
        ]
    },
    {
        name: "Deploy",
        type: "stage",
        steps: ["Deploying..."],
        branches: []
    }
];

describe("Jenkinsfile Parser", () => {
    it("should parse the sample Jenkinsfile correctly", () => {
        const parsedStages = parseJenkinsfile(sampleJenkinsfile);
        console.log("Parsed Stages:", JSON.stringify(parsedStages, null, 2));
        expect(parsedStages).toEqual(expectedOutput); // Use toEqual for deep equality
    });
});
