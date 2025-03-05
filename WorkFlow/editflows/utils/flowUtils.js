// 生成唯一ID
const generateId = (prefix = '') => {
  return `${prefix}${Math.random().toString(36).substr(2, 9)}`;
};

// 创建新节点
const createNode = (type, position, data = {}) => {
  const nodeDefaults = getNodeDefaults(type);
  
  return {
    id: generateId(`node_${type}_`),
    type,
    position,
    data: {
      ...nodeDefaults,
      ...data,
    },
  };
};

// 创建新连接
const createEdge = (source, target, type = 'default', data = {}) => {
  return {
    id: generateId(`edge_`),
    source,
    target,
    type,
    data: {
      ...data,
    },
  };
};

// 获取节点默认属性
const getNodeDefaults = (type) => {
  switch (type) {
    case 'start':
      return {
        label: '开始',
      };
    case 'end':
      return {
        label: '结束',
      };
    case 'task':
      return {
        label: '任务',
        description: '执行任务',
        assignee: '',
      };
    case 'condition':
      return {
        label: '条件',
        condition: '',
      };
    case 'subflow':
      return {
        label: '子流程',
        subflowId: '',
      };
    default:
      return {
        label: '节点',
      };
  }
};

// 导出流程为JSON
const exportFlow = (flow) => {
  return JSON.stringify(flow, null, 2);
};

// 导入流程
const importFlow = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('导入流程失败:', error);
    return null;
  }
};

// 验证流程是否有效
const validateFlow = (nodes, edges) => {
  const errors = [];
  
  // 检查是否有开始节点
  const startNodes = nodes.filter(node => node.type === 'start');
  if (startNodes.length === 0) {
    errors.push('流程必须包含一个开始节点');
  } else if (startNodes.length > 1) {
    errors.push('流程只能包含一个开始节点');
  }
  
  // 检查是否有结束节点
  const endNodes = nodes.filter(node => node.type === 'end');
  if (endNodes.length === 0) {
    errors.push('流程必须包含至少一个结束节点');
  }
  
  // 检查节点是否都有连接
  nodes.forEach(node => {
    if (node.type !== 'end') {
      const hasOutgoingEdge = edges.some(edge => edge.source === node.id);
      if (!hasOutgoingEdge) {
        errors.push(`节点 "${node.data?.label || node.id}" 没有出口连接`);
      }
    }
    
    if (node.type !== 'start') {
      const hasIncomingEdge = edges.some(edge => edge.target === node.id);
      if (!hasIncomingEdge) {
        errors.push(`节点 "${node.data?.label || node.id}" 没有入口连接`);
      }
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// 创建示例流程
const createSampleFlow = () => {
  const startNode = createNode('start', { x: 250, y: 50 });
  const taskNode1 = createNode('task', { x: 250, y: 150 }, { label: '审批申请', description: '审批用户提交的申请' });
  const conditionNode = createNode('condition', { x: 250, y: 250 }, { label: '是否通过', condition: 'approved === true' });
  const taskNode2 = createNode('task', { x: 100, y: 350 }, { label: '拒绝申请', description: '拒绝用户的申请' });
  const taskNode3 = createNode('task', { x: 400, y: 350 }, { label: '处理申请', description: '处理用户的申请' });
  const endNode1 = createNode('end', { x: 100, y: 450 }, { label: '结束(拒绝)' });
  const endNode2 = createNode('end', { x: 400, y: 450 }, { label: '结束(通过)' });
  
  const nodes = [startNode, taskNode1, conditionNode, taskNode2, taskNode3, endNode1, endNode2];
  
  const edge1 = createEdge(startNode.id, taskNode1.id);
  const edge2 = createEdge(taskNode1.id, conditionNode.id);
  const edge3 = createEdge(conditionNode.id, taskNode2.id, 'condition', { label: '否' });
  const edge4 = createEdge(conditionNode.id, taskNode3.id, 'condition', { label: '是' });
  const edge5 = createEdge(taskNode2.id, endNode1.id);
  const edge6 = createEdge(taskNode3.id, endNode2.id);
  
  const edges = [edge1, edge2, edge3, edge4, edge5, edge6];
  
  return {
    name: '示例审批流程',
    description: '这是一个简单的审批流程示例',
    nodes,
    edges,
  };
};

// 导出工具函数
const flowUtils = {
  generateId,
  createNode,
  createEdge,
  getNodeDefaults,
  exportFlow,
  importFlow,
  validateFlow,
  createSampleFlow,
};

export default flowUtils; 