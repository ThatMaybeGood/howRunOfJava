// src/pages/RuleLibrary.jsx
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Input, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const RuleLibrary = () => {
    const [rules, setRules] = useState([]);

    const columns = [
        { title: '规则名称', dataIndex: 'name', key: 'name' },
        { title: '类型', dataIndex: 'type', key: 'type', render: type => (
                <Tag color={type === 'sql' ? 'blue' : 'green'}>{type}</Tag>
            )},
        { title: '数据源', dataIndex: 'dataSource', key: 'dataSource' },
        { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
        { title: '操作', key: 'actions', render: () => (
                <Space>
                    <Button size="small">编辑</Button>
                    <Button size="small" type="link">测试</Button>
                    <Button size="small" danger>删除</Button>
                </Space>
            )}
    ];

    return (
        <Card
            title="规则库"
            extra={
                <Space>
                    <Input placeholder="搜索规则" prefix={<SearchOutlined />} />
                    <Button type="primary" icon={<PlusOutlined />}>
                        新建规则
                    </Button>
                </Space>
            }
        >
            <Table columns={columns} dataSource={rules} rowKey="id" />
        </Card>
    );
};

export default RuleLibrary;