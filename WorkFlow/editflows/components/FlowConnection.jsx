import React from 'react';
import { 
  BaseEdge, 
  EdgeLabelRenderer,
  getBezierPath,
  getStraightPath,
  getEdgeCenter
} from 'reactflow';

// 默认连接线
const DefaultEdge = ({ 
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 500,
              border: '1px solid #ccc',
              pointerEvents: 'all',
              cursor: 'pointer',
            }}
            className="nodrag nopan"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

// 直线连接
const StraightEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data
}) => {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 500,
              border: '1px solid #ccc',
              pointerEvents: 'all',
              cursor: 'pointer',
            }}
            className="nodrag nopan"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

// 条件连接线
const ConditionEdge = (props) => {
  const { data = {} } = props;
  const style = {
    stroke: '#FF9800',
    strokeWidth: 2,
    ...props.style,
  };

  return <DefaultEdge {...props} style={style} />;
};

// 导出所有边类型
export const edgeTypes = {
  default: DefaultEdge,
  straight: StraightEdge,
  condition: ConditionEdge,
};

// 默认导出基础流程连接组件
const FlowConnection = ({ type, ...props }) => {
  const EdgeComponent = edgeTypes[type] || edgeTypes.default;
  return <EdgeComponent {...props} />;
};

export default FlowConnection; 