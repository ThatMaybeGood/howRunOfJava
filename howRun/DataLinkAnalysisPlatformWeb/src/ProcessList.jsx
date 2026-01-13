import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Table,
    Tag,
    Input,
    Space,
    Modal,
    Form,
    Select,
    message,
    Popconfirm,
    Badge,
    Tooltip
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    PlayCircleOutlined,
    SearchOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { getProcessList, createProcess, deleteProcess } from '../services/api';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const ProcessList = () => {
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProcesses();
    }, []);

    const fetchProcesses = async () => {
        setLoading(true);
        try {
            const data = await getProcessList();
            setProcesses(data);
        } catch (error) {
            message.error('加载流程列表失败');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (values) => {
        try {
            await createProcess(values);
            message.success('创建成功');
            setModalVisible(false);
            form.resetFields();
            fetchProcesses();
        } catch (error) {
            message.error('创建失败');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProcess(id);
            message.success('删除成功');
            fetchProcesses();
        } catch (error) {
            message.error('删除失败');
        }
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const filteredProcesses = processes.filter(process =>
        process.name.toLowerCase().includes(searchText.toLowerCase()) ||
        process.description?.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: '流程名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <a onClick={() => navigate(`/process/design/${record.id}`)}>
                    {text}
                </a>
            ),
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusMap = {
                    draft: { color: 'default', text: '草稿' },
                    active: { color: 'success', text: '激活' },
                    inactive: { color: 'error', text: '停用' },
                };
                const config = statusMap[status] || { color: 'default', text: status };
                return <Tag color={config.color}>{config.text}</Tag>;
            },
        },
        {
            title: '节点数',
            dataIndex: 'nodeCount',
            key: 'nodeCount',
            align: 'center',
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: '操作',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="设计流程">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/process/design/${record.id}`)}
                        />
                    </Tooltip>
                    <Tooltip title="运行流程">
                        <Button
                            type="text"
                            icon={<PlayCircleOutlined />}
                            onClick={() => navigate(`/process/run/${record.id}`)}
                        />
                    </Tooltip>
                    <Tooltip title="查看详情">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/process/view/${record.id}`)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="确定删除此流程吗？"
                        onConfirm={() => handleDelete(record.id)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Tooltip title="删除">
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Card
                title="业务流程列表"
                extra={
                    <Space>
                        <Search
                            placeholder="搜索流程"
                            onSearch={handleSearch}
                            style={{ width: 200 }}
                            allowClear
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setModalVisible(true)}
                        >
                            新建流程
                        </Button>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={filteredProcesses}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                />
            </Card>

            <Modal
                title="新建业务流程"
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreate}
                >
                    <Form.Item
                        name="name"
                        label="流程名称"
                        rules={[{ required: true, message: '请输入流程名称' }]}
                    >
                        <Input placeholder="请输入流程名称" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="流程描述"
                    >
                        <Input.TextArea
                            placeholder="请输入流程描述"
                            rows={3}
                        />
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="流程分类"
                    >
                        <Select placeholder="选择分类">
                            <Select.Option value="data-validation">数据校验</Select.Option>
                            <Select.Option value="business-process">业务流程</Select.Option>
                            <Select.Option value="workflow">工作流</Select.Option>
                            <Select.Option value="approval">审批流程</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ProcessList;