import { Stage } from "../types";

/**
 * Parses a Jenkinsfile content and extracts stages, steps, and parallel executions.
 * @param content - The content of the Jenkinsfile as a string.
 * @returns An array of Stage objects representing the Pipeline structure.
 */
export const parseJenkinsfile = (content: string): Stage[] => {
    console.log("Starting to parse Jenkinsfile...");

    // Remove comments and unnecessary whitespace
    const cleanedContent = content.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '').trim();

    // Extract the 'pipeline { ... }' block
    const pipelineBlock = extractBlock(cleanedContent, 'pipeline');
    if (pipelineBlock) {
        console.log("Found 'pipeline' block.");
        return parseStages(pipelineBlock);
    } else {
        console.warn("No 'pipeline' block found in Jenkinsfile.");
        return [];
    }
};

/**
 * Extracts a block of code starting with a specific keyword.
 * @param content - The content to search within.
 * @param keyword - The keyword indicating the start of the block (e.g., 'pipeline', 'stages').
 * @returns The content within the block, or null if not found.
 */
const extractBlock = (content: string, keyword: string): string | null => {
    const keywordRegex = new RegExp(`${keyword}\\s*\\{`);
    const match = keywordRegex.exec(content);
    if (!match) return null;

    const braceIndex = match.index + match[0].length - 1; // Position of '{'
    return extractContentWithinBraces(content, braceIndex);
};

/**
 * Extracts the content within braces starting from a specific position.
 * @param content - The content to search within.
 * @param startIndex - The position of the opening brace '{'.
 * @returns The content within the braces, or null if not properly closed.
 */
const extractContentWithinBraces = (content: string, startIndex: number): string | null => {
    let openBraces = 0;
    let closeIndex = -1;

    for (let i = startIndex; i < content.length; i++) {
        if (content[i] === '{') openBraces++;
        else if (content[i] === '}') openBraces--;

        if (openBraces === 0) {
            closeIndex = i;
            break;
        }
    }

    if (closeIndex === -1) return null;
    return content.slice(startIndex + 1, closeIndex).trim();
};

/**
 * Recursively parses stage content to extract stages, steps, and parallel branches.
 * @param content - The content within a stage or parallel block.
 * @returns An array of Stage objects.
 */
const parseStages = (content: string): Stage[] => {
    const stages: Stage[] = [];

    // Regex to match all 'stage' blocks with their names and content
    const stageRegex = /stage\s*\(\s*['"](.+?)['"]\s*\)\s*\{/g;
    let match: RegExpExecArray | null;

    while ((match = stageRegex.exec(content)) !== null) {
        const stageName = match[1];
        const stageStartIndex = match.index + match[0].length - 1; // Position of '{'
        const stageBlock = extractContentWithinBraces(content, stageStartIndex);

        if (!stageBlock) {
            console.warn(`Could not extract block for stage '${stageName}'.`);
            continue;
        }

        // Check if the stage contains a 'parallel' block
        const parallelBlock = extractBlock(stageBlock, 'parallel');
        if (parallelBlock) {
            console.log(`Stage '${stageName}' contains parallel blocks.`);
            const branches = parseStages(parallelBlock); // Recursively parse parallel branches
            stages.push({
                name: stageName,
                type: "parallel",
                branches,
                steps: []
            });
        } else {
            // Parse steps within the stage
            const stepsBlock = extractBlock(stageBlock, 'steps');
            let steps: string[] = [];
            if (stepsBlock) {
                console.log(`Steps Content in '${stageName}':`, stepsBlock);
                steps = extractSteps(stepsBlock);
            } else {
                console.warn(`No 'steps' block found in stage '${stageName}'.`);
            }

            stages.push({
                name: stageName,
                type: "stage",
                steps,
                branches: [] // No branches for sequential stages
            });
        }
    }

    return stages;
};

/**
 * Extracts individual steps from a steps block.
 * @param content - The content within the steps block.
 * @returns An array of step commands.
 */
const extractSteps = (content: string): string[] => {
    const stepRegex = /(?:sh|echo|bat)\s*\(?\s*['"](.+?)['"]\s*\)?/g;
    const steps: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = stepRegex.exec(content)) !== null) {
        steps.push(match[1]); // Collect step commands
        console.log(`Found Step:`, match[1]);
    }

    return steps;
};
