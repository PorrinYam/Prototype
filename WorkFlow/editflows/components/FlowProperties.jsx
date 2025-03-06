import React, { useState, useEffect } from 'react';

const FlowProperties = ({ element, onChange }) => {
  const [properties, setProperties] = useState({});
  const isEdge = !!element.source;

  useEffect(() => {
    if (element) {
      setProperties({
        id: element.id,
        ...(element.data || {}),
        ...(isEdge ? { 
          source: element.source, 
          target: element.target,
          type: element.type || 'default'
        } : { 
          type: element.type || 'task',
          position: element.position
        })
      });
    }
  }, [element, isEdge]);

  const handleChange = (key, value) => {
    const updatedProperties = { ...properties, [key]: value };
    setProperties(updatedProperties);
    
    // 构建更新后的元素
    const updatedElement = {
      ...element,
      data: {
        ...element.data,
        [key]: value
      }
    };
    
    if (onChange) {
      onChange(updatedElement);
    }
  };

  const renderNodeProperties = () => {
    switch (element.type) {
      case 'start':
        return (
          <>
            <div className="property-group">
              <label>标签</label>
              <input
                type="text"
                value={properties.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="开始"
              />
            </div>
          </>
        );
      
      case 'end':
        return (
          <>
            <div className="property-group">
              <label>标签</label>
              <input
                type="text"
                value={properties.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="结束"
              />
            </div>
          </>
        );
      
      case 'task':
        return (
          <>
            <div className="property-group">
              <label>标签</label>
              <input
                type="text"
                value={properties.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="任务"
              />
            </div>
            <div className="property-group">
              <label>描述</label>
              <textarea
                value={properties.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="任务描述"
              />
            </div>
            <div className="property-group">
              <label>执行人</label>
              <input
                type="text"
                value={properties.assignee || ''}
                onChange={(e) => handleChange('assignee', e.target.value)}
                placeholder="执行人"
              />
            </div>
          </>
        );
      
      case 'condition':
        return (
          <>
            <div className="property-group">
              <label>标签</label>
              <input
                type="text"
                value={properties.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="条件"
              />
            </div>
            <div className="property-group">
              <label>条件表达式</label>
              <textarea
                value={properties.condition || ''}
                onChange={(e) => handleChange('condition', e.target.value)}
                placeholder="条件表达式"
              />
            </div>
          </>
        );
      
      case 'subflow':
        return (
          <>
            <div className="property-group">
              <label>标签</label>
              <input
                type="text"
                value={properties.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="子流程"
              />
            </div>
            <div className="property-group">
              <label>子流程ID</label>
              <input
                type="text"
                value={properties.subflowId || ''}
                onChange={(e) => handleChange('subflowId', e.target.value)}
                placeholder="子流程ID"
              />
            </div>
          </>
        );
      
      default:
        return (
          <div className="property-group">
            <label>标签</label>
            <input
              type="text"
              value={properties.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
              placeholder="标签"
            />
          </div>
        );
    }
  };

  const renderEdgeProperties = () => {
    return (
      <>
        <div className="property-group">
          <label>标签</label>
          <input
            type="text"
            value={properties.label || ''}
            onChange={(e) => handleChange('label', e.target.value)}
            placeholder="连接标签"
          />
        </div>
        <div className="property-group">
          <label>类型</label>
          <select
            value={properties.type || 'default'}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="default">默认</option>
            <option value="straight">直线</option>
            <option value="condition">条件线</option>
          </select>
        </div>
        <div className="property-group">
          <label>条件</label>
          <input
            type="text"
            value={properties.condition || ''}
            onChange={(e) => handleChange('condition', e.target.value)}
            placeholder="条件表达式"
          />
        </div>
      </>
    );
  };

  if (!element) {
    return null;
  }

  return (
    <div className="flow-properties" style={{ 
      padding: '15px', 
      background: 'white', 
      borderLeft: '1px solid #ddd',
      width: '250px',
      height: '100%',
      position: 'absolute',
      right: 0,
      top: 0,
      overflowY: 'auto'
    }}>
      <h3 style={{ margin: '0 0 15px 0' }}>
        {isEdge ? '连接属性' : '节点属性'}
      </h3>
      <div className="property-group">
        <label>ID</label>
        <input type="text" value={properties.id || ''} disabled />
      </div>
      {isEdge ? renderEdgeProperties() : renderNodeProperties()}
    </div>
  );
};

export default FlowProperties; 