import { DashboardData } from './models/dashboard.models';

/** ECharts 深色主题公共配置 */
const TOOLTIP = {
  trigger: 'axis',
  backgroundColor: '#1b2745',
  borderColor: '#33436e',
  textStyle: { color: '#e6ecf5' },
};

const AXIS = {
  axisLine: { lineStyle: { color: '#33436e' } },
  axisLabel: { color: '#8b98b8', fontSize: 11 },
  splitLine: { lineStyle: { color: '#1e2a48' } },
};

const PALETTE = ['#4fc3f7', '#a78bfa', '#34d399', '#fbbf24', '#f87171'];

/** 访问趋势：双轴折线 + 柱状 */
export function trendOption(d: DashboardData): any {
  return {
    tooltip: TOOLTIP,
    legend: { data: ['PV', 'UV', '销售额'], textStyle: { color: '#8b98b8' }, top: 0 },
    grid: { left: 50, right: 50, top: 40, bottom: 30 },
    xAxis: { type: 'category', data: d.labels, ...AXIS },
    yAxis: [
      { type: 'value', name: '流量', ...AXIS },
      { type: 'value', name: '销售额', ...AXIS, splitLine: { show: false } },
    ],
    series: [
      {
        name: 'PV', type: 'line', smooth: true, data: d.trend.pv, symbolSize: 5,
        lineStyle: { color: '#4fc3f7' }, itemStyle: { color: '#4fc3f7' },
        areaStyle: { color: 'rgba(79,195,247,0.15)' },
      },
      {
        name: 'UV', type: 'line', smooth: true, data: d.trend.uv, symbolSize: 5,
        lineStyle: { color: '#a78bfa' }, itemStyle: { color: '#a78bfa' },
        areaStyle: { color: 'rgba(167,139,250,0.12)' },
      },
      {
        name: '销售额', type: 'bar', yAxisIndex: 1, data: d.trend.sales,
        itemStyle: { color: 'rgba(52,211,153,0.55)', borderRadius: [3, 3, 0, 0] },
      },
    ],
  };
}

/** 流量来源占比：环形图 */
export function sourceOption(d: DashboardData): any {
  return {
    tooltip: { ...TOOLTIP, trigger: 'item', formatter: '{b}: {c}% ({d}%)' },
    legend: { bottom: 0, textStyle: { color: '#8b98b8' }, itemWidth: 12, itemHeight: 12 },
    series: [{
      type: 'pie',
      radius: ['40%', '68%'],
      center: ['50%', '46%'],
      itemStyle: { borderColor: '#16213a', borderWidth: 2, borderRadius: 6 },
      label: { color: '#e6ecf5', formatter: '{b}\n{d}%' },
      data: d.sources,
      color: PALETTE,
    }],
  };
}

/** 品类销售排行：横向渐变条形图 */
export function barOption(d: DashboardData): any {
  const cats = d.categories;
  return {
    tooltip: { ...TOOLTIP, trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 80, right: 30, top: 20, bottom: 30 },
    xAxis: { type: 'value', ...AXIS },
    yAxis: { type: 'category', data: cats.map((c) => c.name), ...AXIS },
    series: [{
      type: 'bar',
      data: cats.map((c) => c.value),
      barWidth: 16,
      itemStyle: {
        borderRadius: [0, 6, 6, 0],
        color: {
          type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: '#4fc3f7' },
            { offset: 1, color: '#a78bfa' },
          ],
        },
      },
      label: { show: true, position: 'right', color: '#8b98b8', fontSize: 11 },
    }],
  };
}

/** 目标完成率：仪表盘 */
export function gaugeOption(d: DashboardData): any {
  return {
    series: [{
      type: 'gauge',
      startAngle: 210,
      endAngle: -30,
      min: 0,
      max: 100,
      progress: { show: true, width: 12, itemStyle: { color: '#34d399' } },
      axisLine: { lineStyle: { width: 12, color: [[1, '#253357']] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      pointer: { show: false },
      anchor: { show: false },
      detail: {
        valueAnimation: true,
        fontSize: 30,
        color: '#e6ecf5',
        offsetCenter: [0, 0],
        formatter: '{value}%',
      },
      data: [{ value: d.gauge }],
    }],
  };
}

/** 转化漏斗 */
export function funnelOption(d: DashboardData): any {
  return {
    tooltip: { ...TOOLTIP, trigger: 'item', formatter: '{b}: {c}' },
    series: [{
      type: 'funnel',
      left: '10%',
      width: '80%',
      top: 10,
      bottom: 10,
      minSize: '20%',
      gap: 4,
      label: { color: '#e6ecf5', formatter: '{b}' },
      itemStyle: { borderRadius: 4 },
      data: d.funnel,
      color: ['#4fc3f7', '#60a5fa', '#a78bfa', '#fbbf24', '#34d399'],
    }],
  };
}
