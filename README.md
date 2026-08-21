# Finnish Customs Message Implementing Guidelines

This repository contains the web implementation of the Finnish Customs Message Implementing Guidelines (MIGs).

The site provides technical reference documentation for customs message implementation, including:

- data requirements
- message exchange descriptions and use cases
- data model diagrams
- code lists
- XML message examples

The site is available in Finnish, Swedish, and English and supports multiple published MIG versions.

## Architecture

The MIG site is a static multi-page application.

HTML files provide the page structure, while versioned JSON files contain the documentation data. JavaScript modules load the appropriate JSON for the selected MIG version and render the page content in the browser.

The site does not require an application server, database, or build process.

The main shared modules include:

- `mig-i18n.js` – translations and language handling
- `mig-intro.js` – system/version metadata and version resolution
- `mig-ui.js` – shared user interface behavior
- `mig-utils.js` – common utility functions
- `mig-codelist-renderer.js` – shared code-list rendering
- `mig-constraint-renderer.js` – shared constraint rendering

Page-specific modules include:

- `mig-datarequirements.js`
- `mig-datamodel.js`
- `mig-messageexchange.js`
- `mig-codes.js`
- `mig-examples.js`

Some pages also use dedicated renderer modules where the rendering logic is shared with other parts of the site.

## Data

Documentation content is stored as JSON rather than embedded directly in the HTML pages.

Common versioned data includes files such as:

- `data.json`
- `usecases.json`
- XML example metadata and files

The active version is resolved from the page URL and the version information defined in `intro.json`.

This allows the same page implementation to be reused for multiple published MIG versions.

## Running locally

Because the site loads JSON and other resources using HTTP requests, it should be served through a local HTTP server rather than opened directly with a `file://` URL.

For example, from the repository root:

```bash
python -m http.server 8080
```

Then open the desired MIG page through:

```text
http://localhost:8080/
```

No build step is required.

## Page behavior

### Data Requirements

Displays message data requirements using versioned message data.

Supports message tabs, split/combined views, code-list references, constraints, and related metadata.

### Message Exchange

Displays message directions, use cases, message flows, and sequence diagrams.

Use cases can be opened individually and linked directly through URL hashes.

### Data Model

Builds the message data model dynamically from the versioned JSON data and renders it using Graphviz.

The model can be filtered by message.

### Code Lists

Displays searchable and date-aware code lists.

Code-list contents are rendered on demand when an accordion section is opened.

### Examples

Displays XML message examples using tabbed navigation and lazy loading.

## Localization

User-interface text is maintained through the shared MIG internationalization module.

Supported languages are:

- Finnish (`fi`)
- Swedish (`sv`)
- English (`en`)

Documentation data may also contain localized values which are selected at render time.

## URLs and versions

The site intentionally preserves normal multi-page URLs.

The selected MIG version is application state and is normally represented by the `version` query parameter.

Language-specific pages have separate URLs.

Canonical and language-alternate metadata are generated for the page itself rather than for individual tabs, code lists, or use cases.

## Dependencies

The site uses a small number of browser-side libraries, including:

- Bootstrap
- Graphviz/Viz.js
- svg-pan-zoom
- sequence-diagram.js
- Marked
- Vanilla Calendar

Not every dependency is used on every page.

## Performance

Dynamic pages delay or limit the visibility of content that would otherwise cause layout shifts while asynchronous data is being loaded.

Large content areas are rendered lazily where practical.

Code-list data is substantially larger than the other site datasets, so its loading behavior intentionally differs from the other dynamic pages.

## Maintenance

When changing the site:

1. Prefer shared renderers and utilities for genuinely common behavior.
2. Keep page-specific behavior in the corresponding page controller.
3. Preserve existing URLs, language handling, and version handling.
4. Test all three supported languages when changing localized behavior.
5. Test direct hash links where a page supports them.

The site is intentionally kept as a static implementation without a build pipeline or server-side application layer.
