import { Injectable, signal, computed } from '@angular/core';
import {
  TimeRange,
  RANGE_CONFIG,
  TrendSeries,
  KpiData,
  NamedValue,
  DashboardData,
} from '../models/dashboard.models';

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randF = (min: number, max: number, digits = 1) =>
  +(Math.random() * (max - min) + min).toFixed(digits);

@Injectable({ providedIn: 'root' })
export class MockDataService {
  /** 当前时间范围 */
  readonly range = signal<TimeRange>('realtime');

  /** 仪表盘数据（随范围与刷新更新） */
  readonly data = signal<DashboardData>(this.generate(this.range()));

  readonly rangeLabel = computed(() => RANGE_CONFIG[this.range()].label);

  /** 切换时间范围 */
  setRange(range: TimeRange): void {
    this.range.set(range);
    this.refresh();
  }

  /** 手动 / 定时刷新数据 */
  refresh(): void {
    this.data.set(this.generate(this.range()));
  }

  private xLabels(range: TimeRange): string[] {
    const { points } = RANGE_CONFIG[range];
    const now = new Date();
    const labels: string[] = [];
    if (range === 'realtime') {
      for (let i = points - 1; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 60000);
        labels.push(
          String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
        );
      }
    } else if (range === 'today') {
      for (let i = 0; i < points; i++) labels.push(String(i).padStart(2, '0') + ':00');
    } else if (range === 'week') {
      labels.push('周一', '周二', '周三', '周四', '周五', '周六', '周日');
    } else {
      for (let i = 1; i <= points; i++) labels.push(i + '日');
    }
    return labels;
  }

  private genTrend(range: TimeRange): TrendSeries {
    const n = RANGE_CONFIG[range].points;
    const base =
      range === 'realtime' ? 60 : range === 'today' ? 300 : range === 'week' ? 2200 : 900;
    const pv: number[] = [];
    const uv: number[] = [];
    const sales: number[] = [];
    for (let i = 0; i < n; i++) {
      pv.push(rand(Math.floor(base * 0.5), base * 2));
      uv.push(rand(Math.floor(base * 0.3), base * 1.2));
      sales.push(rand(base * 2, base * 8));
    }
    return { pv, uv, sales };
  }

  private genKpi(): KpiData {
    return {
      pv: rand(120000, 380000),
      uv: rand(45000, 160000),
      sales: rand(800000, 4200000),
      conv: randF(1.8, 6.5, 2),
    };
  }

  private genSources(): NamedValue[] {
    return [
      { name: '搜索引擎', value: rand(20, 40) },
      { name: '直接访问', value: rand(15, 30) },
      { name: '社交媒体', value: rand(10, 25) },
      { name: '外部链接', value: rand(5, 15) },
      { name: '邮件营销', value: rand(3, 10) },
    ];
  }

  private genCategories(): NamedValue[] {
    return [
      '数码电子', '家居生活', '服饰鞋包', '美妆个护', '食品饮料', '图书文娱',
    ]
      .map((name) => ({ name, value: rand(5, 100) }))
      .sort((a, b) => b.value - a.value);
  }

  private genFunnel(): NamedValue[] {
    const visit = rand(100000, 200000);
    const steps = ['访问', '浏览商品', '加入购物车', '下单', '支付成功'];
    let prev = visit;
    return steps.map((name, i) => {
      const value = i === 0 ? visit : Math.floor(prev * randF(0.3, 0.6, 2));
      prev = value;
      return { name, value };
    });
  }

  private generate(range: TimeRange): DashboardData {
    return {
      kpi: this.genKpi(),
      labels: this.xLabels(range),
      trend: this.genTrend(range),
      sources: this.genSources(),
      categories: this.genCategories(),
      gauge: rand(45, 98),
      funnel: this.genFunnel(),
    };
  }
}
