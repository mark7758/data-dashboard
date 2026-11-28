import { Component, signal } from '@angular/core';
import { TimeRange } from '../models/dashboard.models';
import { MockDataService } from '../services/mock-data.service';

@Component({
  selector: 'app-header',
  imports: [],
  template: `
    <header class="header">
      <h1>📊 数据可视化分析仪表盘</h1>
      <div class="header-right">
        <div class="time-range">
          @for (r of ranges; track r.key) {
            <button
              class="range-btn"
              [class.active]="r.key === data.range()"
              (click)="data.setRange(r.key)"
            >{{ r.label }}</button>
          }
        </div>
        <div class="clock">{{ now() }}</div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 12px;
      padding: 14px 20px;
      background: var(--panel); border: 1px solid var(--panel-border);
      border-radius: 10px; margin-bottom: 16px;
    }
    h1 {
      font-size: 20px; letter-spacing: 2px;
      background: linear-gradient(90deg, #4fc3f7, #a78bfa);
      -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .header-right { display: flex; align-items: center; gap: 16px; }
    .time-range { display: flex; background: #0f1830; border-radius: 8px; padding: 3px; }
    .range-btn {
      background: transparent; color: var(--text-dim); border: none;
      padding: 6px 14px; border-radius: 6px; cursor: pointer;
      font-size: 13px; transition: all .2s;
    }
    .range-btn.active { background: var(--accent); color: #062032; font-weight: bold; }
    .clock { font-family: Consolas, monospace; color: var(--accent); font-size: 15px; }
    @media (max-width: 768px) { .header-right { width: 100%; justify-content: space-between; } }
  `],
})
export class HeaderComponent {
  protected readonly ranges: { key: TimeRange; label: string }[] = [
    { key: 'realtime', label: '实时' },
    { key: 'today', label: '今日' },
    { key: 'week', label: '本周' },
    { key: 'month', label: '本月' },
  ];

  protected readonly now = signal('');

  constructor(protected readonly data: MockDataService) {
    this.tick();
  }

  private tick(): void {
    const fmt = (d: Date) =>
      d.toLocaleDateString('zh-CN') + ' ' + d.toLocaleTimeString('zh-CN');
    this.now.set(fmt(new Date()));
    setInterval(() => this.now.set(fmt(new Date())), 1000);
  }
}
