import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 0, left: 150, right: 0, bottom: 0 }

let height = 600 - margin.top - margin.bottom

let width = 900 - margin.left - margin.right

let svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  
  const colorScale = d3.scaleOrdinal().range(['#a6cee3','#1f78b4','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#b2df8a','#33a02c','#ffff99'])

  const radiusScale = d3.scaleSqrt().domain([0, 3000])
    .range([0, 7])

const projection = d3.geoAlbersUsa().scale(700)
const path = d3.geoPath().projection(projection)

Promise.all([
  d3.json(require('/data/us_states.topojson')),
  d3.csv(require('/data/powerplants.csv'))
])
  .then(ready)
  .catch(err => console.log('Failed on', err))


  function ready([json, datapoints]) {
  console.log('What is our data?')
  console.log(datapoints)
  const states = topojson.feature(json, json.objects.us_states)
  console.log(states)
  
  var nested = d3
  .nest()
  .key(d => d.PrimSource)
  .entries(datapoints)


  //map
  
  svg
    .selectAll('path')
    .data(states.features)
    .enter()
    .append('path')
    .attr('class', 'state')
    .attr('d', path)
    .attr('fill', '#e5f5e0')
    .lower()
    
  svg
  .selectAll('circle')
  .data(datapoints)
  .enter()
  .append('circle')
  .attr('opacity', 0.5)
  .attr('r', function(d) {
    return radiusScale(d.Total_MW)
  })
   // .attr('fill', 'red')
  
  .attr('transform', function(d) {
   //console.log(d)
    const coords = [d.Longitude, d.Latitude]
    
  // console.log(coords)
  
  return `translate(${projection(coords)})`
  })
  .attr('fill',function(d) {
    return colorScale(d.PrimSource)
  })
  
//state labels 
  svg
    .selectAll('text')
    .data(states.features)
    .enter()
    .append('text')
    .text(function(d) {
    
      return d.properties.abbrev
    })
    .attr('transform', function(d) {
      return `translate(${path.centroid(d)})`
    })
    .attr('text-anchor', 'middle')
    .attr('alingment-baseline', 'middle')
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .raise()

    //legend

  const legend = svg.append('g').attr('transform', 'translate(50, 100)')

  legend
    .selectAll('.legend')
    .data(nested)
    .enter()
    .append('g')
    .attr('y', 50)
    .attr('transform', (d, i) => `translate(-150,${i*25})`)
    .attr('class', 'legend')
    .each(function(d) {
      let g = d3.select(this)

      g.append('circle')
        .attr('r', 5)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('fill', colorScale(d.key))

      g.append('text')
        .text(d.key.charAt(0).toUpperCase() + d.key.slice(1))
        .attr('dx', 10)
        .attr('fill', 'black')
        .attr('alignment-baseline', 'middle')
    })

  }