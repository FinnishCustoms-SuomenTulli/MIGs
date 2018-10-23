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
        position: { x: $('#paper').width()/2-120 , y: 10 },
        size: { width: 270, height: 166 },
        name: 'Import\xE5tg\xE4rd',
        attributes: ['MRN', 'LRN', 'Ytterligare LRN', 'H\xE4ndelsens identifiering', 'Deklarationstyp', 'Typ av till\xE4ggsdeklaration',
					 'Varonas uppskattade presentationsdatum och tid', 'Total bruttomassa', 'Total antal kollin', 'Spr\xE5kkod'],
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
        position: { x: $('#paper').width()/2-73 , y: 440 },
        size: { width: 146, height: 75 },
        name: 'Varuf\xF6rs\xE4ndelse',
        attributes: ['Referensnummer/UCR', 'Avs\xE4ndnings-/exportland', 'Destinationsland'],
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
        position: { x: $('#paper').width()*0.725-50 , y: 450 },
        size: { width: 100, height: 49 },
        name: 'Leveransparti',
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
        position: { x: $('#paper').width()/2-100 , y: 681 },
        size: { width: 200, height: 203 },
        name: 'Varuparti',
        attributes: ['Varupartinummer', 'Statistiskt v\xE4rde', 'Referensnummer/UCR', 'Kod f\xF6r beg\xE4rt f\xF6rfarande', 'Kod f\xF6r f\xF6reg\xE5ende f\xF6rfarande',
					 'Varubeskrivning', 'CUS-kod', 'Varukod - KN-nummer', 'Varukod - Taric-nummer', 'Bruttomassa', 'Extra m\xE4ngdenheter',
					 'Ursprungsland', 'F\xF6rm\xE5nsursprungsland'],
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
        size: { width: 170, height: 49 },
        name: 'Ytterligare f\xF6rfarande',
        attributes: ['Kod f\xF6r ytterligare f\xF6rfarande'],
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
        size: { width: 210, height: 49 },
        name: 'Varukod - Taric-till\xE4ggsnummer',
        attributes: ['Varukod - Taric-till\xE4ggsnummer'],
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
        size: { width: 290, height: 49 },
        name: 'Varukod - nationellt/nationella till\xE4ggsnummer',
        attributes: ['Varukod - nationellt till\xE4ggsnummer'],
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
        size: { width: 110, height: 75 },
        name: 'F\xF6rpackningar',
        attributes: ['M\xE4rken', 'Antal kollin', 'Kollislag'],
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
        size: { width: 230, height: 62 },
        name: 'Tillst\xE5ndshavare',
        attributes: ['Tillst\xE5ndshavarens identifieringsnummer','Tillst\xE5ndets typ'],
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
        size: { width: 180, height: 140 },
        name: 'Ombud',
        attributes: ['Kod f\xF6r ombudets status', 'Ombudets identifieringsnummer', 'Ombudets kontorskod', 'Ombudets namn',
					 'Ombudets gatuadress', 'Ombudets ort', 'Ombudets postnummer', 'Ombudets land'],
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
        position: { x: $('#paper').width()-180 , y: 25 },
        size: { width: 200, height: 127 },
        name: 'Deklarant',
        attributes: ['Deklarantens identifieringsnummer', 'Deklarantens kontorskod', 'Deklarantens namn', 'Deklarantens gatuadress',
					 'Deklarantens ort', 'Deklarantens postnummer', 'Deklarantens land'],
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
        name: 'Inl\xE4mnare',
        attributes: ['Inl\xE4mnarens namn', 'Inl\xE4mnarens e-postadress', 'Inl\xE4mnarens telefonnummer'],
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
        size: { width: 196, height: 127 },
        name: 'Import\xF6r',
        attributes: ['Import\xF6rens identifieringsnummer', 'Import\xF6rens kontorskod', 'Import\xF6rens namn', 'Import\xF6rens gatuadress',
					 'Import\xF6rens ort', 'Import\xF6rens postnummer', 'Import\xF6rens land'],
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
        position: { x: 10 , y: 350 },
        size: { width: 150, height: 75 },
        name: 'Framlagda dokument, ...',
        attributes: ['Dokumentets typ','Dokumentes identifiering','Bilagans referens'],
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
        name: 'F\xF6renklad deklaration...',
        attributes: ['Varupartiidentifierare', 'Tidigare dokumenttyp', 'Referens till tidigare dokument'],
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
        size: { width: 200, height: 62 },
        name: 'Ytterligare uppgifter',
        attributes: ['Kod f\xF6r ytterligare uppgifter','Beskrivning f\xF6r ytterligare uppgifter'],
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
        position: { x: $('#paper').width()*0.75-90 , y: 760 },
        size: { width: 150, height: 49 },
        name: 'Transportutrustning',
        attributes: ['Containernummer'],
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
        position: { x: $('#paper').width()*0.825-85 , y: 600 },
        size: { width: 170, height: 140 },
        name: 'Varornas f\xF6rvaringsplats',
        attributes: ['Typ av plats', 'Kod f\xF6r identifieringsmetod', 'Identifiering av platsen', 'Platsens gatuadress',
					 'Platsens ort', 'Platsens postnummer', 'Platsens land'],
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
        position: { x: $('#paper').width()*0.375-75 , y: 290 },
        size: { width: 130, height: 62 },
        name: 'Identifiering av lager',
        attributes: ['Lageridentifierare', 'Lagertyp'],
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
        position: { x: $('#paper').width()-156 , y: 380 },
        size: { width: 176, height: 114 },
        name: 'Underr\xE4ttelse',
        attributes: ['Underr\xE4ttelsens typ', 'Underr\xE4ttelsens datum och tid', 'Underr\xE4ttelsens beskrivning', 'Dokumentl\xE4nk', 'Sammanh\xF6rande varuparti', 'Beg\xE4rans korrelation'],
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
        position: { x: $('#paper').width()*0.5+20 , y: 370 },
        size: { width: 183, height: 62 },
        name: 'Korrigering',
        attributes: ['Korrigeringens datum och tid', 'Orsak till korrigeringsbeg\xE4ran', 'Beg\xE4rans korrelation'],
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

 /*   invalidation: new uml.Class({
        position: { x: 10 , y: 235 },
        size: { width: 200, height: 75 },
        name: 'Mit\xE4t\xF6inti',
        attributes: ['Mit\xE4t\xF6intipyynn\xF6n p\xE4iv\xE4ys ja aika', 'Mit\xE4t\xF6intipyynn\xF6n syy', 'Asiakirjalinkki'],
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
    }),*/

	decision: new uml.Class({
        position: { x: $('#paper').width()-120 , y: 600 },
        size: { width: 140, height: 49 },
        name: 'Beslut',
        attributes: ['Beslutets datum och tid'],
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
        position: { x: $('#paper').width()-100 , y: 690 },
        size: { width: 120, height: 62 },
        name: 'Anteckning',
        attributes: ['Anteckningens typ', 'Anteckningens text'],
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
        position: { x: $('#paper').width()*0.7 , y: 325 },
        size: { width: 150, height: 88 },
        name: 'Fel',
        attributes: ['Felkod', 'Felorsak', 'Felpointer', 'Ursprungligt attributv\xE4rde'],
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
        position: { x: $('#paper').width()-300 , y: 200 },
        size: { width: 80, height: 75 },
        name: 'Kontroll',
        attributes: ['Kontrolltyp', 'Kontrollplats', 'Kontakt'],
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
        position: { x: $('#paper').width()-90 , y: 270 },
        size: { width: 110, height: 75 },
        name: 'Kontaktuppgifter',
        attributes: ['Namn', 'E-postadress', 'Telefonnummer'],
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
        position: { x: $('#paper').width()-230 , y: 520 },
        size: { width: 140, height: 75 },
        name: 'Inl\xE4mnad information',
        attributes: ['Beskrivning', 'Dokumentl\xE4nk', 'Beg\xE4rans korrelation'],
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
//createLink(classes.importoperation.id, classes.invalidation.id, '1', '0..1');

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