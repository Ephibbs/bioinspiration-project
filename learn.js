//var train_data = [new convnetjs.Vol([1.3, 0.5]), new convnetjs.Vol([0.1, 0.7])];
//var train_labels = [0, 1];
// 
//// create a magic net
//var magicNet = new convnetjs.MagicNet(train_data, train_labels);
// 
//// start training MagicNet. Every call trains all candidates in current batch on one example
//setInterval(function(){ magicNet.step() }, 0});
// 
//// once at least one batch of candidates is evaluated on all folds we can do prediction!
//function predict() {
//  // prediction example. xout is Vol of scores
//  // there is also predict_soft(), which returns the full score volume for all labels
//  var array = 
//  var some_test_vol = new convnetjs.Vol(array);
//  var predicted_label = magicNet.predict(some_test_vol);
//}

var width1 = 900,
    height1 = 600;

var color1 = d3.scale.category20();

var force1 = d3.layout.force()
    .charge(-140)
    .linkDistance(100)
    .size([width1, height1])
    .gravity(0.5)
    .alpha(1);

var svg1 = d3.select("#celegansnet").append("svg")
    .attr("width", width1)
    .attr("height", height1);
    //.attr("viewBox", "0 0 " + width + " " + height )
    //.attr("preserveAspectRatio", "xMidYMid meet");

d3.json("neuralnet.json", function(error, graph) {
  force1
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link1 = svg1.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", .25)
        .style("stroke", "#999");

  var node1 = svg1.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("fill", function(d) { return color1(d.group); })
      .call(force1.drag);

  node1.append("title")
      .text(function(d) { return d.name; });

  force1.on("tick", function() {
    link1.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node1.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
});

var w = 600;
    var h = 300;

    var colors = d3.scale.category10();

    var dataset = {

    nodes: [
    {name: "input 1"},
    {name: "input 2"},
    {name: "perceptron"},
    {name: "output"},
    ],
    edges: [
    {source: 0, target: 2},
    {source: 1, target: 2},
    {source: 2, target: 3},
    ]
    };

 
    var svg = d3.select("#perceptron").append("svg").attr({"width":w,"height":h});

    var force = d3.layout.force()
        .nodes(dataset.nodes)
        .links(dataset.edges)
        .size([w,h])
        .linkDistance(100)
        .charge([-500])
        .theta(0.1)
        .gravity(0.01)
        .start();

 

    var edges = svg.selectAll("line")
      .data(dataset.edges)
      .enter()
      .append("line")
      .attr("id",function(d,i) {return 'edge'+i})
      .attr('marker-end','url(#arrowhead)')
      .style("stroke","#ccc")
      .style("pointer-events", "none");
    
    var nodes = svg.selectAll("circle")
      .data(dataset.nodes)
      .enter()
      .append("circle")
      .attr({"r":15})
      .style("fill",function(d,i){return colors(i);})
      .call(force.drag)


    var nodelabels = svg.selectAll(".nodelabel")
       .data(dataset.nodes)
       .enter()
       .append("text")
       .attr({"x":function(d){return d.x+10;},
              "y":function(d){return d.y+10;},
              "class":"nodelabel",
              "stroke":"black"})
       .text(function(d){return d.name;});

    var edgepaths = svg.selectAll(".edgespath")
        .data(dataset.edges)
        .enter()
        .append('path')
        .attr({'d': function(d) {return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y},
               'class':'edgepath',
               'fill-opacity':0,
               'stroke-opacity':0,
               'fill':'blue',
               'stroke':'red',
               'id':function(d,i) {return 'edgepath'+i}})
        .style("pointer-events", "none");

    var edgelabels = svg.selectAll(".edgelabel")
        .data(dataset.edges)
        .enter()
        .append('text')
        .style("pointer-events", "none")
        .attr({'class':'edgelabel',
               'id':function(d,i){return 'edgelabel'+i},
               'dx':40,
               'dy':0,
               'font-size':10,
               'fill':'#aaa'});

    edgelabels.append('textPath')
        .attr('xlink:href',function(d,i) {return '#edgepath'+i})
        .style("pointer-events", "none")
        .text(function(d,i){
            if(i != 2) {
                return 'weight '+i;
            }
            return "";
        });


    svg.append('defs').append('marker')
        .attr({'id':'arrowhead',
               'viewBox':'-0 -5 10 10',
               'refX':25,
               'refY':0,
               //'markerUnits':'strokeWidth',
               'orient':'auto',
               'markerWidth':10,
               'markerHeight':10,
               'xoverflow':'visible'})
        .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#ccc')
            .attr('stroke','#ccc');
     

    force.on("tick", function(){

        edges.attr({"x1": function(d){return d.source.x;},
                    "y1": function(d){return d.source.y;},
                    "x2": function(d){return d.target.x;},
                    "y2": function(d){return d.target.y;}
        });

        nodes.attr({"cx":function(d){return d.x;},
                    "cy":function(d){return d.y;}
        });

        nodelabels.attr("x", function(d) { return d.x; }) 
                  .attr("y", function(d) { return d.y; });

        edgepaths.attr('d', function(d) { var path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
                                           //console.log(d)
                                           return path});       

        edgelabels.attr('transform',function(d,i){
            if (d.target.x<d.source.x){
                bbox = this.getBBox();
                rx = bbox.x+bbox.width/2;
                ry = bbox.y+bbox.height/2;
                return 'rotate(180 '+rx+' '+ry+')';
                }
            else {
                return 'rotate(0)';
                }
        });
    });
