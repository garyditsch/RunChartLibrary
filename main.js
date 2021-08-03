import RunCharts from "./chart.js";

const runStatsSvg = d3.select("#run_stats_svg")
const milestone_stats_svg = d3.select("#milestone_stats_svg")

RunCharts.drawMilestone(theData, getMilestones, milestone_stats_svg, {
    'startDate': new Date('1/1/2021').getTime(),
    'endDate': new Date('12/31/2021').getTime()
});
RunCharts.drawBar(theData, runStatsSvg, {
    'height': 500,
    'width': 900
});