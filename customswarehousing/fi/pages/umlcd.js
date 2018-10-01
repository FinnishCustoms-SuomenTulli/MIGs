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
        size: { width: 240, height: 166 },
        name: 'Tuontitapahtuma',
        attributes: ['MRN', 'LRN', 'Toissijainen LRN', 'Sanoman tunniste', 'Ilmoitustyyppi', 'Lis\xE4ilmoitustyyppi', 'Tavaroiden arvioitu esitt\xE4misp\xE4iv\xE4 ja -aika', 'Kokonaisbruttomassa', 'Pakkausten kokonaism\xE4\xE4r\xE4', 'Kielikoodi'],
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
        position: { x: $('#paper').width()/2-70 , y: 440 },
        size: { width: 140, height: 75 },
        name: 'Tavaral\xE4hetys',
        attributes: ['Viitenumero/UCR', 'L\xE4hetys-/vientimaa', 'M\xE4\xE4r\xE4maa'],
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
        name: 'L\xE4hetyser\xE4',
        attributes: ['Kontti'],
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
        position: { x: $('#paper').width()/2-130 , y: 681 },
        size: { width: 260, height: 229 },
        name: 'Tavaraer\xE4',
        attributes: ['Tavaraer\xE4n numero', 'Tilastoarvo', 'Viitenumero/UCR', 'Pyydetty menettelykoodi', 'Edelt\xE4v\xE4 menettelykoodi', 'Tavaran kuvaus',
					 'CUS-koodi', 'Tavaran koodi - yhdistetyn nimikkeist\xF6n koodi', 'Tavaran koodi - Taric-koodi', 'Bruttomassa', 'Lis\xE4paljousyksik\xF6t',
					 'Toimijan ilmoittama paljous', 'Toimijan ilmoittama paljous, paljousyksikk\xF6', 'Alkuper\xE4maa', 'Etuuskohteluun oikeuttava alkuper\xE4maa'],
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
        size: { width: 130, height: 49 },
        name: 'Lis\xE4menettely',
        attributes: ['Lis\xE4menettelykoodi'],
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
        size: { width: 220, height: 49 },
        name: 'Tavaran koodi - Taric-lis\xE4koodi(t)',
        attributes: ['Tavaran koodi - Taric-lis\xE4koodi'],
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
        size: { width: 240, height: 49 },
        name: 'Tavaran koodi - kansalliset lis\xE4koodit',
        attributes: ['Tavaran koodi - kansallinen lis\xE4koodi'],
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
        name: 'Pakkaukset',
        attributes: ['L\xE4hetysmerkinn\xE4t', 'Kolliluku', 'Kollien laji'],
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
        size: { width: 170, height: 62 },
        name: 'Luvanhaltija',
        attributes: ['Luvanhaltijan tunnistenumero','Luvan tyyppi'],
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
        name: 'Edustaja',
        attributes: ['Edustajan asemaa koskeva koodi', 'Edustajan tunnistenumero', 'Edustajan toimipaikkakoodi', 'Edustajan nimi',
					 'Edustajan katuosoite', 'Edustajan postitoimipaikka', 'Edustajan postinumero', 'Edustajan maa'],
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
        name: 'Ilmoittaja',
        attributes: ['Ilmoittajan tunnistenumero', 'Ilmoittajan toimipaikkakoodi', 'Ilmoittajan nimi', 'Ilmoittajan katuosoite',
					 'Ilmoittajan postitoimipaikka', 'Ilmoittajan postinumero', 'Ilmoittajan maa'],
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
        position: { x: $('#paper').width()-190 , y: 165 },
        size: { width: 210, height: 75 },
        name: 'Ilmoituksen antaja',
        attributes: ['Ilmoituksen antajan nimi', 'Ilmoituksen antajan s\xE4hk\xF6postiosoite', 'Ilmoituksen antajan puhelinnumero'],
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
        name: 'Tuoja',
        attributes: ['Tuojan tunnistenumero', 'Tuojan toimipaikkakoodi', 'Tuojan nimi', 'Tuojan katuosoite',
					 'Tuojan postitoimipaikka', 'Tuojan postinumero', 'Tuojan maa'],
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
        size: { width: 140, height: 75 },
        name: 'Esitetyt asiakirjat, ...',
        attributes: ['Asiakirjatyyppi','Asiakirjatunniste','Liitteen viite'],
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
        name: 'Yksinkertaistettu ilmoitus...',
        attributes: ['Tavaraer\xE4n tunniste', 'Edelt\xE4v\xE4 asiakirjatyyppi', 'Edelt\xE4v\xE4n asiakirjan viite'],
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
        size: { width: 120, height: 62 },
        name: 'Lis\xE4tiedot',
        attributes: ['Lis\xE4tietokoodi','Lis\xE4tiedon kuvaus'],
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
        name: 'Kuljetusv\xE4lineet',
        attributes: ['Kontin tunnistenumero'],
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
        position: { x: $('#paper').width()*0.825-85 , y: 580 },
        size: { width: 170, height: 140 },
        name: 'Tavaran sijantipaikka',
        attributes: ['Sijaintipaikan tyyppi', 'Tunnisteen tarkenne', 'Sijaintipaikan tunniste', 'Sijaintipaikan katuosoite',
					 'Sijaintipaikan postitoimipaikka', 'Sijaintipaikan postinumero', 'Sijaintipaikan maa'],
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
        size: { width: 150, height: 62 },
        name: 'Varaston tunnistetiedot',
        attributes: ['Varaston tunniste', 'Varaston tyyppi'],
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
        name: 'Ilmoitus',
        attributes: ['Ilmoituksen tyyppi', 'Ilmoituksen p\xE4iv\xE4ys ja aika', 'Ilmoituksen kuvaus', 'Asiakirjalinkki'],
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
        size: { width: 160, height: 49 },
        name: 'Korjaus',
        attributes: ['Korjauksen p\xE4iv\xE4ys ja aika', 'Korjauspyynn\xF6n syy'],
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
    }),

	decision: new uml.Class({
        position: { x: $('#paper').width()-130 , y: 600 },
        size: { width: 150, height: 49 },
        name: 'P\xE4\xE4t\xF6s',
        attributes: ['P\xE4\xE4t\xF6ksen p\xE4iv\xE4ys ja aika'],
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
        position: { x: $('#paper').width()-110 , y: 690 },
        size: { width: 130, height: 62 },
        name: 'Huomautus',
        attributes: ['Huomautuksen tyyppi', 'Huomautuksen teksti'],
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
        size: { width: 146, height: 88 },
        name: 'Virhe',
        attributes: ['Virhekoodi', 'Virhesyy', 'Virheosoitin', 'Tiedon alkuper\xE4inen arvo'],
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
        position: { x: $('#paper').width()-330 , y: 200 },
        size: { width: 116, height: 75 },
        name: 'Tarkastus',
        attributes: ['Tarkastustyyppi', 'Tarkastuksen sijainti', 'Kontakti'],
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
        name: 'Yhteystiedot',
        attributes: ['Nimi', 'S\xE4hk\xF6postiosoite', 'Puhelinnumero'],
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
        size: { width: 100, height: 62 },
        name: 'Toimitettu tieto',
        attributes: ['Kuvaus', 'Asiakirjalinkki'],
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