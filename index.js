const ArgumentParser = require("argparse").ArgumentParser;
const getPeersList = require("./api");
var magnet = require("magnet-uri");

const parser = new ArgumentParser({
    version: `1.0.0`,
    addHelp: true,
    description: `Fetch peers for a torrent from top 50 trackers`,
    debug: true
});

const argGroup = parser.addMutuallyExclusiveGroup({
    required: true
});
argGroup.addArgument([`--hash`], { help: `Hash of the torrent.` });
argGroup.addArgument([`--uri`], {
    help: `Magnet URI of the torrent.`
});

let args;
try {
    args = parser.parseArgs();
} catch (err) {
    console.error(err.message);
    parser.printHelp();
    process.exit(1);
}

let torrentHash = "";
let additionalTrackers = [];

if (args.uri) {
    const parsedTorrent = magnet(args.uri);
    if (!parsedTorrent.infoHash) {
        console.error(
            `Invalid Magnet URI. Can't extract torrent hash from URI`
        );
        process.exit(1);
    }
    torrentHash = parsedTorrent.infoHash;
    additionalTrackers = parsedTorrent.announce;
} else if (args.hash) {
    torrentHash = args.hash;
}

getPeersList(torrentHash, additionalTrackers)
    .then(peerList => {
        console.log(`Count of peers found: ${peerList.length}`);
        for (let i = 0; i < peerList.length; i++) {
            console.log(peerList[i]);
        }
    })
    .catch(err => {
        console.error(`Error occured!`);
        console.error(err);
    });
