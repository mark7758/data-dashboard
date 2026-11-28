# 数据可视化分析仪表盘

基于 **Angular 20 + ECharts 5** 的数据可视化全动态仪表盘，内置模拟数据源，开箱即用。

## 功能特性

- **多图表联动**：折线图（访问趋势）、环形图（流量来源）、横向条形图（品类排行）、仪表盘（目标完成率）、漏斗图（转化漏斗）
- **KPI 指标卡**：环比涨跌标识
- **时间范围切换**：实时 / 今日 / 本周 / 本月，一键重新生成数据
- **实时刷新**：实时模式下每 5 秒自动刷新，支持手动刷新
- **响应式布局**：自适应桌面与移动端
- 深色科技风 UI，ECharts 本地内置（离线可用）

## 快速开始

```bash
npm install        # 安装依赖（国内已配置 npmmirror 镜像）
npm start          # 启动开发服务器 http://localhost:4200
```

生产构建：

```bash
npm run build      # 产物输出到 dist/data-dashboard/browser
```

## 架构说明

```
src/app/
├── models/dashboard.models.ts    # 数据模型与类型定义
├── services/mock-data.service.ts # 模拟数据源（signal 响应式状态）
├── chart-options.ts              # 各图表的 ECharts 配置工厂（纯函数）
├── components/
│   ├── header.component.ts       # 头部：时间范围切换 + 实时时钟
│   ├── kpi-card.component.ts     # KPI 指标卡
│   └── chart.component.ts        # 通用 ECharts 容器组件
├── app.ts / app.html             # 根组件：组合布局与数据流
└── ...
public/echarts.min.js             # 本地内置 ECharts（离线可用）
legacy/                           # 重构前的原生 JS 版本（仅存档参考）
```

### 设计要点

- **响应式数据流**：`MockDataService` 以 Angular signal 持有仪表盘状态，
  组件通过 computed 派生图表配置，数据变更自动刷新视图
- **组件化**：图表容器、KPI 卡片、头部均为独立组件（standalone），可复用可测试
- **纯函数配置**：图表 option 由纯函数生成，与组件解耦，便于单测与维护

## 接入真实数据

所有数据由 `MockDataService` 的私有方法生成（`genKpi` / `genTrend` / `genSources` 等），
将该服务中的方法替换为真实 HTTP 请求（如 HttpClient）即可接入生产数据。

## License

MIT
