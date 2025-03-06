# 流程设计向导模块 (EditFlows)

这是一个用于创建和编辑工作流程的可视化设计器模块。它允许用户通过拖放操作创建流程图，定义节点和连接，并设置各种属性。

## 功能特点

- 拖放式流程设计界面
- 支持多种节点类型（开始、结束、任务、条件、子流程）
- 可自定义节点和连接属性
- 流程验证功能
- 导入/导出流程定义
- 响应式设计

## 安装

```bash
# 如果您使用npm
npm install react-flow-renderer

# 如果您使用yarn
yarn add react-flow-renderer
```

## 使用方法

### 基本用法

```jsx
import React from 'react';
import { FlowDesigner } from '../editflows';

const MyFlowDesignerPage = () => {
  const handleSave = (flowData) => {
    console.log('保存的流程数据:', flowData);
    // 在这里处理保存逻辑
  };

  return (
    <div style={{ width: '100%', height: '800px' }}>
      <FlowDesigner onSave={handleSave} />
    </div>
  );
};

export default MyFlowDesignerPage;
```

### 使用自定义Hook

```jsx
import React from 'react';
import { useFlowDesigner } from '../editflows';

const MyCustomFlowDesigner = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNode,
    removeNode,
    getFlowData,
    validateFlow
  } = useFlowDesigner();

  const handleSave = () => {
    const { valid, errors } = validateFlow();
    if (valid) {
      const flowData = getFlowData();
      console.log('保存的流程数据:', flowData);
      // 在这里处理保存逻辑
    } else {
      console.error('流程验证失败:', errors);
      // 显示错误信息
    }
  };

  return (
    <div>
      {/* 在这里实现自定义流程设计器UI */}
      <button onClick={handleSave}>保存流程</button>
    </div>
  );
};

export default MyCustomFlowDesigner;
```

### 加载现有流程

```jsx
import React from 'react';
import { FlowDesigner } from '../editflows';
import { flowUtils } from '../editflows';

const EditExistingFlow = () => {
  // 创建示例流程或加载现有流程
  const sampleFlow = flowUtils.createSampleFlow();
  
  const handleSave = (flowData) => {
    console.log('更新的流程数据:', flowData);
    // 在这里处理保存逻辑
  };

  return (
    <div style={{ width: '100%', height: '800px' }}>
      <FlowDesigner 
        initialNodes={sampleFlow.nodes} 
        initialEdges={sampleFlow.edges} 
        onSave={handleSave} 
      />
    </div>
  );
};

export default EditExistingFlow;
```

## 组件API

### FlowDesigner

主要的流程设计器组件。

| 属性 | 类型 | 描述 |
|------|------|------|
| initialNodes | Array | 初始节点数组 |
| initialEdges | Array | 初始连接数组 |
| onSave | Function | 保存流程时的回调函数 |

### useFlowDesigner

用于管理流程设计器状态的自定义Hook。

| 返回值 | 类型 | 描述 |
|------|------|------|
| nodes | Array | 当前节点数组 |
| edges | Array | 当前连接数组 |
| onNodesChange | Function | 节点变化处理函数 |
| onEdgesChange | Function | 连接变化处理函数 |
| onConnect | Function | 连接节点处理函数 |
| addNode | Function | 添加节点函数 |
| updateNode | Function | 更新节点函数 |
| removeNode | Function | 删除节点函数 |
| updateEdge | Function | 更新连接函数 |
| removeEdge | Function | 删除连接函数 |
| selectElement | Function | 选择元素函数 |
| clearSelection | Function | 清除选择函数 |
| getFlowData | Function | 获取当前流程数据函数 |
| resetFlow | Function | 重置流程函数 |
| validateFlow | Function | 验证流程函数 |

## 工具函数

`flowUtils` 提供了一系列用于处理流程的工具函数。

| 函数 | 描述 |
|------|------|
| createNode | 创建新节点 |
| createEdge | 创建新连接 |
| exportFlow | 导出流程为JSON |
| importFlow | 导入流程 |
| validateFlow | 验证流程是否有效 |
| createSampleFlow | 创建示例流程 |

## 依赖项

- React 16.8+
- ReactFlow
- 现代浏览器支持 (Chrome, Firefox, Safari, Edge) 