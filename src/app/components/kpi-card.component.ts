import { Component, Input, numberAttribute } from '@angular/core';

/**
 * KPI 指标卡：展示标签、数值与环比涨跌
 */
@Component({
  selector: 'app-kpi-card',
  imports: [],
  template: `
    <div class="kpi-card">
      <div class="kpi-label">{{ label }}</div>
      <div class="kpi-value">{{ value }}</div>
      @if (trend !== null) {
        <div class="kpi-trend" [class.up]="trend >= 0" [class.down]="trend < 0">
          {{ trend >= 0 ? '▲ +' : '▼ ' }}{{ trend.toFixed(1) }}% 较上一时段
        </div>
      } @else {
        <div class="kpi-trend">--</div>
      }
    </div>
  `,
  styles: [`
    .kpi-card {
      background: var(--panel); border: 1px solid var(--panel-border);
      border-radius: 10px; padding: 16px 20px;
      transition: transform .2s, box-shadow .2s;
    }
    .kpi-card:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(79,195,247,.15); }
    .kpi-label { color: var(--text-dim); font-size: 13px; margin-bottom: 8px; }
    .kpi-value { font-size: 28px; font-weight: bold; font-family: Consolas, monospace; }
    .kpi-trend { margin-top: 6px; font-size: 12px; color: var(--text-dim); }
    .kpi-trend.up { color: var(--green); }
    .kpi-trend.down { color: var(--red); }
  `],
})
export class KpiCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string;
  @Input({ transform: numberAttribute }) trend: number | null = null;
}
