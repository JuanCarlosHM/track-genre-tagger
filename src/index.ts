import path from "path";
import { readSongsFromFolder } from "./modules/songFinder.js";
import { analyzeSong } from "./modules/songMetadata.js";
import { authenticateSpotify, getArtistGenres, getSongData } from "./services/spotify.service.js";
import { tagSong } from "./modules/ffmpegtagger.js";
import * as fs from 'fs';



function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function handleAbsolutePath(inputPath: string): string {
    if (path.isAbsolute(inputPath)) {
        return path.normalize(inputPath);
    } else {
        return path.resolve(inputPath);
    }
}

async function analyzeSongsInFolder(folderPath: string): Promise<Song[]> {
    const songFiles = readSongsFromFolder(folderPath);
    const songPromises = songFiles.map(analyzeSong);
    return Promise.all(songPromises);
}

async function getSongs(folderPath: string): Promise<Song[]> {
    const songs = await analyzeSongsInFolder(folderPath);
    return songs;
}

async function getSongsData(listOfSongs: Song[], token: string): Promise<Song[]> {

    const arraySongsWithData: Song[] = [];
    const RATE_LIMIT_MS = 1000;

    for (let song of listOfSongs) {
        try {
            await sleep(RATE_LIMIT_MS);
            const songData = await getSongData(song.title, token);
            if (!songData.artistId) throw new Error('no artist data ' + song.title);

            const artistGenres = await getArtistGenres(songData.artistId!, token);
            if (!artistGenres.length) throw new Error('no artist data genre ' + songData.artistName + songData.title + song.filePath);

            song.genre = artistGenres.toString();
            arraySongsWithData.push(song);

        } catch (error) {
            console.log('error in getSongsData: ' + error);
        }
    }
    return arraySongsWithData; 
}

async function tagGenreSongs(taggedSongs: Song[], outputFile: string) {

    const arrayffmpegTaggedSongs = [];
     
    for(let song of taggedSongs) {

        if (!song.filePath || !song.genre) throw Error('no data to tag');
         

            const outputPath = path.normalize(`${outputFile}/${song.title.replace(/[^a-zA-Z0-9 ]/g, '')}.${song.tagType}`);

            const isTagged = await tagSong(song.filePath, outputPath, song.genre);
            
            if(isTagged) {
                arrayffmpegTaggedSongs.push(song);
            }
    };
    
    return arrayffmpegTaggedSongs;
}

export async function main(folderPath: string) {

    const resolvedPath = handleAbsolutePath(folderPath);

    if (!resolvedPath) throw new Error('path error');

    const listOfSongs = await getSongs(folderPath);

    if (!resolvedPath) throw new Error('No songs found');

    let token = '';

    try {
        token = await authenticateSpotify();
    }
    catch (e) {
        console.log('spotify token error:' + e);
    }

    if (!token) throw new Error('spotify token error');


    let taggedSongs: Song[] = [];

    
    try {

        taggedSongs = await getSongsData(listOfSongs, token);
        
        if (!taggedSongs.length) throw new Error('No songs data');
        console.log(taggedSongs.length);
    }
    catch (e) {
        console.log('error to get songs data:' + e);
    }

    

    const outputPath = path.normalize(folderPath + '/taggedSongs');

    if (fs.existsSync(outputPath)) throw new Error('"taggedSongs" folder already exist. Please delete it from folder to scan');

    fs.mkdirSync(outputPath);

    let ffmpegTaggedSongs : Song[] = [];

    try {

        ffmpegTaggedSongs = await tagGenreSongs(taggedSongs, outputPath);
       

        if (!ffmpegTaggedSongs.length) throw new Error('No songs data');


    } catch (e) {
        throw new Error('Error to tag' + e);
    }

    return ffmpegTaggedSongs; 
}


