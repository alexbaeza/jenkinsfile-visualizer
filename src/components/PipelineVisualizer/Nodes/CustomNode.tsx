// src/components/CustomNode.tsx

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const NODE_WIDTH = 150;  // Same as in transform.utils.ts
const NODE_HEIGHT = 60;  // Same as in transform.utils.ts

const CustomNode: React.FC<NodeProps> = ({ data }) => {
    return (
        <div
            style={{
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
                padding: 10,
                borderRadius: 5,
                background: '#fff',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxSizing: 'border-box',
            }}
        >
            <strong>{data.label}</strong>
            {/* Additional content if needed */}
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
        </div>
    );
};

export default CustomNode;
