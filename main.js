import RunCharts from "./chart.js";

const runStatsSvg = d3.select("#run_stats_svg")
const milestone_stats_svg = d3.select("#milestone_stats_svg")
const calendar_svg = d3.select("#calendar_svg")
const bubble_svg = d3.select("#bubble_svg")

RunCharts.drawMilestone(theData, getMilestones, milestone_stats_svg, {
    'startDate': '1/1/2021',
    'endDate': '7/31/2021',
    'threshold': 30, 
    'margin': {
        left: 10,
        right: 10,
        top: 100, 
        bottom: 50
    },
    'svgWidth': 900,
    'svgHeight': 250
});

RunCharts.drawBar(theData, runStatsSvg, {
    'startDate': '1/1/2021',
    'endDate': '7/31/2021',
    'height': 400,
    'width': 900,
    'margin': {
        left: 0,
        right: 20,
        top: 10,
        bottom: 35
    }
});

RunCharts.drawCalendar(theData, calendar_svg, {
    'startDate': '1/1/2021',
    'endDate': '7/31/2021',
    'height': 500,
    'width': 900,
    'margin': {
        left: 0,
        right: 20,
        top: 10,
        bottom: 35
    }
});

RunCharts.drawBubble(theData, bubble_svg, {
    'startDate': '1/1/2021',
    'endDate': '7/31/2021',
    'height': 500,
    'width': 900,
    'margin': {
        left: 0,
        right: 20,
        top: 10,
        bottom: 35
    }
});