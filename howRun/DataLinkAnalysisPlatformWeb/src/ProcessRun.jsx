import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Space,
    Steps,
    Alert,
    Table,
    Tag,
    Statistic,
    Row,
    Col,
    Progress,
    message,
    Modal,
    Tabs,
} from 'antd';
import {
    PlayCircleOutlined,
    PauseCircleOutlined,
    StopOutlined,
    SaveOutlined,
    HistoryOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import ProcessViewer from '../components/ProcessViewer/ProcessViewer';
import { runProcess, getProcessHistory } from '../services/api';

const { Step } = Steps;
const { TextArea } = Input;

const ProcessRun = ({ processId }) => {
    const [form] = Form.useForm();
    const [running, setRunning] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [runResults, setRunResults] = useState([]);
    const [processStatus, setProcessStatus] = useState('pending');
    const [executionTime, setExecutionTime] = useState(0);
    const [historyVisible, setHistoryVisible] = useState(false);
    const [executionHistory, setExecutionHistory] = useState([]);

    // 模拟运行流程
    const startProcess = async (values) => {
        setRunning(true);
        setProcessStatus('running');
        setCurrentStep(0);
        setRunResults([]);

        const inputParams = JSON.parse(values.parameters || '{}');

        // 模拟执行过程
        const mockSteps = [
            { id: 'start', name: '开始节点', status: 'pending' },
            { id: 'validate1', name: '数据校验1', status: 'pending' },
            { id: 'validate2', name: '数据校验2', status: 'pending' },
            { id: 'transform1', name: '数据转换', status: 'pending' },
            { id: 'end', name: '结束节点', status: 'pending' },
        ];

        for (let i = 0; i < mockSteps.length; i++) {
            setCurrentStep(i);
            mockSteps[i].status = 'running';

            // 模拟每个步骤的执行时间
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 随机决定步骤是否成功
            const success = Math.random() > 0.2;
            mockSteps[i].status = success ? 'success' : 'failed';
            mockSteps[i].result = success
                ? { success: true, message: '验证通过', data: { count: Math.floor(Math.random() * 100) } }
                : { success: false, message: '验证失败: 数据不存在', error: 'DATA_NOT_FOUND' };

            setRunResults([...mockSteps.slice(0, i + 1)]);

            // 如果步骤失败且是阻断模式，则停止流程
            if (!success) {
                setProcessStatus('failed');
                setRunning(false);
                message.error(`流程执行失败: ${mockSteps[i].result.message}`);
                return;
            }
        }

        setProcessStatus('success');
        setRunning(false);
        setExecutionTime(mockSteps.length * 1000);
        message.success('流程执行成功');
    };

    // 停止流程
    const stopProcess = () => {
        setRunning(false);
        setProcessStatus('stopped');
        message.info('流程已停止');
    };

    // 查看执行历史
    const loadExecutionHistory = async () => {
        try {
            const history = await getProcessHistory(processId);
            setExecutionHistory(history);
            setHistoryVisible(true);
        } catch (error) {
            message.error('加载执行历史失败');
        }
    };

    const columns = [
        {
            title: '步骤名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusMap = {
                    pending: { color: 'default', text: '等待' },
                    running: { color: 'processing', text: '执行中' },
                    success: { color: 'success', text: '成功' },
                    failed: { color: 'error', text: '失败' },
                };
                const config = statusMap[status] || { color: 'default', text: status };
                return <Tag color={config.color}>{config.text}</Tag>;
            },
        },
        {
            title: '执行结果',
            dataIndex: 'result',
            key: 'result',
            render: (result) => result?.message || '-',
        },
        {
            title: '耗时',
            dataIndex: 'duration',
            key: 'duration',
            render: (duration) => duration ? `${duration}ms` : '-',
        },
        {
            title: '操作',
            key: 'actions',
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => viewStepDetail(record)}
                    size="small"
                >
                    查看详情
                </Button>
            ),
        },
    ];

    const viewStepDetail = (step) => {
        Modal.info({
            title: `步骤详情: ${step.name}`,
            width: 600,
            content: (
                <div>
                    <p><strong>状态:</strong> {step.status}</p>
                    <p><strong>结果:</strong> {step.result?.message}</p>
                    {step.result?.data && (
                        <div>
                            <strong>返回数据:</strong>
                            <pre style={{
                                background: '#f6f6f6',
                                padding: 12,
                                borderRadius: 4,
                                maxHeight: 200,
                                overflow: 'auto'
                            }}>
                {JSON.stringify(step.result.data, null, 2)}
              </pre>
                        </div>
                    )}
                    {step.result?.error && (
                        <Alert
                            message="错误信息"
                            description={step.result.error}
                            type="error"
                            style={{ marginTop: 16 }}
                        />
                    )}
                </div>
            ),
        });
    };

    return (
        <Row gutter={16}>
            <Col span={16}>
                <Card
                    title="流程执行"
                    extra={
                        <Space>
                            <Button
                                icon={<HistoryOutlined />}
                                onClick={loadExecutionHistory}
                            >
                                执行历史
                            </Button>
                        </Space>
                    }
                >
                    <div style={{ marginBottom: 24 }}>
                        <ProcessViewer
                            processId={processId}
                            highlightNode={runResults[currentStep]?.id}
                        />
                    </div>

                    <Card size="small" title="执行统计">
                        <Row gutter={16}>
                            <Col span={6}>
                                <Statistic
                                    title="当前状态"
                                    value={processStatus}
                                    valueStyle={{
                                        color: processStatus === 'success' ? '#52c41a' :
                                            processStatus === 'failed' ? '#ff4d4f' :
                                                processStatus === 'running' ? '#1890ff' : '#d9d9d9'
                                    }}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title="执行步骤"
                                    value={`${currentStep + 1}/${runResults.length + 1}`}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title="执行时间"
                                    value={executionTime}
                                    suffix="ms"
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title="成功率"
                                    value={runResults.filter(r => r.status === 'success').length}
                                    suffix={`/${runResults.length}`}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Card>
            </Col>

            <Col span={8}>
                <Card title="参数配置">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={startProcess}
                        disabled={running}
                    >
                        <Form.Item
                            name="parameters"
                            label="输入参数 (JSON格式)"
                            rules={[
                                { required: true, message: '请输入参数' },
                                {
                                    validator: (_, value) => {
                                        try {
                                            JSON.parse(value || '{}');
                                            return Promise.resolve();
                                        } catch (e) {
                                            return Promise.reject(new Error('请输入有效的JSON格式'));
                                        }
                                    },
                                },
                            ]}
                        >
                            <TextArea
                                rows={8}
                                placeholder={`{
  "userId": "12345",
  "orderId": "ORDER001",
  "amount": 100.50,
  "timestamp": "2024-01-15T10:30:00Z"
}`}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                                {running && (
                                    <Button
                                        danger
                                        icon={<StopOutlined />}
                                        onClick={stopProcess}
                                    >
                                        停止执行
                                    </Button>
                                )}
                                <Button
                                    type="primary"
                                    icon={running ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                                    htmlType="submit"
                                    loading={running}
                                    disabled={running}
                                >
                                    {running ? '执行中...' : '开始执行'}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>

                <Card
                    title="执行进度"
                    style={{ marginTop: 16 }}
                >
                    <Steps
                        current={currentStep}
                        direction="vertical"
                        status={processStatus === 'failed' ? 'error' : 'process'}
                    >
                        {runResults.map((step, index) => (
                            <Step
                                key={step.id}
                                title={step.name}
                                description={
                                    <div>
                                        <div>{step.result?.message}</div>
                                        {step.status === 'failed' && (
                                            <Alert
                                                message={step.result?.error}
                                                type="error"
                                                showIcon
                                                style={{ marginTop: 8 }}
                                                size="small"
                                            />
                                        )}
                                    </div>
                                }
                                icon={
                                    step.status === 'success' ? (
                                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                    ) : step.status === 'failed' ? (
                                        <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                                    ) : step.status === 'running' ? (
                                        <LoadingOutlined style={{ color: '#1890ff' }} />
                                    ) : null
                                }
                            />
                        ))}
                    </Steps>
                </Card>
            </Col>

            {/* 执行历史模态框 */}
            <Modal
                title="执行历史"
                width={800}
                open={historyVisible}
                onCancel={() => setHistoryVisible(false)}
                footer={null}
            >
                <Table
                    columns={[
                        { title: '执行时间', dataIndex: 'executedAt', key: 'executedAt' },
                        { title: '状态', dataIndex: 'status', key: 'status', render: (status) => (
                                <Tag color={status === 'success' ? 'success' : 'error'}>
                                    {status === 'success' ? '成功' : '失败'}
                                </Tag>
                            )},
                        { title: '执行人', dataIndex: 'executor', key: 'executor' },
                        { title: '耗时', dataIndex: 'duration', key: 'duration', render: (dur) => `${dur}ms` },
                        { title: '输入参数', dataIndex: 'inputParams', key: 'inputParams', ellipsis: true },
                    ]}
                    dataSource={executionHistory}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Modal>
        </Row>
    );
};

export default ProcessRun;