# Peer Lister
Fetch peers for a torrent from top 50 trackers.

## Usage
### Fetch peers using torrent hash
```bash
node index.js --hash "xyz-hash-here"
```

### Fetch peers using Magnet URI
If Magnet URI has trackers mentioned those trackers will also be used alongside with pre-defined trackers.
```bash
node index.js --uri "magnet:?xt=urn:btih:...."
```

### Print Help
```bash
node index.js --help
```
