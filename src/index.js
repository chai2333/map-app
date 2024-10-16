import React from 'react';
import ReactDOM from 'react-dom/client';  // 引入 React 18 的 createRoot
import App from './App';
import './index.css';

// 获取根节点
const root = ReactDOM.createRoot(document.getElementById('root'));

// 使用 createRoot 渲染应用
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
