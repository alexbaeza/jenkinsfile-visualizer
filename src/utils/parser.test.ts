import {Stage} from '../types';
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
        "branches": [],
        "name": "Build",
        "steps": [
            "Building..."
        ],
        "type": "stage"
    },
    {
        "branches": [
            {
                "branches": [],
                "name": "Unit Tests",
                "steps": [
                    "Running Unit Tests..."
                ],
                "type": "stage"
            },
            {
                "branches": [],
                "name": "Integration Tests",
                "steps": [
                    "Running Integration Tests..."
                ],
                "type": "stage"
            }
        ],
        "name": "Test",
        "steps": [],
        "type": "parallel"
    },
    {
        "branches": [],
        "name": "Unit Tests",
        "steps": [
            "Running Unit Tests..."
        ],
        "type": "stage"
    },
    {
        "branches": [],
        "name": "Integration Tests",
        "steps": [
            "Running Integration Tests..."
        ],
        "type": "stage"
    },
    {
        "branches": [],
        "name": "Deploy",
        "steps": [
            "Deploying..."
        ],
        "type": "stage"
    }
];

describe("Jenkinsfile Parser", () => {
    it("should parse the sample Jenkinsfile correctly", () => {
        const parsedStages = parseJenkinsfile(sampleJenkinsfile);
        expect(parsedStages).toEqual(expectedOutput); // Use toEqual for deep equality
    });
});
