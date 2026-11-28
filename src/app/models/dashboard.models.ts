/** 时间范围类型 */
export type TimeRange = 'realtime' | 'today' | 'week' | 'month';

export interface RangeConfig {
  points: number;
  label: string;
}

export const RANGE_CONFIG: Record<TimeRange, RangeConfig> = {
  realtime: { points: 30, label: '最近 30 分钟' },
  today: { points: 24, label: '今日 24 小时' },
  week: { points: 7, label: '本周' },
  month: { points: 30, label: '本月 30 天' },
};

export interface TrendSeries {
  pv: number[];
  uv: number[];
  sales: number[];
}

export interface KpiData {
  pv: number;
  uv: number;
  sales: number;
  conv: number;
}

export interface NamedValue {
  name: string;
  value: number;
}

export interface DashboardData {
  kpi: KpiData;
  labels: string[];
  trend: TrendSeries;
  sources: NamedValue[];
  categories: NamedValue[];
  gauge: number;
  funnel: NamedValue[];
}
