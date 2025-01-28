import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';

mermaid.initialize({
  //theme: "neutral",
  //wrap: false,
  startOnLoad: false
});

$(document).ready(function () {
  switch (document.location.hash) {
    case '#uml':
      UMLDiagram()
      break;
  }

  $('#pagenav a').on('show.bs.tab', function (e) {
    if ($(e.target).attr('href') == '#uml') {
      $('#systemsMessagesButtons').hide()
      $('#constraintsButtons').hide()
      $('#descriptionsButtons').hide()
      UMLDiagram();
    }
  });
});

function UMLDiagram() {
  $.ajax({
    type: "POST",
    url: "systemsmessages.php",
    data: {
      filter: filteredArray,
      operation: 'UMLDiagram',
      date: filter_date
    },
    success: async function(data) {
      var element = document.getElementById("umlContents");
      const graphDefinition = data;
      const {
        svg
      } = await mermaid.render('graphDiv', graphDefinition);
      element.innerHTML = svg;
      var panZoom = svgPanZoom('#graphDiv', {
        zoomEnabled: true,
        controlIconsEnabled: true,
        fit: true,
        center: true,
        minZoom: 0.1,
    });
    }
  });
}

// Apply filtering
$(document).on('click', '.apply-filter', function () {
  switch (document.location.hash) {
    case '#uml':
      UMLDiagram();
      break;
  }
});

// Clear filtering
$(document).on('click', '.clear-filter', function () {
  switch (document.location.hash) {
    case '#uml':
      UMLDiagram();
      break;
  }
});