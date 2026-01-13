// 模拟流程数据
export const mockProcesses = [
    {
        id: '1',
        name: '订单数据校验流程',
        description: '用于校验订单数据的完整性和准确性',
        status: 'active',
        nodeCount: 6,
        createdAt: '2024-01-15T10:30:00Z',
        category: 'data-validation',
        creator: 'admin',
    },
    {
        id: '2',
        name: '用户注册审批流程',
        description: '新用户注册信息的审批流程',
        status: 'active',
        nodeCount: 5,
        createdAt: '2024-01-14T14:20:00Z',
        category: 'approval',
        creator: 'admin',
    },
    {
        id: '3',
        name: '财务报表生成流程',
        description: '自动生成财务报表的流程',
        status: 'draft',
        nodeCount: 8,
        createdAt: '2024-01-13T09:15:00Z',
        category: 'business-process',
        creator: 'user1',
    },
];

// 模拟流程节点数据
export const mockNodes = [
    {
        id: 'start',
        type: 'customNode',
        position: { x: 250, y: 50 },
        data: {
            label: '开始',
            type: 'start',
            status: 'success',
            description: '流程开始节点',
        },
    },
    {
        id: 'validate1',
        type: 'customNode',
        position: { x: 250, y: 150 },
        data: {
            label: '数据校验1',
            type: 'validation',
            status: 'success',
            description: '校验订单基本信息',
            ruleName: '订单存在性检查',
            isBlocking: true,
            progress: 100,
        },
    },
    {
        id: 'validate2',
        type: 'customNode',
        position: { x: 150, y: 250 },
        data: {
            label: '数据校验2',
            type: 'validation',
            status: 'running',
            description: '校验用户信息',
            ruleName: '用户有效性检查',
            isBlocking: true,
            progress: 60,
        },
    },
    {
        id: 'validate3',
        type: 'customNode',
        position: { x: 350, y: 250 },
        data: {
            label: '数据校验3',
            type: 'validation',
            status: 'pending',
            description: '校验支付信息',
            ruleName: '支付状态检查',
            isBlocking: false,
            progress: 0,
        },
    },
    {
        id: 'transform1',
        type: 'customNode',
        position: { x: 250, y: 350 },
        data: {
            label: '数据转换',
            type: 'transformation',
            status: 'pending',
            description: '数据格式转换',
        },
    },
    {
        id: 'end',
        type: 'customNode',
        position: { x: 250, y: 450 },
        data: {
            label: '结束',
            type: 'end',
            status: 'pending',
            description: '流程结束节点',
        },
    },
];

export const mockEdges = [
    {
        id: 'e-start-1',
        source: 'start',
        target: 'validate1',
        type: 'smoothstep',
        animated: true,
    },
    {
        id: 'e-1-2',
        source: 'validate1',
        target: 'validate2',
        type: 'smoothstep',
        animated: true,
    },
    {
        id: 'e-1-3',
        source: 'validate1',
        target: 'validate3',
        type: 'smoothstep',
        animated: false,
    },
    {
        id: 'e-2-4',
        source: 'validate2',
        target: 'transform1',
        type: 'smoothstep',
        animated: false,
    },
    {
        id: 'e-3-4',
        source: 'validate3',
        target: 'transform1',
        type: 'smoothstep',
        animated: false,
    },
    {
        id: 'e-4-end',
        source: 'transform1',
        target: 'end',
        type: 'smoothstep',
        animated: false,
    },
];

// 模拟流程模板
export const processTemplates = [
    {
        id: 'template1',
        name: '基础数据校验流程',
        nodes: [
            {
                id: 'start',
                type: 'customNode',
                position: { x: 250, y: 50 },
                data: { label: '开始', type: 'start' },
            },
            {
                id: 'validate1',
                type: 'customNode',
                position: { x: 250, y: 150 },
                data: { label: '数据校验1', type: 'validation' },
            },
            {
                id: 'validate2',
                type: 'customNode',
                position: { x: 250, y: 250 },
                data: { label: '数据校验2', type: 'validation' },
            },
            {
                id: 'end',
                type: 'customNode',
                position: { x: 250, y: 350 },
                data: { label: '结束', type: 'end' },
            },
        ],
        edges: [
            { id: 'e1', source: 'start', target: 'validate1' },
            { id: 'e2', source: 'validate1', target: 'validate2' },
            { id: 'e3', source: 'validate2', target: 'end' },
        ],
    },
];

// 模拟规则数据
export const mockRules = [
    {
        id: 'rule1',
        name: '订单存在性检查',
        description: '检查订单在数据库中是否存在',
        type: 'sql',
        sqlCode: 'SELECT COUNT(*) as count FROM orders WHERE order_id = {orderId}',
        successCondition: 'count_gt',
        threshold: 0,
        dataPoolId: 'pool1',
        createdAt: '2024-01-15T10:30:00Z',
        creator: 'admin',
    },
    {
        id: 'rule2',
        name: '用户有效性检查',
        description: '检查用户是否处于有效状态',
        type: 'sql',
        sqlCode: 'SELECT status FROM users WHERE user_id = {userId}',
        successCondition: 'has_data',
        dataPoolId: 'pool1',
        createdAt: '2024-01-14T14:20:00Z',
        creator: 'admin',
    },
];

// 模拟执行历史
export const mockExecutionHistory = [
    {
        id: 'exec1',
        processId: '1',
        executedAt: '2024-01-15T10:30:00Z',
        status: 'success',
        executor: 'admin',
        duration: 4500,
        inputParams: '{"orderId": "ORDER001", "userId": "12345"}',
        result: {
            totalSteps: 6,
            successSteps: 6,
            failedSteps: 0,
            output: '{"status": "success", "data": {}}',
        },
    },
    {
        id: 'exec2',
        processId: '1',
        executedAt: '2024-01-15T09:15:00Z',
        status: 'failed',
        executor: 'admin',
        duration: 2500,
        inputParams: '{"orderId": "ORDER999", "userId": "99999"}',
        result: {
            totalSteps: 6,
            successSteps: 3,
            failedSteps: 1,
            error: '用户不存在',
            output: null,
        },
    },
];