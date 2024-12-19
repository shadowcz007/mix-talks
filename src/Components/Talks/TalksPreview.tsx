import React, { useState } from 'react';
import { Paper, Button } from '@mantine/core';

interface TalksPreviewProps {
    result: string;
}

const TalksPreview: React.FC<TalksPreviewProps> = ({ result }) => {
    const copyToClipboard = () => {
        const htmlBlob = new Blob([result], { type: 'text/html' });
        const clipboardItem = new ClipboardItem({ 'text/html': htmlBlob });
        navigator.clipboard.write([clipboardItem]).then(() => {
            alert('内容已复制到剪贴板！');
        });
    };

    return (
        <Paper shadow="sm" p="md" radius="md" style={{ outline: '1px solid #bbbbbb' }}>
            <div dangerouslySetInnerHTML={{ __html: result }} />
            <Button onClick={copyToClipboard} style={{ marginTop: '10px' }}>复制内容</Button>
        </Paper>
    );
};

export default TalksPreview; 