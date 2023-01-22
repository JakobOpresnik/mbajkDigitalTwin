import { useEffect, useRef, useState } from 'react';
import * as D3 from 'd3';
import '../Graph.css';

function Graphs() {

    // graph hook
    const d3Graph = useRef();

    const [ locations, setLocations ] = useState([]);

    useEffect(() => {
        fetch("https://api.jcdecaux.com/vls/v3/stations?apiKey=frifk0jbxfefqqniqez09tw4jvk37wyf823b5j1i&contract=maribor")
        .then(res => res.json())
        .then(data => {
            console.log(data);

            // get all location names
            /*const locationNames = [...new Set(data.map(each => each.name))];
            console.log(locationNames);

            // get all capacities
            const locationCapacities = [];
            data.map(location => {
                locationCapacities.push(location.totalStands.capacity);
            });
            console.log(locationCapacities);*/


            // getting all location numbers with their corresponding names and current bike capacities
            let capacitiesByLocation = [];
            data.map(location => {
                const obj = { number: location.number, name: location.name, capacity: location.totalStands.availabilities.bikes };
                capacitiesByLocation.push(obj);
            })
            // sort locations by numbers
            capacitiesByLocation.sort((a, b) => a.number - b.number)
            console.log(capacitiesByLocation);

            // set locations to the global variable 'locations'
            // so we can access it with JSX in the return statement
            setLocations(capacitiesByLocation);


            let standsByLocation = [];
            data.map(location => {
                const obj = { number: location.number, name: location.name, stands: location.totalStands.availabilities.stands };
                standsByLocation.push(obj);
            })
            standsByLocation.sort((a, b) => a.number - b.number)
            console.log(standsByLocation)



            // drawing the graph
            const margin = { top: 100, right: 30, bottom: 100, left: 30 };
            const width = parseInt(D3.select("#d3-graph").style("width")) - margin.left - margin.right;
            const height = parseInt(D3.select("#d3-graph").style("height")) - margin.top - margin.bottom;
            
            const svg = D3.select(d3Graph.current)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + (margin.left+20) + ", " + margin.top + ")");


            // x-axis
            const x = D3.scaleLinear()
                        .domain(D3.extent(capacitiesByLocation, function(d){ return d.number; }))
                        .range([1, width])

            svg.append("g")
                .attr("transform", "translate(0, " + height + ")")
                .call(D3.axisBottom(x)  // x is bottom axis
                    .ticks(22)
                    .tickSizeInner(-height))
                .attr("font-size", "18px")


            // getting the max value to be graphed
            const max = D3.max(standsByLocation, function(d){ return d.stands; });
            
            // y-axis
            const y = D3.scaleLinear()
                        .domain([0, max])
                        .range([height, 0])
            
            svg.append("g")
                .call(D3.axisLeft(y)   // y is left axis
                    .tickSizeInner(-width))
                .attr("font-size", "18px")


            // graph line
            /*svg.append("path")
                .datum(capacitiesByLocation)
                .attr("fill", "red")
                .attr("stroke", "red")
                .attr("stroke-width", 5)
                .attr("d", D3.line()
                            .curve(D3.curveBasis)
                            .x(function(d){ return x(d.number); })
                            .y(function(d){ return y(d.capacity); }))*/

            
            // graph for available bikes
            var bikesGraph = D3.area()
                            .x(function(d){ return x(d.number); })
                            .y1(function(d){ return y(d.capacity); })
                            .y0(height)
            
            svg.append("path")
                .attr("fill", "#ff6262")
                .attr("d", bikesGraph(capacitiesByLocation))
                .on("mouseover", function() {
                    D3.select(this).style("fill", "red")
                })
                .on("mouseout", function() {
                    D3.select(this).style("fill", "#ff6262")
                })


            // graph for available stands
            var standsGraph = D3.area()
                                .x(function(d){ return x(d.number); })
                                .y1(function(d){ return y(d.stands); })
                                .y0(height)

            svg.append("path")
                .attr("fill", "#ffe699")
                .attr("d", standsGraph(standsByLocation))
                .on("mouseover", function() {
                    D3.select(this).style("fill", "yellow")
                })
                .on("mouseout", function() {
                    D3.select(this).style("fill", "#ffe699")
                })

            // title text
            svg.append("text")
                .attr("x", (width/2))
                .attr("y", (margin.top/10 - 50))
                .attr("text-anchor", "middle")
                .attr("font-size", "30px")
                .attr("font-weight", "bold")
                .text("ŠTEVILO KOLES NA POSAMEZNIH MBAJK POSTAJALIŠČ")

            // x-axis text
            svg.append("text")
                .attr("x", (width/2-140))
                .attr("y", 650)
                .attr("text-ancor", "middle")
                .attr("font-size", "25px")
                .attr("font-weight", "bold")
                .text("ŠTEVILKE POSTAJALIŠČ")

        })

    }, [])

    return (
        <div>
            <div id="d3-graph">
                <svg ref={d3Graph}></svg>
            </div>
            <hr/>
            <div id="legend">
                <h1 id="legend-title">LEGENDA</h1>
                <div id="color-legend">
                    <div id="legend-1">
                        <div id="graph-legend-red"></div>
                    </div>
                    <div id="legend-1">
                        <h4>ŠT. KOLES</h4>
                    </div>
                    <br/>
                    <div id="legend-2">
                        <div id="graph-legend-yellow"></div>
                    </div>
                    <div id="legend-2">
                        <h4>ŠT. PARKIRNIH MEST</h4>
                    </div>
                </div>
                <h3>številka - lokacija</h3>
                <div id="loc-1">
                    {locations.filter(location => location.number <= 11).map(location => <h5 id="location">{location.number} - {location.name}</h5>)}
                </div>
                <div id="loc-2">
                    {locations.filter(location => location.number > 11).map(location => <h5 id="location">{location.number} - {location.name}</h5>)}
                </div>
            </div>
        </div>
    );
}

export default Graphs;