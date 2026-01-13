// src/pages/DataPool.jsx
import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, DatabaseOutlined } from '@ant-design/icons';

const DataPool = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const dataSources = [
        { id: 1, name: '生产数据库', type: 'MySQL', status: 'connected' },
        { id: 2, name: '测试数据库', type: 'PostgreSQL', status: 'connected' },
        { id: 3, name: 'Oracle数据库', type: 'Oracle', status: 'disconnected' },
    ];

    const columns = [
        { title: '数据源名称', dataIndex: 'name', key: 'name' },
        { title: '类型', dataIndex: 'type', key: 'type' },
        { title: '状态', dataIndex: 'status', key: 'status', render: status => (
                <Tag color={status === 'connected' ? 'success' : 'error'}>{status}</Tag>
            )},
        { title: '连接地址', dataIndex: 'url', key: 'url' },
        { title: '操作', key: 'actions', render: () => (
                <Space>
                    <Button size="small">测试连接</Button>
                    <Button size="small">编辑</Button>
                </Space>
            )}
    ];

    return (
        <>
            <Card
                title="数据池管理"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setModalVisible(true)}
                    >
                        添加数据源
                    </Button>
                }
            >
                <Table columns={columns} dataSource={dataSources} rowKey="id" />
            </Card>

            <Modal
                title="添加数据源"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical">
                    <Form.Item label="数据源名称" required>
                        <Input placeholder="输入数据源名称" />
                    </Form.Item>
                    <Form.Item label="数据库类型" required>
                        <Select>
                            <Select.Option value="mysql">MySQL</Select.Option>
                            <Select.Option value="postgresql">PostgreSQL</Select.Option>
                            <Select.Option value="oracle">Oracle</Select.Option>
                            <Select.Option value="sqlserver">SQL Server</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="连接地址" required>
                        <Input placeholder="jdbc:mysql://localhost:3306/db" />
                    </Form.Item>
                    <Form.Item label="用户名" required>
                        <Input />
                    </Form.Item>
                    <Form.Item label="密码" required>
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default DataPool;