import { mockProcesses, mockRules, mockExecutionHistory } from './mockData';

// 模拟API延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    // 流程相关API
    getProcessList: async () => {
        await delay(500);
        return mockProcesses;
    },

    getProcessById: async (id) => {
        await delay(300);
        return mockProcesses.find(p => p.id === id);
    },

    createProcess: async (data) => {
        await delay(800);
        const newProcess = {
            id: `process_${Date.now()}`,
            ...data,
            status: 'draft',
            nodeCount: 0,
            createdAt: new Date().toISOString(),
        };
        // 模拟添加到列表
        mockProcesses.unshift(newProcess);
        return newProcess;
    },

    updateProcess: async (id, data) => {
        await delay(500);
        const index = mockProcesses.findIndex(p => p.id === id);
        if (index !== -1) {
            mockProcesses[index] = { ...mockProcesses[index], ...data };
        }
        return mockProcesses[index];
    },

    deleteProcess: async (id) => {
        await delay(500);
        const index = mockProcesses.findIndex(p => p.id === id);
        if (index !== -1) {
            mockProcesses.splice(index, 1);
        }
        return { success: true };
    },

    // 规则相关API
    getRules: async () => {
        await delay(500);
        return mockRules;
    },

    createRule: async (data) => {
        await delay(800);
        const newRule = {
            id: `rule_${Date.now()}`,
            ...data,
            createdAt: new Date().toISOString(),
        };
        mockRules.unshift(newRule);
        return newRule;
    },

    // 执行相关API
    runProcess: async (processId, params) => {
        await delay(2000);
        return {
            executionId: `exec_${Date.now()}`,
            processId,
            status: 'success',
            startTime: new Date().toISOString(),
            duration: 4500,
            results: [
                { stepId: 'validate1', status: 'success', message: '订单存在性检查通过' },
                { stepId: 'validate2', status: 'success', message: '用户有效性检查通过' },
            ],
        };
    },

    getProcessHistory: async (processId) => {
        await delay(500);
        return mockExecutionHistory.filter(h => h.processId === processId);
    },

    // 路径查询API
    searchPaths: async (startNode, endNode) => {
        await delay(800);
        // 模拟返回多条路径
        return [
            {
                id: 'path1',
                name: '快速路径',
                steps: 3,
                nodes: ['start', 'validate1', 'validate3', 'end'],
                estimatedTime: '2.5s',
                successRate: '95%',
            },
            {
                id: 'path2',
                name: '标准路径',
                steps: 5,
                nodes: ['start', 'validate1', 'validate2', 'transform1', 'end'],
                estimatedTime: '4.2s',
                successRate: '98%',
            },
            {
                id: 'path3',
                name: '完整路径',
                steps: 6,
                nodes: ['start', 'validate1', 'validate2', 'validate3', 'transform1', 'end'],
                estimatedTime: '5.8s',
                successRate: '99%',
            },
        ];
    },
};

export default api;