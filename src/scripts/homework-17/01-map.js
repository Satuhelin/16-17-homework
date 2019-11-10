import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 0, left: 0, right: 0, bottom: 0 }

let height = 500 - margin.top - margin.bottom

let width = 900 - margin.left - margin.right

let svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .style('background', 'black')
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const colorScale = d3.scaleSequential(d3.interpolateCool).domain([0, 1000000])

  
const projection = d3.geoMercator()
const graticule = d3.geoGraticule()
const path = d3.geoPath().projection(projection)

Promise.all([
  d3.json(require('/data/world.topojson')),
  d3.csv(require('/data/world-cities.csv'))
])
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready([json, datapoints]) {
  //console.log('What is our data?')
  console.log(json)
  const countries = topojson.feature(json, json.objects.countries)

  //console.log(countries)
  // countries is not a list
  // but countries.features is!
  svg
    .selectAll('path')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('fill', 'black')
    

  console.log(graticule())
  svg
    .append('path')
    .datum(graticule())
    .attr('d', path)
    .attr('stroke', 'grey')
    .attr('fill', 'none')
    .lower()

    svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', 1)
    .attr('fill', function(d) {
    //console.log(d.population)
    return colorScale(d.population)
    })
    .attr('opacity', 0.5)
    .attr('transform', function(d) {
    //  console.log(d)
      const coords = [d.lng, d.lat]
     // console.log(coords)
      return `translate(${projection(coords)})`
    })

}
