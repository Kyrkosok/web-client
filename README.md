# Kyrksok.se web-client

Kyrksok.se is a catalog of churches in Sweden. Kyrksök was originally developed during Hack4Heritage (2016). All data used is aggregated through Wikidata and indexed from many sources such as Wikipedia, Wikimedia Commons. This web-client is a static website built with [Snowman](https://github.com/glaciers-in-archives/snowman) directly on top of a SPARQL endpoint.

## Contributing

This project is built from Go templates and SPARQL queries using the static site generator [Snowman](https://github.com/glaciers-in-archives/snowman).

### Prerequisites

 - Git
 - [Snowman](https://github.com/glaciers-in-archives/snowman)

### Setup

```bash
git clone https://github.com/Kyrkosok/web-client.git kyrksok-client

cd kyrksok-client

snowman build
```

Note that it's highly recommended that you use a local instance of the Wikidata query service as the initial build process will issue thousands of SPARQL queries.
