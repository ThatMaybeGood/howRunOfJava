import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
    Card,
    Drawer,
    Form,
    Input,
    Button,
    Select,
    Space,
    Tabs,
    InputNumber,
    Switch,
    message,
    Divider,
    Empty,
    Tag,
    Modal,
} from 'antd';
import {
    SaveOutlined,
    PlayCircleOutlined,
    PlusOutlined,
    DeleteOutlined,
    SettingOutlined,
    DatabaseOutlined,
} from '@ant-design/icons';
import CustomNode from '../components/ProcessCanvas/CustomNode';
import RuleEditor from '../components/RuleEditor/RuleEditor';
import DataPoolSelector from '../components/DataPool/DataPoolSelector';
import { mockNodes, mockEdges, processTemplates } from '../services/mockData';

const nodeTypes = {
    customNode: CustomNode,
};

const ProcessDesign = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(mockNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(mockEdges);
    const [selectedNode, setSelectedNode] = useState(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [ruleEditorVisible, setRuleEditorVisible] = useState(false);
    const [processName, setProcessName] = useState('新业务流程');
    const [form] = Form.useForm();
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    // 连接节点
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    // 节点点击事件
    const onNodeClick = useCallback((event, node) => {
        setSelectedNode(node);
        setDrawerVisible(true);
        form.setFieldsValue({
            name: node.data.label,
            type: node.type,
            description: node.data.description,
            dataPoolId: node.data.dataPoolId,
            ruleId: node.data.ruleId,
            isBlocking: node.data.isBlocking,
            timeout: node.data.timeout,
        });
    }, [form]);

    // 保存节点配置
    const saveNodeConfig = useCallback((values) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedNode.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label: values.name,
                            description: values.description,
                            dataPoolId: values.dataPoolId,
                            ruleId: values.ruleId,
                            isBlocking: values.isBlocking,
                            timeout: values.timeout,
                            status: 'configured',
                        },
                    };
                }
                return node;
            })
        );
        message.success('节点配置已保存');
        setDrawerVisible(false);
    }, [selectedNode, setNodes]);

    // 添加新节点
    const addNewNode = useCallback(() => {
        const newNodeId = `node_${Date.now()}`;
        const newNode = {
            id: newNodeId,
            type: 'customNode',
            position: {
                x: Math.random() * 400,
                y: Math.random() * 400,
            },
            data: {
                label: `新节点 ${nodes.length + 1}`,
                type: 'validation',
                status: 'pending',
                description: '',
                isBlocking: true,
            },
        };
        setNodes((nds) => nds.concat(newNode));
    }, [nodes.length, setNodes]);

    // 删除选中节点
    const deleteSelectedNode = useCallback(() => {
        if (selectedNode) {
            setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
            setEdges((eds) => eds.filter(
                (edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
            ));
            setDrawerVisible(false);
            setSelectedNode(null);
            message.success('节点已删除');
        }
    }, [selectedNode, setNodes, setEdges]);

    // 应用模板
    const applyTemplate = useCallback((template) => {
        setNodes(template.nodes);
        setEdges(template.edges);
        message.success(`已应用模板: ${template.name}`);
    }, [setNodes, setEdges]);

    // 保存整个流程
    const saveProcess = useCallback(() => {
        const processData = {
            name: processName,
            nodes: nodes.map(node => ({
                id: node.id,
                type: node.type,
                position: node.position,
                data: node.data,
            })),
            edges: edges.map(edge => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                type: edge.type,
            })),
        };

        // 这里调用保存API
        console.log('保存流程:', processData);
        message.success('流程保存成功');
    }, [processName, nodes, edges]);

    return (
        <div style={{ height: 'calc(100vh - 200px)' }}>
            <Card
                title={
                    <Space>
                        <Input
                            value={processName}
                            onChange={(e) => setProcessName(e.target.value)}
                            style={{ width: 200 }}
                            placeholder="输入流程名称"
                        />
                        <Tag color="blue">设计模式</Tag>
                    </Space>
                }
                extra={
                    <Space>
                        <Select
                            placeholder="选择模板"
                            style={{ width: 150 }}
                            onChange={applyTemplate}
                            options={processTemplates.map(t => ({
                                label: t.name,
                                value: t.id,
                            }))}
                        />
                        <Button
                            icon={<PlusOutlined />}
                            onClick={addNewNode}
                        >
                            添加节点
                        </Button>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={saveProcess}
                        >
                            保存流程
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlayCircleOutlined />}
                            onClick={() => message.info('跳转到运行页面')}
                        >
                            运行流程
                        </Button>
                    </Space>
                }
                style={{ marginBottom: 16 }}
            >
                <div ref={reactFlowWrapper} style={{ height: 600 }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        nodeTypes={nodeTypes}
                        onInit={setReactFlowInstance}
                        fitView
                    >
                        <Background variant="dots" gap={12} size={1} />
                        <Controls />
                        <MiniMap />
                    </ReactFlow>
                </div>
            </Card>

            {/* 节点配置抽屉 */}
            <Drawer
                title="节点配置"
                width={500}
                open={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                extra={
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={deleteSelectedNode}
                    >
                        删除节点
                    </Button>
                }
            >
                {selectedNode && (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={saveNodeConfig}
                        initialValues={{
                            isBlocking: true,
                            timeout: 30,
                        }}
                    >
                        <Form.Item
                            name="name"
                            label="节点名称"
                            rules={[{ required: true, message: '请输入节点名称' }]}
                        >
                            <Input placeholder="输入节点名称" />
                        </Form.Item>

                        <Form.Item
                            name="type"
                            label="节点类型"
                        >
                            <Select>
                                <Select.Option value="start">开始节点</Select.Option>
                                <Select.Option value="validation">校验节点</Select.Option>
                                <Select.Option value="transformation">转换节点</Select.Option>
                                <Select.Option value="decision">决策节点</Select.Option>
                                <Select.Option value="end">结束节点</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="节点描述"
                        >
                            <Input.TextArea
                                placeholder="输入节点描述"
                                rows={3}
                            />
                        </Form.Item>

                        <Divider>数据源配置</Divider>

                        <Form.Item
                            name="dataPoolId"
                            label="数据池"
                        >
                            <DataPoolSelector />
                        </Form.Item>

                        <Divider>校验规则配置</Divider>

                        <Form.Item
                            name="ruleId"
                            label="选择规则"
                        >
                            <Button
                                icon={<SettingOutlined />}
                                onClick={() => setRuleEditorVisible(true)}
                                style={{ width: '100%' }}
                            >
                                {form.getFieldValue('ruleId') ? '编辑规则' : '配置规则'}
                            </Button>
                        </Form.Item>

                        <Form.Item
                            name="isBlocking"
                            label="阻断模式"
                            valuePropName="checked"
                        >
                            <Switch
                                checkedChildren="校验失败时阻断"
                                unCheckedChildren="校验失败时继续"
                            />
                        </Form.Item>

                        <Form.Item
                            name="timeout"
                            label="超时时间(秒)"
                        >
                            <InputNumber min={1} max={300} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                保存配置
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Drawer>

            {/* 规则编辑器模态框 */}
            <Modal
                title="规则编辑器"
                width={800}
                open={ruleEditorVisible}
                onCancel={() => setRuleEditorVisible(false)}
                footer={null}
                destroyOnClose
            >
                <RuleEditor
                    onSave={(rule) => {
                        form.setFieldValue('ruleId', rule.id);
                        setRuleEditorVisible(false);
                        message.success('规则已保存');
                    }}
                />
            </Modal>
        </div>
    );
};

export default ProcessDesign;