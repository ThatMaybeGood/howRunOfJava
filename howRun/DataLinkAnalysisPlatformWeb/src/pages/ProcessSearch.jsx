// src/pages/ProcessSearch.jsx
import React, { useState } from 'react';
import { Card, Form, Input, Button, Select, Table, Tag, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const ProcessSearch = () => {
    const [searchResults, setSearchResults] = useState([]);

    const columns = [
        { title: '路径名称', dataIndex: 'name', key: 'name' },
        { title: '节点数', dataIndex: 'stepCount', key: 'stepCount' },
        { title: '预计耗时', dataIndex: 'estimatedTime', key: 'estimatedTime' },
        { title: '成功率', dataIndex: 'successRate', key: 'successRate' },
        { title: '操作', key: 'actions', render: () => <Button type="link">查看详情</Button> }
    ];

    return (
        <Card title="路径查询">
            <Form layout="inline">
                <Form.Item label="起点节点">
                    <Select style={{ width: 200 }} placeholder="选择起点" />
                </Form.Item>
                <Form.Item label="终点节点">
                    <Select style={{ width: 200 }} placeholder="选择终点" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" icon={<SearchOutlined />}>
                        查询路径
                    </Button>
                </Form.Item>
            </Form>

            <Table
                columns={columns}
                dataSource={searchResults}
                style={{ marginTop: 16 }}
            />
        </Card>
    );
};

export default ProcessSearch;