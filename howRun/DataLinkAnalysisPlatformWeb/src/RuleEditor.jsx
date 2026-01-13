import React, { useState, useEffect } from 'react';
import {
    Card,
    Form,
    Input,
    Select,
    Button,
    Space,
    Tabs,
    InputNumber,
    Switch,
    Divider,
    Row,
    Col,
    message,
    Modal,
} from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import {
    SaveOutlined,
    DatabaseOutlined,
    FunctionOutlined,
    ApiOutlined,
    CodeOutlined,
} from '@ant-design/icons';

const { TabPane } = Tabs;
const { TextArea } = Input;

const RuleEditor = ({ initialData, onSave, onCancel }) => {
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('sql');
    const [sqlCode, setSqlCode] = useState('');
    const [testResult, setTestResult] = useState(null);
    const [testing, setTesting] = useState(false);
    const [dataPools, setDataPools] = useState([]);

    // 模拟数据池数据
    useEffect(() => {
        setDataPools([
            { id: 'pool1', name: '生产数据库', type: 'mysql' },
            { id: 'pool2', name: '测试数据库', type: 'postgresql' },
            { id: 'pool3', name: 'Oracle数据库', type: 'oracle' },
        ]);
    }, []);

    // 测试SQL查询
    const testSqlQuery = async () => {
        if (!sqlCode.trim()) {
            message.warning('请输入SQL语句');
            return;
        }

        setTesting(true);
        // 模拟测试请求
        setTimeout(() => {
            const mockResult = {
                success: Math.random() > 0.3,
                message: Math.random() > 0.3 ? '查询成功' : '查询失败: 数据不存在',
                data: Math.random() > 0.3 ? [
                    { id: 1, name: '示例数据1', count: 10 },
                    { id: 2, name: '示例数据2', count: 5 },
                ] : [],
                rowCount: Math.floor(Math.random() * 100),
                executionTime: Math.floor(Math.random() * 1000),
            };
            setTestResult(mockResult);
            setTesting(false);

            if (mockResult.success) {
                message.success('测试成功');
            } else {
                message.error('测试失败: ' + mockResult.message);
            }
        }, 1000);
    };

    // 保存规则
    const handleSave = () => {
        form.validateFields().then(values => {
            const ruleData = {
                ...values,
                sqlCode,
                type: activeTab,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            if (onSave) {
                onSave(ruleData);
            }
            message.success('规则保存成功');
        });
    };

    return (
        <Card title="规则编辑器">
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane
                    tab={
                        <span>
              <DatabaseOutlined />
              SQL规则
            </span>
                    }
                    key="sql"
                >
                    <Form form={form} layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="规则名称"
                                    rules={[{ required: true, message: '请输入规则名称' }]}
                                >
                                    <Input placeholder="输入规则名称" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="dataPoolId"
                                    label="数据池"
                                    rules={[{ required: true, message: '请选择数据池' }]}
                                >
                                    <Select placeholder="选择数据池">
                                        {dataPools.map(pool => (
                                            <Select.Option key={pool.id} value={pool.id}>
                                                {pool.name} ({pool.type})
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="description"
                            label="规则描述"
                        >
                            <TextArea
                                placeholder="输入规则描述"
                                rows={2}
                            />
                        </Form.Item>

                        <Form.Item
                            name="successCondition"
                            label="成功条件"
                            rules={[{ required: true, message: '请选择成功条件' }]}
                        >
                            <Select placeholder="选择成功条件">
                                <Select.Option value="has_data">查询有数据</Select.Option>
                                <Select.Option value="no_data">查询无数据</Select.Option>
                                <Select.Option value="count_gt">数量大于</Select.Option>
                                <Select.Option value="count_lt">数量小于</Select.Option>
                                <Select.Option value="custom">自定义条件</Select.Option>
                            </Select>
                        </Form.Item>

                        <Divider>SQL编辑器</Divider>

                        <div style={{ marginBottom: 16 }}>
                            <div style={{ marginBottom: 8 }}>
                                <span style={{ fontWeight: 'bold' }}>SQL查询语句</span>
                                <span style={{ color: '#666', marginLeft: 8 }}>
                  使用{'{参数名}'}引用输入参数
                </span>
                            </div>
                            <CodeMirror
                                value={sqlCode}
                                height="200px"
                                extensions={[sql()]}
                                theme={oneDark}
                                onChange={setSqlCode}
                                style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}
                            />
                        </div>

                        <Space>
                            <Button
                                type="primary"
                                loading={testing}
                                onClick={testSqlQuery}
                            >
                                测试SQL
                            </Button>
                            <Button onClick={() => setSqlCode('')}>
                                清空
                            </Button>
                        </Space>

                        {testResult && (
                            <div style={{ marginTop: 16 }}>
                                <Card size="small" title="测试结果">
                                    <div>
                                        <Tag color={testResult.success ? 'success' : 'error'}>
                                            {testResult.success ? '成功' : '失败'}
                                        </Tag>
                                        <span style={{ marginLeft: 8 }}>{testResult.message}</span>
                                    </div>
                                    {testResult.rowCount !== undefined && (
                                        <div style={{ marginTop: 8 }}>
                                            返回行数: <strong>{testResult.rowCount}</strong>
                                        </div>
                                    )}
                                    {testResult.executionTime !== undefined && (
                                        <div style={{ marginTop: 8 }}>
                                            执行时间: <strong>{testResult.executionTime}ms</strong>
                                        </div>
                                    )}
                                </Card>
                            </div>
                        )}
                    </Form>
                </TabPane>

                <TabPane
                    tab={
                        <span>
              <FunctionOutlined />
              函数规则
            </span>
                    }
                    key="function"
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="functionType"
                            label="函数类型"
                            rules={[{ required: true, message: '请选择函数类型' }]}
                        >
                            <Select placeholder="选择函数类型">
                                <Select.Option value="javascript">JavaScript</Select.Option>
                                <Select.Option value="python">Python</Select.Option>
                                <Select.Option value="groovy">Groovy</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="functionCode"
                            label="函数代码"
                            rules={[{ required: true, message: '请输入函数代码' }]}
                        >
                            <TextArea
                                rows={10}
                                placeholder={`function validate(input) {
  // 输入参数: input
  // 返回: { success: boolean, message: string, data: any }
  
  // 示例: 检查输入是否为数字
  if (typeof input.value === 'number') {
    return {
      success: true,
      message: '验证通过',
      data: input.value
    };
  }
  
  return {
    success: false,
    message: '输入必须为数字',
    data: null
  };
}`}
                            />
                        </Form.Item>
                    </Form>
                </TabPane>

                <TabPane
                    tab={
                        <span>
              <ApiOutlined />
              API规则
            </span>
                    }
                    key="api"
                >
                    <Form form={form} layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="apiMethod"
                                    label="请求方法"
                                    rules={[{ required: true, message: '请选择请求方法' }]}
                                >
                                    <Select placeholder="选择请求方法">
                                        <Select.Option value="GET">GET</Select.Option>
                                        <Select.Option value="POST">POST</Select.Option>
                                        <Select.Option value="PUT">PUT</Select.Option>
                                        <Select.Option value="DELETE">DELETE</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="apiUrl"
                                    label="API地址"
                                    rules={[{ required: true, message: '请输入API地址' }]}
                                >
                                    <Input placeholder="https://api.example.com/validate" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="apiHeaders"
                            label="请求头 (JSON格式)"
                        >
                            <TextArea
                                rows={4}
                                placeholder={`{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}"
}`}
                            />
                        </Form.Item>

                        <Form.Item
                            name="apiBody"
                            label="请求体 (JSON格式)"
                        >
                            <TextArea
                                rows={6}
                                placeholder={`{
  "data": "{参数名}",
  "timestamp": "{timestamp}"
}`}
                            />
                        </Form.Item>
                    </Form>
                </TabPane>
            </Tabs>

            <Divider />

            <div style={{ textAlign: 'right' }}>
                <Space>
                    {onCancel && (
                        <Button onClick={onCancel}>
                            取消
                        </Button>
                    )}
                    <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                        保存规则
                    </Button>
                </Space>
            </div>
        </Card>
    );
};

export default RuleEditor;