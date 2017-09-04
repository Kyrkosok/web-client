# Kyrksok.se web-client

Kyrksok.se is a catalog of churches in Sweden. Kyrksök was originally developed during Hack4Heritage (2016). All data used is aggregated through Wikidata and indexed from many sources such as Wikipedia, Wikimedia Commons and Kulturarvsdata. This web-client is built on top of the [open REST like API](https://github.com/Kyrkosok/api).

Read about personas and the project on [hackdash](https://hackdash.org/projects/57f9fe6bd9284f016c047589).
Especially, see the [wireframe](http://bit.ly/trådmodell) to get a sense of the original vision of the app.

## Contributing

### Prerequisites

 - Git
 - Node.js 7+
 - NPM 4+
 - [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/)

Include the ChromeDriver location in your `PATH` environment variable.

### Setup

```bash
git clone https://github.com/Kyrkosok/web-client.git kyrksok-client

cd kyrksok-client

npm install
```

Running the client (Source not compiled):

```bash
npm start
```

### Testing

```bash
npm start
npm test
```

### Building

```bash
gulp
```

Please note that it's recommended that you also run the tests against the compiled version if you have introduced new files or made any changes to the build process.
