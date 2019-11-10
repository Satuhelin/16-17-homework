import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 0, left: 0, right: 0, bottom: 0 }

let height = 500 - margin.top - margin.bottom

let width = 900 - margin.left - margin.right

let svg = d3
  .select('#chart-4b')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  

const projection = d3.geoAlbersUsa().scale(700)

const path = d3.geoPath().projection(projection)

d3.json(require('/data/counties_with_election_data.topojson'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(json) {
 // console.log('What is our data?')
  console.log(json)
  const counties = topojson.feature(json, json.objects.us_counties)
  svg
    .selectAll('path')
    .data(counties.features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('d', path)
   .attr('opacity', function(d) {
   return  (d.properties.clinton+d.properties.trump)/100000
   })
    .attr('fill', function(d) {
    if (d.properties.clinton/(d.properties.clinton+d.properties.trump) > 0.50 ) {
    return 'purple'
    } else {
    return 'green'
  }
})
}
