var graph = new joint.dia.Graph();

var paper = new joint.dia.Paper({
    el: $('#paper'),
    width: $('#paper').width() + 10,
    height: 920,
    gridSize: 1,
    model: graph,
});

var uml = joint.shapes.uml;

var classes = {

    importoperation: new uml.Class({
        position: { x: $('#paper').width()/2-135 , y: 10 },
        size: { width: 270, height: 166 },
        name: 'Import operation',
        attributes: ['MRN', 'LRN', 'Additional LRN', 'Message identification', 'Declaration type', 'Additional declaration type', 'Estimated presentation of goods date and time', 'Total gross mass', 'Total packages', 'Language code'],
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
        position: { x: $('#paper').width()/2-100 , y: 440 },
        size: { width: 200, height: 75 },
        name: 'Goods shipment',
        attributes: ['Reference number/UCR', 'Country of dispatch/export', 'Country of destination'],
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
        position: { x: $('#paper').width()*0.725-80 , y: 450 },
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
        position: { x: $('#paper').width()/2-143 , y: 681 },
        size: { width: 286, height: 229 },
        name: 'Goods item',
        attributes: ['Goods item number', 'Statistical value', 'Reference number/UCR', 'Requested procedure code', 'Previous procedure code',
					 'Description of goods', 'CUS code', 'Commodity code - Combined nomenclature code', 'Commodity code - TARIC code',
					 'Gross mass', 'Supplementary units', 'Measurement declared by trader', 'Measurement declared by trader, measurement unit',
					 'Country of origin', 'Country of preferential origin'],
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

    additionalprocedure: new uml.Class({
        position: { x: 10 , y: 695 },
        size: { width: 156, height: 49 },
        name: 'Additional procedure',
        attributes: ['Additional procedure code'],
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

    taricadditional: new uml.Class({
        position: { x: 10 , y: 782 },
        size: { width: 260, height: 49 },
        name: 'Commodity code - TARIC additional code(s)',
        attributes: ['Commodity code - TARIC additional code'],
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

    nationaladditional: new uml.Class({
        position: { x: 10 , y: 861 },
        size: { width: 270, height: 49 },
        name: 'Commodity code - National additional code(s)',
        attributes: ['Commodity code - National additional code'],
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

    packages: new uml.Class({
        position: { x: $('#paper').width()*0.75-65 , y: 835 },
        size: { width: 130, height: 75 },
        name: 'Packaging',
        attributes: ['Shipping marks', 'Number of packages', 'Type of packages'],
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
        position: { x: $('#paper').width()-150 , y: 25 },
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

    submitter: new uml.Class({
        position: { x: $('#paper').width()-150 , y: 165 },
        size: { width: 170, height: 75 },
        name: 'Submitter',
        attributes: ['Submitter name', 'Submitter e-mail address', 'Submitter telephone number'],
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

    consignee: new uml.Class({
        position: { x: $('#paper').width()*0.25-20 , y: 405 },
        size: { width: 176, height: 127 },
        name: 'Consignee',
        attributes: ['Consignee identification no.','Consignee office code','Consignee name','Consignee street and number','Consignee city','Consignee postcode','Consignee country'],
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
        position: { x: 10 , y: 330 },
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

    previousdocument: new uml.Class({
        position: { x: $('#paper').width()*0.625-85 , y: 550 },
        size: { width: 170, height: 75 },
        name: 'Simplified declaration...',
        attributes: ['Goods item identifier', 'Previous document type', 'Previous document reference'],
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
        position: { x: 10 , y: 465 },
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

    transportequipment: new uml.Class({
        position: { x: $('#paper').width()*0.75-90 , y: 740 },
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

    goodslocation: new uml.Class({
        position: { x: $('#paper').width()*0.825-80 , y: 580 },
        size: { width: 160, height: 127 },
        name: 'Location of goods',
        attributes: ['Type of location', 'Qualifier of the location', 'Identification of location', 'Location street and number',
					 'Location city', 'Location postcode', 'Location country'],
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

    warehouse: new uml.Class({
        position: { x: $('#paper').width()*0.375-80 , y: 290 },
        size: { width: 160, height: 62 },
        name: 'Identification of warehouse',
        attributes: ['Warehouse identifier', 'Warehouse type'],
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

    notification: new uml.Class({
        position: { x: $('#paper').width()-130 , y: 380 },
        size: { width: 150, height: 88 },
        name: 'Notification',
        attributes: ['Notification type', 'Notification date and time', 'Notification description', 'Document link'],
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

    amendment: new uml.Class({
        position: { x: $('#paper').width()*0.5+10 , y: 370 },
        size: { width: 190, height: 49 },
        name: 'Amendment',
        attributes: ['Amendment date and time', 'Reason for amendment request'],
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

    invalidation: new uml.Class({
        position: { x: 10 , y: 235 },
        size: { width: 200, height: 75 },
        name: 'Invalidation',
        attributes: ['Invalidation request date and time', 'Reason for invalidation request', 'Document link'],
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

	decision: new uml.Class({
        position: { x: $('#paper').width()-130 , y: 600 },
        size: { width: 150, height: 49 },
        name: 'Decision',
        attributes: ['Decision date and time'],
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

	note: new uml.Class({
        position: { x: $('#paper').width()-60 , y: 690 },
        size: { width: 80, height: 62 },
        name: 'Note',
        attributes: ['Note type', 'Note text'],
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

	error: new uml.Class({
        position: { x: $('#paper').width()*0.7 , y: 315 },
        size: { width: 136, height: 88 },
        name: 'Error',
        attributes: ['Error code', 'Error reason', 'Error pointer', 'Original attribute value'],
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

	control: new uml.Class({
        position: { x: $('#paper').width()-310 , y: 200 },
        size: { width: 96, height: 75 },
        name: 'Control',
        attributes: ['Control type', 'Control location', 'Contact'],
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

	contactinfo: new uml.Class({
        position: { x: $('#paper').width()-130 , y: 270 },
        size: { width: 150, height: 75 },
        name: 'Contact information',
        attributes: ['Name', 'E-mail address', 'Telephone number'],
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

	providedinfo: new uml.Class({
        position: { x: $('#paper').width()-230 , y: 510 },
        size: { width: 140, height: 62 },
        name: 'Provided information',
        attributes: ['Description', 'Document link'],
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

createLink(classes.importoperation.id, classes.goodsshipment.id, '1', '0..1');
createLink(classes.importoperation.id, classes.consignment.id, '1', '0..1');
createLink(classes.goodsshipment.id, classes.consignment.id, '1', '0..1');
createLink(classes.goodsshipment.id, classes.goodsitem.id, '1', '1..99999');
createLink(classes.goodsshipment.id, classes.warehouse.id, '1', '1');
createLink(classes.goodsshipment.id, classes.consignee.id, '1', '0..1');
createLink(classes.importoperation.id, classes.amendment.id, '1', '0..1');
createLink(classes.importoperation.id, classes.invalidation.id, '1', '0..1');

createLink(classes.importoperation.id, classes.authorisationholder.id, '1', '0..99');
createLink(classes.importoperation.id, classes.representative.id, '1', '0..1');
createLink(classes.importoperation.id, classes.declarant.id, '1', '0..1');
createLink(classes.importoperation.id, classes.submitter.id, '1', '0..1');

createLink(classes.importoperation.id, classes.additionaldocument.id, '1', '0..99');
createLink(classes.importoperation.id, classes.additionalinformation.id, '1', '0..99');
createLink(classes.consignment.id, classes.transportequipment.id, '1', '0..9999');
createLink(classes.consignment.id, classes.goodslocation.id, '1', '1');

createLink(classes.goodsitem.id, classes.additionaldocument.id, '1', '0..99');
createLink(classes.goodsitem.id, classes.additionalinformation.id, '1', '0..99');
createLink(classes.goodsitem.id, classes.transportequipment.id, '1', '0..9999');
createLink(classes.goodsitem.id, classes.additionalprocedure.id, '1', '1..99');
createLink(classes.goodsitem.id, classes.packages.id, '1', '1..99');
createLink(classes.goodsitem.id, classes.taricadditional.id, '1', '0..99');
createLink(classes.goodsitem.id, classes.nationaladditional.id, '1', '0..99');

createLink(classes.consignment.id, classes.previousdocument.id, '1', '0..999');
createLink(classes.goodsitem.id, classes.previousdocument.id, '1', '0..99');

createLink(classes.importoperation.id, classes.notification.id, '1', '0..1');
createLink(classes.notification.id, classes.decision.id, '1', '0..1');
createLink(classes.decision.id, classes.note.id, '1', '0..999');
createLink(classes.notification.id, classes.contactinfo.id, '1', '0..1');
createLink(classes.notification.id, classes.error.id, '1', '0..999');
createLink(classes.notification.id, classes.control.id, '1', '0..1');
createLink(classes.notification.id, classes.providedinfo.id, '1', '0..999');