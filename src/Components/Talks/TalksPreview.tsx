import React from 'react';
import { Paper } from '@mantine/core';

interface TalksPreviewProps {
    result: string;
}

const TalksPreview: React.FC<TalksPreviewProps> = ({ result }) => {
    return (
        <Paper shadow="sm" p="md" radius="md" style={{ outline: '1px solid #bbbbbb' }}>
            <div dangerouslySetInnerHTML={{ __html: result }} />
        </Paper>
    );
};

export default TalksPreview; 