/*
 * 数据可视化分析仪表盘
 * 基于 ECharts，模拟数据源 + 时间范围切换 + 实时自动刷新
 */
(function () {
  "use strict";

  /* ---------- 工具函数 ---------- */
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randF = (min, max, digits = 1) =>
    +(Math.random() * (max - min) + min).toFixed(digits);

  /* ---------- 模拟数据源 ---------- */
  const RANGES = {
    realtime: { points: 30, label: "最近 30 分钟" },
    today: { points: 24, label: "今日 24 小时" },
    week: { points: 7, label: "本周" },
    month: { points: 30, label: "本月 30 天" },
  };

  function xLabels(range) {
    const cfg = RANGES[range];
    const now = new Date();
    const labels = [];
    if (range === "realtime") {
      for (let i = cfg.points - 1; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 60000);
        labels.push(String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"));
      }
    } else if (range === "today") {
      for (let i = 0; i < cfg.points; i++) labels.push(String(i).padStart(2, "0") + ":00");
    } else if (range === "week") {
      labels.push("周一", "周二", "周三", "周四", "周五", "周六", "周日");
    } else {
      for (let i = 1; i <= cfg.points; i++) labels.push(i + "日");
    }
    return labels;
  }

  function genSeries(range) {
    const n = RANGES[range].points;
    const pv = [], uv = [], sales = [];
    for (let i = 0; i < n; i++) {
      const base = range === "realtime" ? 60 : range === "today" ? 300 : range === "week" ? 2200 : 900;
      pv.push(rand(Math.floor(base * 0.5), base * 2));
      uv.push(rand(Math.floor(base * 0.3), base * 1.2));
      sales.push(rand(Math.floor(base * 2), base * 8));
    }
    return { pv, uv, sales };
  }

  function genKpi() {
    return {
      pv: rand(120000, 380000),
      uv: rand(45000, 160000),
      sales: rand(800000, 4200000),
      conv: randF(1.8, 6.5, 2),
    };
  }

  function genSources() {
    return [
      { name: "搜索引擎", value: rand(20, 40) },
      { name: "直接访问", value: rand(15, 30) },
      { name: "社交媒体", value: rand(10, 25) },
      { name: "外部链接", value: rand(5, 15) },
      { name: "邮件营销", value: rand(3, 10) },
    ];
  }

  function genCategories() {
    return ["数码电子", "家居生活", "服饰鞋包", "美妆个护", "食品饮料", "图书文娱"]
      .map((name) => ({ name, value: rand(5, 100) }))
      .sort((a, b) => b.value - a.value);
  }

  function genFunnel() {
    const visit = rand(100000, 200000);
    return [
      { name: "访问", value: visit },
      { name: "浏览商品", value: Math.floor(visit * randF(0.5, 0.7, 2)) },
      { name: "加入购物车", value: 0 },
      { name: "下单", value: 0 },
      { name: "支付成功", value: 0 },
    ].map((item, i, arr) => {
      if (i === 0) return item;
      const prev = arr[i - 1].value || visit;
      item.value = Math.floor(prev * randF(0.3, 0.6, 2));
      return item;
    });
  }

  /* ---------- 基础图表配置 ---------- */
  const baseTooltip = { trigger: "axis", backgroundColor: "#1b2745", borderColor: "#33436e", textStyle: { color: "#e6ecf5" } };
  const baseAxis = {
    axisLine: { lineStyle: { color: "#33436e" } },
    axisLabel: { color: "#8b98b8", fontSize: 11 },
    splitLine: { lineStyle: { color: "#1e2a48" } },
  };

  /* ---------- 图表初始化 ---------- */
  const charts = {
    trend: echarts.init(document.getElementById("trendChart")),
    source: echarts.init(document.getElementById("sourceChart")),
    bar: echarts.init(document.getElementById("barChart")),
    gauge: echarts.init(document.getElementById("gaugeChart")),
    funnel: echarts.init(document.getElementById("funnelChart")),
  };

  let currentRange = "realtime";
  let kpi = genKpi();

  function renderTrend() {
    const labels = xLabels(currentRange);
    const s = genSeries(currentRange);
    charts.trend.setOption({
      tooltip: baseTooltip,
      legend: { data: ["PV", "UV", "销售额"], textStyle: { color: "#8b98b8" }, top: 0 },
      grid: { left: 50, right: 50, top: 40, bottom: 30 },
      xAxis: { type: "category", data: labels, ...baseAxis },
      yAxis: [
        { type: "value", name: "流量", ...baseAxis },
        { type: "value", name: "销售额", ...baseAxis, splitLine: { show: false } },
      ],
      series: [
        { name: "PV", type: "line", smooth: true, data: s.pv, symbolSize: 5,
          lineStyle: { color: "#4fc3f7" }, itemStyle: { color: "#4fc3f7" },
          areaStyle: { color: "rgba(79,195,247,0.15)" } },
        { name: "UV", type: "line", smooth: true, data: s.uv, symbolSize: 5,
          lineStyle: { color: "#a78bfa" }, itemStyle: { color: "#a78bfa" },
          areaStyle: { color: "rgba(167,139,250,0.12)" } },
        { name: "销售额", type: "bar", yAxisIndex: 1, data: s.sales,
          itemStyle: { color: "rgba(52,211,153,0.55)", borderRadius: [3, 3, 0, 0] } },
      ],
    }, true);
  }

  function renderSource() {
    charts.source.setOption({
      tooltip: { trigger: "item", ...baseTooltip, formatter: "{b}: {c}% ({d}%)" },
      legend: { bottom: 0, textStyle: { color: "#8b98b8" }, itemWidth: 12, itemHeight: 12 },
      series: [{
        type: "pie",
        radius: ["40%", "68%"],
        center: ["50%", "46%"],
        itemStyle: { borderColor: "#16213a", borderWidth: 2, borderRadius: 6 },
        label: { color: "#e6ecf5", formatter: "{b}\n{d}%" },
        data: genSources(),
        color: ["#4fc3f7", "#a78bfa", "#34d399", "#fbbf24", "#f87171"],
      }],
    }, true);
  }

  function renderBar() {
    const cats = genCategories();
    charts.bar.setOption({
      tooltip: { ...baseTooltip, trigger: "axis", axisPointer: { type: "shadow" } },
      grid: { left: 80, right: 30, top: 20, bottom: 30 },
      xAxis: { type: "value", ...baseAxis },
      yAxis: { type: "category", data: cats.map((c) => c.name), ...baseAxis },
      series: [{
        type: "bar",
        data: cats.map((c) => c.value),
        barWidth: 16,
        itemStyle: {
          borderRadius: [0, 6, 6, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: "#4fc3f7" },
            { offset: 1, color: "#a78bfa" },
          ]),
        },
        label: { show: true, position: "right", color: "#8b98b8", fontSize: 11 },
      }],
    }, true);
  }

  function renderGauge() {
    charts.gauge.setOption({
      series: [{
        type: "gauge",
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 100,
        progress: { show: true, width: 12, itemStyle: { color: "#34d399" } },
        axisLine: { lineStyle: { width: 12, color: [[1, "#253357"]] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        pointer: { show: false },
        anchor: { show: false },
        detail: {
          valueAnimation: true,
          fontSize: 30,
          color: "#e6ecf5",
          offsetCenter: [0, 0],
          formatter: "{value}%",
        },
        data: [{ value: rand(45, 98) }],
      }],
    }, true);
  }

  function renderFunnel() {
    charts.funnel.setOption({
      tooltip: { ...baseTooltip, trigger: "item", formatter: "{b}: {c}" },
      series: [{
        type: "funnel",
        left: "10%",
        width: "80%",
        top: 10,
        bottom: 10,
        minSize: "20%",
        gap: 4,
        label: { color: "#e6ecf5", formatter: "{b}" },
        itemStyle: { borderRadius: 4 },
        data: genFunnel(),
        color: ["#4fc3f7", "#60a5fa", "#a78bfa", "#fbbf24", "#34d399"],
      }],
    }, true);
  }

  /* ---------- KPI 数字动画 ---------- */
  function animateValue(el, from, to, format, duration = 800) {
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = from + (to - from) * eased;
      el.textContent = format(val);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const fmtInt = (v) => Math.floor(v).toLocaleString();
  const fmtMoney = (v) => "¥" + fmtInt(v);
  const fmtPct = (v) => v.toFixed(2) + "%";

  let prevKpi = null;
  function renderKpi() {
    const next = genKpi();
    const map = [
      ["kpiPv", prevKpi ? prevKpi.pv : 0, next.pv, fmtInt, "kpiPvTrend"],
      ["kpiUv", prevKpi ? prevKpi.uv : 0, next.uv, fmtInt, "kpiUvTrend"],
      ["kpiSales", prevKpi ? prevKpi.sales : 0, next.sales, fmtMoney, "kpiSalesTrend"],
      ["kpiConv", prevKpi ? prevKpi.conv : 0, next.conv, fmtPct, "kpiConvTrend"],
    ];
    map.forEach(([id, from, to, fmt, trendId]) => {
      animateValue(document.getElementById(id), from, to, fmt);
      const trend = document.getElementById(trendId);
      if (prevKpi) {
        const diff = ((to - from) / (from || 1)) * 100;
        trend.textContent = (diff >= 0 ? "▲ +" : "▼ ") + diff.toFixed(1) + "% 较上一时段";
        trend.className = "kpi-trend " + (diff >= 0 ? "up" : "down");
      }
    });
    prevKpi = next;
  }

  /* ---------- 汇总渲染 ---------- */
  function renderAll() {
    renderKpi();
    renderTrend();
    renderSource();
    renderBar();
    renderGauge();
    renderFunnel();
    document.getElementById("lastUpdate").textContent =
      "数据更新于 " + new Date().toLocaleTimeString("zh-CN") + " · " + RANGES[currentRange].label;
  }

  /* ---------- 交互 ---------- */
  document.querySelectorAll(".range-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".range-btn.active").classList.remove("active");
      btn.classList.add("active");
      currentRange = btn.dataset.range;
      renderAll();
    });
  });

  document.getElementById("btnRefresh").addEventListener("click", renderAll);

  window.addEventListener("resize", () => Object.values(charts).forEach((c) => c.resize()));

  /* 时钟 */
  function tickClock() {
    const d = new Date();
    document.getElementById("clock").textContent =
      d.toLocaleDateString("zh-CN") + " " + d.toLocaleTimeString("zh-CN");
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* 实时模式自动刷新 */
  renderAll();
  setInterval(() => {
    if (currentRange === "realtime") renderAll();
  }, 5000);
})();
