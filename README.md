# Peer Lister
Fetch peers for a torrent from top 50 trackers.

## Usage
### Fetch peers using torrent hash
```bash
node index.js --hash "xyz-hash-here"
```

### Fetch peers using Magnet URI
In case Magnet URI has trackers mentioned it also uses them along with pre-defined trackers.
```bash
node index.js --uri "magnet:?xt=urn:btih:...."
```

### Print Help
```bash
node index.js --help
```