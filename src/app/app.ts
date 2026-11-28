import { Component, computed, signal } from '@angular/core';
import { MockDataService } from './services/mock-data.service';
import { DashboardData, KpiData } from './models/dashboard.models';
import {
  trendOption,
  sourceOption,
  barOption,
  gaugeOption,
  funnelOption,
} from './chart-options';
import { HeaderComponent } from './components/header.component';
import { KpiCardComponent } from './components/kpi-card.component';
import { ChartComponent } from './components/chart.component';

const fmtInt = (v: number) => Math.floor(v).toLocaleString();

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, KpiCardComponent, ChartComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  /** 上一次 KPI 数据（用于计算环比）；注意不能在 computed 内写 signal，故使用普通字段 */
  private prevKpi: KpiData | null = null;

  readonly lastUpdate = signal('');

  readonly trendOpt = computed(() => trendOption(this.data.data()));
  readonly sourceOpt = computed(() => sourceOption(this.data.data()));
  readonly barOpt = computed(() => barOption(this.data.data()));
  readonly gaugeOpt = computed(() => gaugeOption(this.data.data()));
  readonly funnelOpt = computed(() => funnelOption(this.data.data()));

  readonly kpis = computed(() => {
    const d: DashboardData = this.data.data();
    const prev = this.prevKpi;
    const trendOf = (now: number, before: number | undefined) =>
      prev && before ? +(((now - before) / (before || 1)) * 100).toFixed(1) : null;
    const cards = [
      { label: '总访问量 (PV)', value: fmtInt(d.kpi.pv), trend: trendOf(d.kpi.pv, prev?.pv) },
      { label: '独立访客 (UV)', value: fmtInt(d.kpi.uv), trend: trendOf(d.kpi.uv, prev?.uv) },
      { label: '销售额', value: '¥' + fmtInt(d.kpi.sales), trend: trendOf(d.kpi.sales, prev?.sales) },
      { label: '转化率', value: d.kpi.conv.toFixed(2) + '%', trend: trendOf(d.kpi.conv, prev?.conv) },
    ];
    return cards;
  });

  constructor(protected readonly data: MockDataService) {
    this.refresh();
    // 实时模式每 5 秒自动刷新
    setInterval(() => {
      if (this.data.range() === 'realtime') this.refresh();
    }, 5000);
  }

  protected refresh(): void {
    this.prevKpi = this.data.data().kpi;
    this.data.refresh();
    this.lastUpdate.set(
      '数据更新于 ' + new Date().toLocaleTimeString('zh-CN') + ' · ' + this.data.rangeLabel()
    );
  }
}
