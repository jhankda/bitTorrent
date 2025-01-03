import fs from 'fs';
import bencode from 'bencode';
import crypto from 'crypto';

// Define an interface for the file structure in a multi-file torrent
interface TorrentFile {
    length: number;
    path?: string[];
}

export function parseTorrentFile(filePath: string) {
    const torrent = bencode.decode(fs.readFileSync(filePath));

    const info = torrent.info; // The "info" dictionary from the torrent file
    const infoHash = crypto.createHash('sha1').update(bencode.encode(info)).digest('hex'); // Generate SHA1 hash

    return {
        announce: torrent.announce.toString('utf8'),
        infoHash,
        pieceLength: torrent.info['piece length'],
        pieces: torrent.info.pieces,
        name: torrent.info.name.toString('utf8'),
        length: typeof torrent.info.length === 'number' ? torrent.info.length : 
                (torrent.info.files ? (torrent.info.files as TorrentFile[]).reduce((acc: number, file: TorrentFile) => acc + file.length, 0) : 0),
    };
}