import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

// 基础节点样式
const baseNodeStyle = {
  padding: '10px',
  borderRadius: '5px',
  width: '150px',
  fontSize: '12px',
  color: 'white',
  textAlign: 'center',
};

// 开始节点
const StartNode = ({ data }) => {
  const style = {
    ...baseNodeStyle,
    background: '#4CAF50',
    border: '1px solid #2E7D32',
  };

  return (
    <div style={style}>
      <div>{data.label || '开始'}</div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
};

// 结束节点
const EndNode = ({ data }) => {
  const style = {
    ...baseNodeStyle,
    background: '#F44336',
    border: '1px solid #C62828',
  };

  return (
    <div style={style}>
      <div>{data.label || '结束'}</div>
      <Handle type="target" position={Position.Top} id="a" />
    </div>
  );
};

// 任务节点
const TaskNode = ({ data }) => {
  const style = {
    ...baseNodeStyle,
    background: '#2196F3',
    border: '1px solid #1565C0',
  };

  return (
    <div style={style}>
      <Handle type="target" position={Position.Top} id="a" />
      <div>{data.label || '任务'}</div>
      <div style={{ fontSize: '10px', marginTop: '5px' }}>
        {data.description || '执行任务'}
      </div>
      <Handle type="source" position={Position.Bottom} id="b" />
    </div>
  );
};

// 条件节点
const ConditionNode = ({ data }) => {
  const style = {
    ...baseNodeStyle,
    background: '#FF9800',
    border: '1px solid #EF6C00',
    transform: 'rotate(45deg)',
    width: '100px',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const contentStyle = {
    transform: 'rotate(-45deg)',
    width: '100%',
  };

  return (
    <div style={style}>
      <Handle
        type="target"
        position={Position.Top}
        id="a"
        style={{ transform: 'rotate(-45deg)', top: '-15px' }}
      />
      <div style={contentStyle}>
        <div>{data.label || '条件'}</div>
        <div style={{ fontSize: '10px', marginTop: '5px' }}>
          {data.condition || '判断条件'}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        style={{ transform: 'rotate(-45deg)', right: '-15px' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="c"
        style={{ transform: 'rotate(-45deg)', bottom: '-15px' }}
      />
    </div>
  );
};

// 子流程节点
const SubflowNode = ({ data }) => {
  const style = {
    ...baseNodeStyle,
    background: '#9C27B0',
    border: '1px solid #6A1B9A',
  };

  return (
    <div style={style}>
      <Handle type="target" position={Position.Top} id="a" />
      <div>{data.label || '子流程'}</div>
      <div style={{ fontSize: '10px', marginTop: '5px' }}>
        {data.subflowId || '子流程ID'}
      </div>
      <Handle type="source" position={Position.Bottom} id="b" />
    </div>
  );
};

// 导出所有节点类型
export const nodeTypes = {
  start: memo(StartNode),
  end: memo(EndNode),
  task: memo(TaskNode),
  condition: memo(ConditionNode),
  subflow: memo(SubflowNode),
};

// 默认导出基础流程节点组件
const FlowNode = ({ type, data }) => {
  const NodeComponent = nodeTypes[type] || nodeTypes.task;
  return <NodeComponent data={data} />;
};

export default FlowNode; 