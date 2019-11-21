const ArgumentParser = require("argparse").ArgumentParser;
const getPeersFromHash = require("./api").getPeersFromHash;
const getPeersFromMagnetURI = require("./api").getPeersFromMagnetURI;

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

let peerListPromise = null;

if (args.uri) {
    peerListPromise = getPeersFromMagnetURI(args.uri);
} else if (args.hash) {
    peerListPromise = getPeersFromHash(args.hash);
}

if (peerListPromise === null) {
    console.error("Invalid hash or magnet URL provided!");
    process.exit(1);
}

peerListPromise
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
