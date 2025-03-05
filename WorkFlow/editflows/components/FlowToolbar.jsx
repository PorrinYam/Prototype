import React from 'react';

const nodeTypes = [
  { type: 'start', label: '开始节点', color: '#4CAF50' },
  { type: 'task', label: '任务节点', color: '#2196F3' },
  { type: 'condition', label: '条件节点', color: '#FF9800' },
  { type: 'subflow', label: '子流程', color: '#9C27B0' },
  { type: 'end', label: '结束节点', color: '#F44336' },
];

const FlowToolbar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flow-toolbar" style={{ padding: '10px', background: 'white', borderRadius: '5px', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>节点类型</div>
      <div className="dndnode-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            className="dndnode"
            onDragStart={(event) => onDragStart(event, node.type)}
            draggable
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              background: node.color,
              color: 'white',
              cursor: 'grab',
              textAlign: 'center',
              fontSize: '12px',
            }}
          >
            {node.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowToolbar; 