import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

/**
 * 通用 ECharts 图表容器组件：
 * 传入图表配置 option，自动初始化、更新与销毁
 */
@Component({
  selector: 'app-chart',
  imports: [],
  template: `<div #container class="chart"></div>`,
  styles: [`
    .chart { width: 100%; height: 300px; }
  `],
})
export class ChartComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;

  @Input() option: any;

  private instance: any = null;
  private resizeObserver: ResizeObserver | null = null;

  ngOnInit(): void {
    try {
      this.instance = echarts.init(this.container.nativeElement);
      this.resizeObserver = new ResizeObserver(() => this.instance?.resize());
      this.resizeObserver.observe(this.container.nativeElement);
      if (this.option) this.instance.setOption(this.option);
    } catch (e) {
      console.error('图表初始化失败:', e);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['option'] && this.instance && this.option) {
      this.instance.setOption(this.option, true);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.instance?.dispose();
  }
}
