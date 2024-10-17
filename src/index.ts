import { readSongsFromFolder } from "./modules/songFinder.js";
import { analyzeSong } from "./modules/songMetadata.js";

async function analyzeSongsInFolder(folderPath: string): Promise<Song[]> {
    const songFiles = readSongsFromFolder(folderPath);
    const songPromises = songFiles.map(analyzeSong);
    return Promise.all(songPromises);
}


export async function main(folderPath: string): Promise<Song[]> {
    const songs = await analyzeSongsInFolder(folderPath);
    return songs;
    // console.log('Canciones analizadas: ', songs);
}