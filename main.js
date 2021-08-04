import RunCharts from "./chart.js";

const runStatsSvg = d3.select("#run_stats_svg")
const milestone_stats_svg = d3.select("#milestone_stats_svg")

RunCharts.drawMilestone(theData, getMilestones, milestone_stats_svg, {
    'startDate': '6/1/2021',
    'endDate': '7/31/2021'
});
RunCharts.drawBar(theData, runStatsSvg, {
    'startDate': '6/1/2021',
    'endDate': '7/31/2021',
    'height': 500,
    'width': 900
});