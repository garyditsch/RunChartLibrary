(function(window){
    function drawCharts(){
        let charts = {
            drawMilestone: milestone,
            drawBar: bar,
            drawCalendar: calendar
        }

        async function milestone(theData, getMilestones, svg, ...Args){
            const startDate = Args[0].startDate
            const endDate = Args[0].endDate
            const threshold = Args[0].threshold
            const margin = Args[0].margin
            const svgWidth = Args[0].svgWidth
            const svgHeight = Args[0].svgHeight

            const startMonth = new Date(startDate).getMonth()
            const endMonth = new Date(endDate).getMonth()
            const monthRange = d3.range(startMonth, (endMonth + 1), 1)

            const dates = await theData(startDate, endDate)
            const fiftyMiles = getMilestones(dates, threshold)

            const milestoneWidth = svgWidth - margin.left - margin.right

            const monthWidth = milestoneWidth / monthRange.length
            const monthPadding = 5

            const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

            let x = d3.scaleLinear()
                .domain([new Date(startDate).getTime(), new Date(endDate).getTime()])
                .range([0, milestoneWidth])

            let monthX = d3.scaleLinear()
                .domain([startMonth, (endMonth + 1)])
                .range([0, milestoneWidth])

            svg
                .attr('width', svgWidth)
                .attr('height', svgHeight)
                .style('margin-top', margin.top)
                .style('margin-bottom', margin.bottom)
                .style('background', '#fff')

            svg
                .append("g")
                .selectAll("circle")
                .data(fiftyMiles)
                .enter()
                .append("circle")
                .attr('width', 5)
                .attr('height', 20)
                .attr('cx', (d, i) => x(new Date(d.date.date).getTime()) + margin.left)
                .attr('cy', 60)
                .attr('r', 10)
                .style('opacity', 0.4)
                .style('fill', "blue")

            svg
                .append("g")
                .append("line")
                .attr('stroke', 'blue')
                .attr('stroke-width', '2')
                .attr('x1', x(new Date(startDate).getTime()) + margin.left)
                .attr('x2', x(new Date(endDate).getTime()) + margin.left)
                .attr('y1', 60)
                .attr('y2', 60)

            svg
                .append("g")
                .selectAll('text')
                .data(fiftyMiles)
                .enter().append('text')
                .attr('x', (d, i) => x(new Date(d.date.date).getTime()) + margin.left)
                .attr('y', (d, i) => { if (i % 2 === 0) { return 15 } else { return 45 } })
                .attr('height', 45)
                .attr('width', 25)
                .text((d, i) => i + 1)
                .style('fill', '#000')

            svg
                .append("g")
                .selectAll('line')
                .data(fiftyMiles)
                .enter().append('line')
                .attr('x1', (d, i) => x(new Date(d.date.date).getTime()) + margin.left)
                .attr('x2', (d, i) => x(new Date(d.date.date).getTime()) + margin.left)
                .attr('y1', (d, i) => { if (i % 2 === 0) { return 18 } else { return 48 } })
                .attr('y2', 60)
                .attr('stroke', 'blue')
                .attr('stroke-width', '2')

            svg
                .append("g")
                .selectAll('rect')
                .data(monthRange)
                .join("rect")
                .attr('x', (d) => monthX(d) + margin.left)
                .attr('width', monthWidth - monthPadding)
                .attr('height', 30)
                .attr('y', 85)
                .style('fill', "rgb(209, 227, 243)")


            svg
                .append("g")
                .selectAll('text')
                .data(monthRange)
                .enter().append('text')
                .attr('x', (d) => monthX(d) + margin.left + 10)
                .attr('y', 100)
                .attr('height', 20)
                .attr('width', 25)
                .text(d => monthLabels[d])
                .style('fill', '#000')

            svg
                .append("g")
                .selectAll("rect")
                .data(fiftyMiles)
                .enter().append('rect')
                .attr('x', 0 + margin.left)
                .attr('y', (d, i) => (40 * i) + 125)
                .attr('height', 30)
                .attr('width', milestoneWidth)
                .style('fill', "rgb(241, 247, 253)")

            svg
                .append("g")
                .selectAll('text')
                .data(fiftyMiles)
                .enter().append('text')
                .attr('x', 5 + margin.left)
                .attr('y', (d, i) => (40 * i) + 145)
                .attr('height', 45)
                .attr('width', milestoneWidth)
                .text((d, i) => `${i + 1} //  Date: ${d.date.date.toLocaleDateString(
                    'en-US',
                    {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }
                )}  // Total Miles: ${d.miles.toFixed(0)}`)
                .style('fill', '#000')
        }

        async function bar(theData, svg, ...Args){
            const startDate = new Date(Args[0].startDate).getTime()
            const endDate = new Date(Args[0].endDate).getTime()
            

            const dates = await theData(startDate, endDate)

            const height = Args[0].height
            const width = Args[0].width
            const margin = Args[0].margin

            //  the size of the overall svg element
            // const margin = { top: 10, right: 20, bottom: 35, left: 0 };
            const widthBar = width - margin.left - margin.right;
            const heightBar = height - margin.top - margin.bottom;

            const topRunList = dates.sort((a, b) => { return b.value - a.value }).slice(0, 6)

            const formatDate = d3.utcFormat("%x");

            const xScale = d3.scaleLinear()
                .domain([0, d3.max(topRunList, d => d.value)])
                .range([0, widthBar])

            const yScale = d3.scaleBand()
                .domain(topRunList.map(d => d.date))
                .range([0, heightBar])
                .padding(0.05)

            svg
                .attr('width', widthBar + margin.left + margin.right)
                .attr('height', heightBar + margin.top + margin.bottom)
                .style('margin-top', margin.top)
                .style('background', '#fff')
                .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

            svg
                .append('g')
                .selectAll('rect')
                .data(topRunList)
                .enter().append('rect')
                .style('fill', 'rgb(83, 157, 204)')
                .style('stroke', '#000')
                .style('stroke-width', '0')
                .attr('height', yScale.bandwidth)
                .attr('width', (topRunList) => xScale(topRunList.value))
                .attr('y', topRunList => yScale(topRunList.date))
                .attr('x', 0 + margin.left)


            svg
                .append('g')
                .selectAll('text')
                .data(topRunList)
                .enter().append('text')
                .attr('height', yScale.bandwidth)
                .attr('width', (topRunList) => xScale(topRunList.value))
                .attr('y', topRunList => yScale(topRunList.date) + margin.top + 10)
                .attr('x', 0 + margin.left + 10)
                .text(d => `${formatDate(d.date)}` + `, ` + `${d.value.toFixed(2)} miles`)
                .style('fill', "#fff")
        }

        async function calendar(theData, svg, ...Args){

            const startDate = new Date(Args[0].startDate).getTime()
            const endDate = new Date(Args[0].endDate).getTime()

            const dates = await theData(startDate, endDate)

            // had to reduce the dates to get totals for each day
            // https://stackoverflow.com/questions/47893084/sum-the-values-for-the-same-dates
            // had some issues with the dates as objects, but changing to string and comparing worked
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
            const reducedDates = dates.reduce(function (allDates, date) {
                if (allDates.some(function (e) {
                    return e.date.toLocaleString('en-US') === date.date.toLocaleString('en-US')
                })) {
                    allDates.filter(function (e) {
                        return e.date.toLocaleString('en-US') === date.date.toLocaleString('en-US')
                    })[0].value += +date.value
                } else {
                    allDates.push({
                        date: date.date,
                        value: +date.value
                    })
                }
                return allDates
            }, []);
        
            // return array with months grouped together. NOTE: nest is deprecated in future d3 versions
            const months = d3.nest()
                // .key(d => d.date.getUTCFullYear())
                .key(d => d.date.toLocaleString('default', { month: 'long' }))
                .entries(reducedDates)

            console.log(months)

            const monthOrdered = months.sort((a, b) => (a.values[0].date > b.values[0].date ) ? 1 : ((b.values[0].date > a.values[0].date) ? -1 : 0))
            console.log(monthOrdered)
        
            // get array of all values
            const values = reducedDates.map(c => c.value);
            
            // get max/min values 
            const maxValue = d3.max(values);
            const minValue = d3.min(values);
        
            // set constants, yearHeight is * 7 for days of week
            const cellSize = 20;
            const yearHeight = cellSize * 7;
        
            // adding g element to svg
            const group = svg.append("g");  
        
            // adds g element for each month with data to svg
            // gives the y axis value to move g element based on month index within data
            const month = group
                .selectAll("g")
                .data(months)
                .join("g")
                .attr(
                    "transform",
                    (d, i) => `translate(${yearHeight * i + cellSize * 1.5}, 0)`
                );
        
            // add the month label with positioning and style
            month
                .append("text")
                .attr("x", -5)
                .attr("y", -35)
                .attr("text-anchor", "end")
                .attr("font-size", 16)
                .attr("font-weight", 550)
                .attr("transform", "rotate(270)")
                    .text(d => { return d.key + '  ' + '[' + (d.values.reduce((prev, cur) => { return prev + parseFloat(cur.value)}, 0 )).toFixed(2) + ']' });
        
            // function to return week label
            const formatDay = d =>
                ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getUTCDay()];
            
            // return an index representing day of week: Ex: 0 = Sunday, 6 = Saturday
            const countDay = d => d.getUTCDay();
        
            // https://www.geeksforgeeks.org/d3-js-d3-utcsunday-function/
            // returns array of all the sundays from a start/end date
            const timeWeek = d3.utcSunday;
            const formatDate = d3.utcFormat("%x");
        
        
            // http://using-d3js.com/04_05_sequential_scales.html
            const colorFn = d3
                    .scaleSequential(d3.interpolateBlues)
                    // .scaleSequential(d3.interpolateCool)
                    .domain([Math.floor(minValue), Math.ceil(maxValue)]);
            const format = d3.format("+.2%");
        
            
            // adds group element that displays add the day of week label 
            month
                .append("g")
                .attr("text-anchor", "end")
                .selectAll("text")
                .data(d3.range(7).map(i => new Date(1995, 0, i)))
                .join("text")
                .attr("x", -5)
                .attr("y", d => (countDay(d) + 0.5) * cellSize)
                .attr("dy", "0.31em")
                .attr("font-size", 12)
                .text(formatDay);
        
            month
                .append("g")
                .selectAll("rect")
                .data(d => d.values)
                .join("rect")
                .attr("width", cellSize - 1.5)
                .attr("height", cellSize - 1.5)
                .attr(
                    "x",
                    (d, i) => timeWeek.count(d3.utcMonth(d.date), d.date) * cellSize + 10
                )
                .attr("y", d => countDay(d.date) * cellSize + 0.5)
                .attr("fill", d => colorFn(d.value))
                .append("title")
                    .text(d => `${formatDate(d.date)}: ${d.value.toFixed(2)}`);
        }

        return charts;
    }

    if(typeof window.RunCharts === 'undefined'){
        window.RunCharts = drawCharts();
    }

})(window);

export default RunCharts;
