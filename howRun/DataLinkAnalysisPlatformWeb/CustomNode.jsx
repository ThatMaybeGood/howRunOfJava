import React from 'react';
import { Handle, Position } from 'reactflow';
import { Card, Tag, Progress, Tooltip } from 'antd';
import {
    PlayCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    LoadingOutlined,
    PauseCircleOutlined,
} from '@ant-design/icons';

const CustomNode = ({ data, selected }) => {
    const getStatusIcon = (status) => {
        const icons = {
            pending: <PlayCircleOutlined style={{ color: '#d9d9d9' }} />,
            running: <LoadingOutlined style={{ color: '#1890ff' }} />,
            success: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            failed: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
            blocked: <PauseCircleOutlined style={{ color: '#faad14' }} />,
        };
        return icons[status] || icons.pending;
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'default',
            running: 'processing',
            success: 'success',
            failed: 'error',
            blocked: 'warning',
        };
        return colors[status] || 'default';
    };

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <Tooltip title={data.description} placement="top">
                <Card
                    size="small"
                    style={{
                        width: 180,
                        border: selected ? '2px solid #1890ff' : '1px solid #d9d9d9',
                        borderRadius: 8,
                        cursor: 'pointer',
                    }}
                    bodyStyle={{ padding: '12px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                        {getStatusIcon(data.status)}
                        <span style={{ marginLeft: 8, fontWeight: 'bold', flex: 1 }}>
              {data.label}
            </span>
                        <Tag color={getStatusColor(data.status)} size="small">
                            {data.status}
                        </Tag>
                    </div>

                    {data.progress !== undefined && (
                        <Progress
                            percent={data.progress}
                            size="small"
                            status={data.status === 'failed' ? 'exception' : 'normal'}
                            style={{ marginBottom: 8 }}
                        />
                    )}

                    {data.ruleName && (
                        <div style={{ fontSize: 12, color: '#666' }}>
                            规则: {data.ruleName}
                        </div>
                    )}

                    {data.isBlocking !== undefined && (
                        <div style={{ fontSize: 12, color: '#666' }}>
                            模式: {data.isBlocking ? '阻断' : '非阻断'}
                        </div>
                    )}

                    {data.duration !== undefined && (
                        <div style={{ fontSize: 12, color: '#999' }}>
                            耗时: {data.duration}ms
                        </div>
                    )}
                </Card>
            </Tooltip>
            <Handle type="source" position={Position.Bottom} />
        </>
    );
};

export default CustomNode;