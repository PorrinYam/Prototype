import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import FlowToolbar from './FlowToolbar';
import FlowProperties from './FlowProperties';
import { nodeTypes } from './FlowNode';
import { edgeTypes } from './FlowConnection';
import flowUtils from '../utils/flowUtils';

const FlowDesigner = ({ initialNodes = [], initialEdges = [], onSave }) => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      
      const newNode = flowUtils.createNode(type, position);
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onElementClick = (event, element) => {
    setSelectedElement(element);
  };

  const onPaneClick = () => {
    setSelectedElement(null);
  };

  const onSaveFlow = () => {
    if (onSave) {
      onSave({
        nodes,
        edges,
      });
    }
  };

  return (
    <div className="flow-designer-container" style={{ width: '100%', height: '100%' }}>
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onElementClick}
            onEdgeClick={onElementClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
          >
            <Controls />
            <Background variant="dots" gap={12} size={1} />
            <Panel position="top-left">
              <FlowToolbar />
            </Panel>
          </ReactFlow>
        </div>
        {selectedElement && (
          <FlowProperties 
            element={selectedElement} 
            onChange={(updatedElement) => {
              if (updatedElement.source) { // 是边
                setEdges(edges.map(edge => 
                  edge.id === updatedElement.id ? updatedElement : edge
                ));
              } else { // 是节点
                setNodes(nodes.map(node => 
                  node.id === updatedElement.id ? updatedElement : node
                ));
              }
            }}
          />
        )}
        <div className="flow-actions">
          <button onClick={onSaveFlow} className="save-button">
            保存流程
          </button>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowDesigner; 