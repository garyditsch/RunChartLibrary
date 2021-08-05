(function(window){
    function drawCharts(){
        let charts = {
            drawMilestone: milestone,
            drawBar: bar
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
            console.log(dates)

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

        return charts;
    }

    if(typeof window.RunCharts === 'undefined'){
        window.RunCharts = drawCharts();
    }

})(window);

export default RunCharts;
