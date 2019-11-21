const Discovery = require("torrent-discovery");
const trackersList = require("./trackers/top50");
const Q = require("q");

function parsePeer(peer) {
    const port = peer.split(":")[1];
    if (port !== "0") {
        return peer;
    }
    return null;
}
/**
 * Returns a promise that resolves with list of peers.
 * If results are not found within specified time. Promise resolves with
 * value of peers found until then.
 *
 * @param {string} torrentHash Torrent hash
 * @param {string[]} [additionalTrackers=[]] Additional trackers to add along with pre-defined trackers. Default is empty
 * @param {number} [timeoutValue=4000] Timeout in miliseconds. Default 4000
 * @returns Promise<string[]>
 */
async function getPeersList(
    torrentHash,
    additionalTrackers = [],
    timeoutValue = 4000
) {
    const deferredPromise = Q.defer();
    const peersList = [];
    let trackersChecked = 0;
    const newTrackersList = trackersList.concat(additionalTrackers);

    // Filter out repeated trackers
    newTrackersList.filter((val, index) => {
        return newTrackersList.indexOf(val) === index;
    });

    if (!torrentHash) {
        deferredPromise.reject(new Error("Invalid torrentHash"));
        return deferredPromise.promise;
    }

    const discovery = new Discovery({
        infoHash: torrentHash,
        // PeerId is hardcorded so that we don't get listed as a peer every time we fetch list of peers
        peerId: "8b3bf58982a1b85945c7280a7db287e41beda8ad", // Can be any random value
        port: 1, // Random as we don't care about getting listed
        dht: false,
        tracker: true,
        announce: newTrackersList
    });

    const resolveAndDestroy = () => {
        if (discovery) {
            discovery.destroy();
        }

        deferredPromise.resolve(peersList);
    };

    const rejectAndDestroy = () => {
        if (discovery) {
            discovery.destroy();
        }
        deferredPromise.reject(peersList);
    };

    setTimeout(resolveAndDestroy, timeoutValue);

    discovery.on("peer", (peer, source) => {
        if (parsePeer(peer) !== null) {
            if (peersList.indexOf(peer) === -1) {
                peersList.push(peer);
            }
        }
    });

    discovery.on("warning", err => {
        trackersChecked += 1;

        if (trackersChecked === newTrackersList.length) {
            resolveAndDestroy();
        }
    });

    discovery.on("error", err => {
        rejectAndDestroy();
    });

    discovery.on("trackerAnnounce", () => {
        trackersChecked += 1;
        if (trackersChecked === newTrackersList.length) {
            resolveAndDestroy();
        }
    });

    return deferredPromise.promise;
}

module.exports = getPeersList;
