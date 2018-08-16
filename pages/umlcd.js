var graph = new joint.dia.Graph();

var paper = new joint.dia.Paper({
    el: $('#paper'),
    width: $('#paper').width() + 10,
    height: 820,
    gridSize: 1,
    model: graph,
});

var uml = joint.shapes.uml;

var classes = {

    importoperation: new uml.Class({
        position: { x: $('#paper').width()/2-100 , y: 10 },
        size: { width: 200, height: 140 },
        name: 'Import operation',
        attributes: ['LRN','Additional LRN', 'Message identification', 'Declaration type', 'Additional declaration type', 'Total gross mass', 'Total packages', 'Language code'],
        attrs: {
            '.uml-class-name-rect': {
                fill: '#00205b',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-attrs-rect, .uml-class-methods-rect': {
                fill: '#fafafa',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-name-text': {
                fill: '#fff',
				'font-family': 'Arial, Helvetica, sans-serif'
            },
            '.uml-class-attrs-text, .uml-class-methods-text': {
				'font-family': 'Arial, Helvetica, sans-serif'
            }
        }
    }),

    goodsshipment: new uml.Class({
        position: { x: $('#paper').width()/2-100 , y: 340 },
        size: { width: 200, height: 75 },
        name: 'Goods shipment',
        attributes: ['Reference number/UCR','Country of dispatch/export','Country of destination'],
        attrs: {
            '.uml-class-name-rect': {
                fill: '#00205b',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-attrs-rect, .uml-class-methods-rect': {
                fill: '#fafafa',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-name-text': {
                fill: '#fff',
				'font-family': 'Arial, Helvetica, sans-serif'
            },
            '.uml-class-attrs-text, .uml-class-methods-text': {
				'font-family': 'Arial, Helvetica, sans-serif'
            }
        }
    }),


    consignment: new uml.Class({
        position: { x: $('#paper').width()/2+200 , y: 350 },
        size: { width: 160, height: 49 },
        name: 'Consignment',
        attributes: ['Container'],
        attrs: {
            '.uml-class-name-rect': {
                fill: '#00205b',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-attrs-rect, .uml-class-methods-rect': {
                fill: '#fafafa',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-name-text': {
                fill: '#fff',
				'font-family': 'Arial, Helvetica, sans-serif'
            },
            '.uml-class-attrs-text, .uml-class-methods-text': {
				'font-family': 'Arial, Helvetica, sans-serif'
            }
        }
    }),

    goodsitem: new uml.Class({
        position: { x: $('#paper').width()/2-140 , y: 610 },
        size: { width: 280, height: 200 },
        name: 'Goods item',
        attributes: ['Goods item number','Statistical value','Reference number/UCR','Requested procedure code','Previous procedure code','Additional procedure','Description of goods','CUS code','Commodity code - Combined nomenclature code','Commodity code - TARIC code','Gross mass','Supplementary units','Country of origin'],
        attrs: {
            '.uml-class-name-rect': {
                fill: '#00205b',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-attrs-rect, .uml-class-methods-rect': {
                fill: '#fafafa',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-name-text': {
                fill: '#fff',
				'font-family': 'Arial, Helvetica, sans-serif'
            },
            '.uml-class-attrs-text, .uml-class-methods-text': {
				'font-family': 'Arial, Helvetica, sans-serif'
            }
        }
    }),

    authorisationholder: new uml.Class({
        position: { x: 10 , y: 10 },
        size: { width: 250, height: 62 },
        name: 'Holder of the authorisation',
        attributes: ['Holder of the authorisation identification no.','Authorisation type code'],
        attrs: {
            '.uml-class-name-rect': {
                fill: '#00205b',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-attrs-rect, .uml-class-methods-rect': {
                fill: '#fafafa',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-name-text': {
                fill: '#fff',
				'font-family': 'Arial, Helvetica, sans-serif'
            },
            '.uml-class-attrs-text, .uml-class-methods-text': {
				'font-family': 'Arial, Helvetica, sans-serif'
            }
        }
    }),

    representative: new uml.Class({
        position: { x: 10 , y: 82 },
        size: { width: 200, height: 140 },
        name: 'Representative',
        attributes: ['Representative status code','Representative identification no.','Representative office code','Representative name','Representative street and number','Representative city','Representative postcode','Representative country'],
        attrs: {
            '.uml-class-name-rect': {
                fill: '#00205b',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-attrs-rect, .uml-class-methods-rect': {
                fill: '#fafafa',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-name-text': {
                fill: '#fff',
				'font-family': 'Arial, Helvetica, sans-serif'
            },
            '.uml-class-attrs-text, .uml-class-methods-text': {
				'font-family': 'Arial, Helvetica, sans-serif'
            }
        }
    }),

    declarant: new uml.Class({
        position: { x: $('#paper').width()-150 , y: 10 },
        size: { width: 170, height: 127 },
        name: 'Declarant',
        attributes: ['Declarant identification no.','Declarant office code','Declarant name','Declarant street and number','Declarant city','Declarant postcode','Declarant country'],
        attrs: {
            '.uml-class-name-rect': {
                fill: '#00205b',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-attrs-rect, .uml-class-methods-rect': {
                fill: '#fafafa',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-name-text': {
                fill: '#fff',
				'font-family': 'Arial, Helvetica, sans-serif'
            },
            '.uml-class-attrs-text, .uml-class-methods-text': {
				'font-family': 'Arial, Helvetica, sans-serif'
            }
        }
    }),

    additionaldocument: new uml.Class({
        position: { x: 10 , y: 232 },
        size: { width: 160, height: 75 },
        name: 'Documents produced, ...',
        attributes: ['Document type','Document identifier','Attachment reference'],
        attrs: {
            '.uml-class-name-rect': {
                fill: '#00205b',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-attrs-rect, .uml-class-methods-rect': {
                fill: '#fafafa',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-name-text': {
                fill: '#fff',
				'font-family': 'Arial, Helvetica, sans-serif'
            },
            '.uml-class-attrs-text, .uml-class-methods-text': {
				'font-family': 'Arial, Helvetica, sans-serif'
            }
        }
    }),

    additionalinformation: new uml.Class({
        position: { x: 10 , y: 345 },
        size: { width: 195, height: 62 },
        name: 'Additional information',
        attributes: ['Additional information type','Additional information description'],
        attrs: {
            '.uml-class-name-rect': {
                fill: '#00205b',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-attrs-rect, .uml-class-methods-rect': {
                fill: '#fafafa',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-name-text': {
                fill: '#fff',
				'font-family': 'Arial, Helvetica, sans-serif'
            },
            '.uml-class-attrs-text, .uml-class-methods-text': {
				'font-family': 'Arial, Helvetica, sans-serif'
            }
        }
    }),

    UCR: new uml.Class({
        position: { x: 10 , y: 457 },
        size: { width: 160, height: 49 },
        name: 'Reference number/UCR',
        attributes: ['Reference number/UCR'],
        attrs: {
            '.uml-class-name-rect': {
                fill: '#00205b',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-attrs-rect, .uml-class-methods-rect': {
                fill: '#fafafa',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-name-text': {
                fill: '#fff',
				'font-family': 'Arial, Helvetica, sans-serif'
            },
            '.uml-class-attrs-text, .uml-class-methods-text': {
				'font-family': 'Arial, Helvetica, sans-serif'
            }
        }
    }),

    transportequipment: new uml.Class({
        position: { x: $('#paper').width()-180 , y: 500 },
        size: { width: 180, height: 49 },
        name: 'Transport equipment',
        attributes: ['Container identification number'],
        attrs: {
            '.uml-class-name-rect': {
                fill: '#00205b',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-attrs-rect, .uml-class-methods-rect': {
                fill: '#fafafa',
                stroke: '#e3e5e9',
                'stroke-width': 1
            },
            '.uml-class-name-text': {
                fill: '#fff',
				'font-family': 'Arial, Helvetica, sans-serif'
            },
            '.uml-class-attrs-text, .uml-class-methods-text': {
				'font-family': 'Arial, Helvetica, sans-serif'
            }
        }
    }),
};

_.each(classes, function(c) { graph.addCell(c); });

var createLink = function(start, end, sttext, entext) {
	var myLink = new joint.dia.Link({
		source: { id: start },
		target: { id: end },
//		router: { name: 'manhattan' },
		connector: { name: 'jumpover' },
		attrs: {
			'.connection': {
				stroke: '#333333',
				'stroke-width': 1
			}
		},
        labels: [{
            position: {
				distance: 12,
				offset: 12
			},
            attrs: {
                text: { text: sttext, fill: '#333333', 'font-size': 12, 'font-weight': 'normal' }
            }
		},
		{
            position: {
				distance: -12,
				offset: -12
			},
            attrs: {
                text: { text: entext, fill: '#333333', 'font-size': 12, 'font-weight': 'normal' }
            }
        }],
		markup: '<path class="connection"/><path class="marker-target"/><g class="labels" />'
 	});
    return myLink.addTo(graph);
};

createLink(classes.importoperation.id, classes.goodsshipment.id, '1', '1');
createLink(classes.goodsshipment.id, classes.consignment.id, '1', '1');
createLink(classes.goodsshipment.id, classes.goodsitem.id, '1', '1..99999');

createLink(classes.importoperation.id, classes.authorisationholder.id, '1', '0..99');
createLink(classes.importoperation.id, classes.representative.id, '1', '0..1');
createLink(classes.importoperation.id, classes.declarant.id, '1', '1');

createLink(classes.importoperation.id, classes.additionaldocument.id, '1', '0..99');
createLink(classes.importoperation.id, classes.additionalinformation.id, '1', '0..99');
createLink(classes.goodsitem.id, classes.additionaldocument.id, '1', '0..99');
createLink(classes.goodsitem.id, classes.additionalinformation.id, '1', '0..99');
createLink(classes.goodsshipment.id, classes.UCR.id, '1', '0..1');
createLink(classes.goodsitem.id, classes.UCR.id, '1', '0..1');
createLink(classes.consignment.id, classes.transportequipment.id, '1', '0..9999');
createLink(classes.goodsitem.id, classes.transportequipment.id, '1', '0..9999');
