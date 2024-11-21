import React from 'react';
import { RiLayoutRowLine, RiLayoutColumnLine } from 'react-icons/ri';

interface LayoutToggleProps {
    active: boolean
    onToggle: () => void;
}

const LayoutToggle: React.FC<LayoutToggleProps> = ({ active, onToggle }) => {
    return (
        <div className="flex items-center gap-4">
            {/* Icon for Side-by-Side */}
            <RiLayoutColumnLine
                size={24}
                color={active ? '#2563eb' : '#9ca3af'}
                className="cursor-pointer"
                onClick={onToggle}
            />
            {/* Toggle Switch */}
            <div
                className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                    active ? 'justify-start' : 'justify-end'
                }`}
                onClick={onToggle}
            >
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            </div>
            {/* Icon for Top-Bottom */}
            <RiLayoutRowLine
                size={24}
                color={active ? '#9ca3af' : '#2563eb'}
                className="cursor-pointer"
                onClick={onToggle}
            />
        </div>
    );
};

export default LayoutToggle;
