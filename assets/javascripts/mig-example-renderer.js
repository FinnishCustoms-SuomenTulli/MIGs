/*
 * MIG XML example renderer
 *
 * JavaScript replacement for assets/example.xsl.
 * It renders an XML file as styled HTML using the existing XML.css classes:
 *   st, e, c, b, m, t, xt, ns, tx, pi
 *
 * Usage:
 *   await MIGExampleRenderer.loadXmlExample(
 *     '../../common/examples/FI310A.xml',
 *     document.getElementById('FI310A')
 *   );
 */
(function (global) {
  'use strict';

  const XMLNS_NS = 'http://www.w3.org/2000/xmlns/';
  const XSLT_NS = 'http://www.w3.org/1999/XSL/Transform';

  function el(name, attrs, children) {
    const node = document.createElement(name);

    if (attrs) {
      for (const [key, value] of Object.entries(attrs)) {
        if (value !== undefined && value !== null) {
          node.setAttribute(key, String(value));
        }
      }
    }

    if (children !== undefined && children !== null) {
      append(node, children);
    }

    return node;
  }

  function text(value) {
    return document.createTextNode(value == null ? '' : String(value));
  }

  function append(parent, value) {
    if (Array.isArray(value)) {
      for (const item of value) append(parent, item);
      return parent;
    }

    if (value instanceof Node) {
      parent.appendChild(value);
      return parent;
    }

    parent.appendChild(text(value));
    return parent;
  }

  function span(className, children) {
    return el('span', className ? { class: className } : null, children);
  }

  function div(className, children) {
    return el('div', className ? { class: className } : null, children);
  }

  function nbspSpan() {
    // Matches the stylesheet's entity-ref output in the "b" span.
    return span('b', '\u00a0');
  }

  function blankSpan() {
    // Used by the stylesheet's text() template: <SPAN class="b"> </SPAN>
    return span('b', ' ');
  }

  function nodeName(node) {
    // XSLT name(.) corresponds closely to DOM nodeName for these examples.
    return node.nodeName;
  }

  function isXmlNamespaceAttribute(attr) {
    return attr.namespaceURI === XMLNS_NS || attr.name === 'xmlns' || attr.name.startsWith('xmlns:');
  }

  function renderedAttributes(elementNode) {
    // XPath @* does not include namespace declarations, but DOM attributes does.
    // Skip xmlns / xmlns:* so JS output matches the old XSLT output.
    return Array.from(elementNode.attributes || []).filter(attr => !isXmlNamespaceAttribute(attr));
  }

  function hasAttributes(elementNode) {
    return renderedAttributes(elementNode).length > 0;
  }

  function hasChildElement(elementNode) {
    return Array.from(elementNode.childNodes).some(child => child.nodeType === Node.ELEMENT_NODE);
  }

  function hasAnyNode(elementNode) {
    return elementNode.childNodes && elementNode.childNodes.length > 0;
  }

  function hasTextNode(elementNode) {
    return Array.from(elementNode.childNodes).some(child =>
      child.nodeType === Node.TEXT_NODE || child.nodeType === Node.CDATA_SECTION_NODE
    );
  }

  function hasCommentOrProcessingInstruction(elementNode) {
    return Array.from(elementNode.childNodes).some(child =>
      child.nodeType === Node.COMMENT_NODE || child.nodeType === Node.PROCESSING_INSTRUCTION_NODE
    );
  }

  function hasXsltElementChild(elementNode) {
    // Mirrors the stylesheet's xsl:* test used while assigning tag class.
    return Array.from(elementNode.childNodes || []).some(child =>
      child.nodeType === Node.ELEMENT_NODE && child.namespaceURI === XSLT_NS
    );
  }

  function tagClass(elementNode) {
    return (hasXsltElementChild(elementNode) ? 'x' : '') + 't';
  }

  function renderAttribute(attr) {
    return [
      span('ns', nodeName(attr)),
      span('m', '="'),
      span('tx', attr.value),
      span('m', '"')
    ];
  }

  function renderStartTag(elementNode) {
    const children = [
      span('m', '<'),
      span(tagClass(elementNode), nodeName(elementNode) + (hasAttributes(elementNode) ? ' ' : ''))
    ];

    for (const attr of renderedAttributes(elementNode)) {
      children.push(...renderAttribute(attr));
    }

    children.push(span('m', '>'));
    return children;
  }

  function renderEndTag(elementNode) {
    return [
      nbspSpan(),
      span('m', '</'),
      span(tagClass(elementNode), nodeName(elementNode)),
      span('m', '>')
    ];
  }

  function renderProcessingInstruction(piNode) {
    const content = piNode.target === 'xml'
      ? 'xml ' + (piNode.data || '')
      // The XSLT concatenated name(.) and . with no extra separating space.
      : nodeName(piNode) + (piNode.data || '');

    return div('e', [
      nbspSpan(),
      span('m', '<?'),
      span('pi', content),
      span('m', '?>')
    ]);
  }

  function renderTextNode(textNode) {
    return div('e', [
      blankSpan(),
      span('tx', textNode.nodeValue || '')
    ]);
  }

  function renderEmptyElement(elementNode) {
    const line = el('div', { style: 'margin-left:1em;text-indent:-2em' }, [
      nbspSpan(),
      span('m', '<'),
      span(tagClass(elementNode), nodeName(elementNode) + (hasAttributes(elementNode) ? ' ' : ''))
    ]);

    for (const attr of renderedAttributes(elementNode)) {
      append(line, renderAttribute(attr));
    }

    append(line, span('m', '/>'));
    return div('e', line);
  }

  function renderTextOnlyElement(elementNode) {
    // Corresponds to: *[text() and not(comment() or processing-instruction())]
    const line = el('div', { style: 'margin-left:1em;text-indent:-2em' }, [
      nbspSpan(),
      span('m', '<'),
      span(tagClass(elementNode), nodeName(elementNode) + (hasAttributes(elementNode) ? ' ' : ''))
    ]);

    for (const attr of renderedAttributes(elementNode)) {
      append(line, renderAttribute(attr));
    }

    append(line, [
      span('m', '>'),
      span('tx', elementNode.textContent || ''),
      span('m', '</'),
      span(tagClass(elementNode), nodeName(elementNode)),
      span('m', '>')
    ]);

    return div('e', line);
  }

  function renderElementWithChildren(elementNode) {
    // Corresponds to high-priority template: *[*]
    const open = el('div', {
      class: 'c',
      style: 'margin-left:1em;text-indent:-1.7em'
    }, renderStartTag(elementNode));

    const content = div(null, [
      renderChildren(elementNode),
      div(null, renderEndTag(elementNode))
    ]);

    return div('e', [open, content]);
  }

  function renderElementWithNodes(elementNode) {
    // Corresponds to: *[node()]
    const open = div('c', renderStartTag(elementNode));
    const content = div(null, [
      renderChildren(elementNode),
      div(null, renderEndTag(elementNode))
    ]);

    return div('e', [open, content]);
  }

  function renderNode(node) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        if (hasChildElement(node)) return renderElementWithChildren(node);
        if (hasTextNode(node) && !hasCommentOrProcessingInstruction(node)) return renderTextOnlyElement(node);
        if (hasAnyNode(node)) return renderElementWithNodes(node);
        return renderEmptyElement(node);

      case Node.TEXT_NODE:
      case Node.CDATA_SECTION_NODE:
        return renderTextNode(node);

      case Node.PROCESSING_INSTRUCTION_NODE:
        return renderProcessingInstruction(node);

      case Node.COMMENT_NODE:
        // The comment template is commented out in example.xsl, so comments disappear.
        return document.createDocumentFragment();

      default:
        return document.createDocumentFragment();
    }
  }

  function renderChildren(parentNode) {
    const fragment = document.createDocumentFragment();
    for (const child of Array.from(parentNode.childNodes)) {
      fragment.appendChild(renderNode(child));
    }
    return fragment;
  }

  function renderDownloadLink(xmlUrl, options) {
    const link = el('a', { href: xmlUrl });
    append(link, span('icon icon-tulli-external', null));
    link.firstChild.setAttribute('style', 'margin-right:3px');
    append(link, options?.downloadLabel || global.MIG_I18N.t('examples.downloadXml'));
    return link;
  }

  function renderXmlDocument(xmlDoc, xmlUrl, options) {
    const fragment = document.createDocumentFragment();

    fragment.appendChild(renderDownloadLink(xmlUrl, options));
    fragment.appendChild(el('p'));
    fragment.appendChild(div('st', renderChildren(xmlDoc)));

    return fragment;
  }

  function parseXml(xmlText, xmlUrl) {
    const xmlDoc = new DOMParser().parseFromString(xmlText, 'application/xml');
    const parseError = xmlDoc.getElementsByTagName('parsererror')[0];

    if (parseError) {
      throw new Error('Failed to parse XML' + (xmlUrl ? ` (${xmlUrl})` : '') + ': ' + parseError.textContent.trim());
    }

    return xmlDoc;
  }

  async function loadXmlExample(xmlUrl, target, options) {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
    if (!targetElement) {
      throw new Error('Target element not found for XML example renderer.');
    }

    const response = await fetch(xmlUrl, { credentials: 'same-origin' });
    if (!response.ok) {
      throw new Error(`Failed to load XML example ${xmlUrl}: ${response.status} ${response.statusText}`);
    }

    const xmlText = await response.text();
    const xmlDoc = parseXml(xmlText, xmlUrl);
    targetElement.replaceChildren(renderXmlDocument(xmlDoc, xmlUrl, options || {}));
    return xmlDoc;
  }

  global.MIGExampleRenderer = {
    loadXmlExample,
    parseXml,
    renderXmlDocument,
    renderNode
  };
})(window);
