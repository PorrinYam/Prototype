import { useState, useCallback } from 'react';
import { useNodesState, useEdgesState, addEdge } from 'reactflow';
import flowUtils from '../utils/flowUtils';

const useFlowDesigner = (initialFlow = { nodes: [], edges: [] }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow.edges || []);
  const [selectedElement, setSelectedElement] = useState(null);
  const [flowName, setFlowName] = useState(initialFlow.name || '新建流程');
  const [flowDescription, setFlowDescription] = useState(initialFlow.description || '');
  const [isModified, setIsModified] = useState(false);

  // 连接节点
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
    setIsModified(true);
  }, [setEdges]);

  // 添加节点
  const addNode = useCallback((type, position) => {
    const newNode = flowUtils.createNode(type, position);
    setNodes((nds) => nds.concat(newNode));
    setIsModified(true);
    return newNode;
  }, [setNodes]);

  // 更新节点
  const updateNode = useCallback((nodeId, data) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          };
        }
        return node;
      })
    );
    setIsModified(true);
  }, [setNodes]);

  // 删除节点
  const removeNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    // 同时删除与该节点相关的边
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
    setIsModified(true);
  }, [setNodes, setEdges]);

  // 更新边
  const updateEdge = useCallback((edgeId, data) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            data: {
              ...edge.data,
              ...data,
            },
          };
        }
        return edge;
      })
    );
    setIsModified(true);
  }, [setEdges]);

  // 删除边
  const removeEdge = useCallback((edgeId) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
    setIsModified(true);
  }, [setEdges]);

  // 选择元素
  const selectElement = useCallback((element) => {
    setSelectedElement(element);
  }, []);

  // 清除选择
  const clearSelection = useCallback(() => {
    setSelectedElement(null);
  }, []);

  // 获取当前流程数据
  const getFlowData = useCallback(() => {
    return {
      name: flowName,
      description: flowDescription,
      nodes,
      edges,
    };
  }, [flowName, flowDescription, nodes, edges]);

  // 重置流程
  const resetFlow = useCallback((flow = { nodes: [], edges: [] }) => {
    setNodes(flow.nodes || []);
    setEdges(flow.edges || []);
    setFlowName(flow.name || '新建流程');
    setFlowDescription(flow.description || '');
    setSelectedElement(null);
    setIsModified(false);
  }, [setNodes, setEdges]);

  // 验证流程
  const validateFlow = useCallback(() => {
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
  }, [nodes, edges]);

  return {
    // 状态
    nodes,
    edges,
    selectedElement,
    flowName,
    flowDescription,
    isModified,
    
    // 节点操作
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNode,
    removeNode,
    
    // 边操作
    updateEdge,
    removeEdge,
    
    // 选择操作
    selectElement,
    clearSelection,
    
    // 流程操作
    setFlowName,
    setFlowDescription,
    getFlowData,
    resetFlow,
    validateFlow,
  };
};

export default useFlowDesigner; 