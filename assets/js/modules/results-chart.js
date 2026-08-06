// Results: create amChart radar graph

import { getTopScores } from "./results-data.js";
import { chartPalette } from "./utils/color-utils.js";

export class ResultsChart {
  constructor(hostElement) {
    this.host = hostElement;
    this.root = null;
    this.chart = null;
    this.xAxis = null;
    this.series = null;
    this.hasAppeared = false;
  }

  ensureChart() {
    if (
      typeof am5 === "undefined" ||
      typeof am5xy === "undefined" ||
      typeof am5radar === "undefined" ||
      typeof am5themes_Animated === "undefined"
    ) {
      throw new Error(
        "amCharts is not fully loaded. Ensure index.html loads index.js, xy.js, radar.js, and Animated.js before results-chart.",
      );
    }

    if (!this.host) {
      throw new Error("Missing chart host element");
    }

    if (this.root) {
      return;
    }

    this.root = am5.Root.new(this.host);
    this.root.numberFormatter = am5.NumberFormatter.new(this.root, {
      numberFormat: "#",
    });
    this.root.setThemes([am5themes_Animated.new(this.root)]);

    const chart = this.root.container.children.push(
      am5radar.RadarChart.new(this.root, {
        startAngle: -95,
        endAngle: 265,
        innerRadius: am5.percent(6),
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
      }),
    );
    chart.setAll({
      paddingTop: 12,
      paddingBottom: 8,
      paddingLeft: 10,
      paddingRight: 10,
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        categoryField: "category",
        renderer: am5radar.AxisRendererCircular.new(this.root, {
          minGridDistance: 24,
        }),
      }),
    );
    xAxis.get("renderer").labels.template.setAll({
      fontSize: 11,
      fontWeight: "600",
      fill: am5.color(chartPalette.text),
      oversizedBehavior: "truncate",
      maxWidth: 120,
    });
    xAxis.get("renderer").grid.template.setAll({
      stroke: am5.color(chartPalette.grid),
      strokeOpacity: 0.14,
    });
    xAxis.get("renderer").ticks.template.setAll({
      stroke: am5.color(chartPalette.grid),
      strokeOpacity: 0.16,
      length: 4,
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        min: 0,
        max: 100,
        strictMinMax: true,
        renderer: am5radar.AxisRendererRadial.new(this.root, {
          minGridDistance: 28,
        }),
      }),
    );
    yAxis.get("renderer").labels.template.setAll({
      fontSize: 10,
      fill: am5.color(chartPalette.muted),
    });
    yAxis.get("renderer").grid.template.setAll({
      stroke: am5.color(chartPalette.grid),
      strokeOpacity: 0.12,
    });
    yAxis.get("renderer").ticks.template.setAll({
      stroke: am5.color(chartPalette.grid),
      strokeOpacity: 0.14,
      length: 4,
    });

    const series = chart.series.push(
      am5radar.RadarLineSeries.new(this.root, {
        name: "Assessment",
        xAxis,
        yAxis,
        categoryXField: "category",
        valueYField: "value",
      }),
    );
    series.strokes.template.setAll({
      strokeWidth: 3,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      stroke: am5.color(chartPalette.line),
    });
    series.set("connect", true);
    series.set("tensionX", 0.8);
    series.set("tensionY", 0.8);

    function addRange(yAxisRef, from, to, colour, opacity) {
      const range = yAxisRef.makeDataItem({ value: from, endValue: to });
      yAxisRef.createAxisRange(range);
      range.get("axisFill").setAll({
        visible: true,
        fill: am5.color(colour),
        fillOpacity: opacity,
      });
    }

    addRange(yAxis, 0, 35, chartPalette.surface, 0.22);
    addRange(yAxis, 35, 70, chartPalette.surfaceSoft, 0.16);
    addRange(yAxis, 70, 100, chartPalette.ring, 0.12);

    series.fills.template.setAll({
      visible: true,
      fillOpacity: 0.2,
      fill: am5.color(chartPalette.fill),
    });

    series.bullets.push(() =>
      am5.Bullet.new(this.root, {
        sprite: am5.Circle.new(this.root, {
          radius: 5.5,
          fill: am5.color(0xf8fafc),
          stroke: am5.color(chartPalette.surface),
          strokeWidth: 2,
        }),
      }),
    );

    const tooltip = am5.Tooltip.new(this.root, {
      getFillFromSprite: false,
      getStrokeFromSprite: false,
      labelText: "{category}: {valueY}",
    });
    series.set("tooltip", tooltip);
    const tooltipBackground = tooltip.get("background");
    if (tooltipBackground) {
      tooltipBackground.setAll({
        fill: am5.color(chartPalette.surface),
        fillOpacity: 0.98,
        stroke: am5.color(chartPalette.grid),
        cornerRadius: 14,
      });
    }
    if (tooltip.label) {
      tooltip.label.setAll({
        fill: am5.color(chartPalette.text),
        fontSize: 11,
        fontWeight: "500",
      });
    }

    this.xAxis = xAxis;
    this.series = series;
    this.chart = chart;
  }

  setHost(hostElement) {
    if (!hostElement) return;
    this.host = hostElement;
  }

  setScores(scores) {
    this.ensureChart();

    const chartData =
      typeof getTopScores === "function"
        ? getTopScores(scores, 5)
        : Object.entries(scores)
            .slice(0, 5)
            .map(([k, v]) => ({ category: k, value: v }));

    if (this.xAxis) {
      this.xAxis.data.setAll(chartData);
    }
    if (this.series) {
      this.series.data.setAll(chartData);
      if (!this.hasAppeared) {
        this.series.appear(1000);
      }
    }

    if (this.chart && !this.hasAppeared) {
      this.chart.appear(1000, 100);
      this.hasAppeared = true;
    }

    this.resize();
    return this.chart;
  }

  render(scores) {
    this.setScores(scores);
    return this.chart;
  }

  resize() {
    if (!this.root) return;
    if (typeof this.root.resize === "function") {
      this.root.resize();
      return;
    }
    window.dispatchEvent(new Event("resize"));
  }

  dispose() {
    if (this.root) {
      try {
        this.root.dispose();
      } catch (e) {
        // ignore dispose errors
      }
      this.root = null;
      this.chart = null;
      this.xAxis = null;
      this.series = null;
      this.hasAppeared = false;
    }
  }
}

export function createResultsChart(hostElement, scores) {
  const c = new ResultsChart(hostElement);
  c.render(scores);
  return c;
}
