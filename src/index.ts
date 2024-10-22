import path from "path";
import { readSongsFromFolder } from "./modules/songFinder.js";
import { analyzeSong } from "./modules/songMetadata.js";
import { authenticateSpotify, getArtistGenres, getSongData } from "./services/spotify.service.js";
import { tagSong } from "./modules/ffmpegtagger.js";
import * as fs from 'fs';



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

async function getSongsData(listOfSongs: Song[], token: string): Promise<Promise<Song>[]> {

    const arrayOfpromises: Promise<Song>[] = [];

    listOfSongs.forEach(song => {

        const promise = new Promise<Song>(async (resolve, reject) => {

            const songData = await getSongData(song.title, token);
            if (!songData.artistId) reject('no artist data');

            const artistGenres = await getArtistGenres(songData.artistId!, token);
            if (!artistGenres.length) reject('no artist data');

            song.genre = artistGenres.toString();
            resolve(song);
        })

        arrayOfpromises.push(promise);
    });

    return arrayOfpromises;
}

async function tagGenreSongs(taggedSongs: Song[], outputFile: string) {
    
    const arrayOfpromises: Promise<Song>[] = [];

    taggedSongs.forEach(song => {

        const promise = new Promise<Song>(async (resolve, reject) => {

            if(!song.filePath || !song.genre) reject('no data to tag');

            const outputPath = path.normalize(`${outputFile}/${song.title}.${song.tagType}`);
            
            const isTagged = await tagSong(song.filePath, outputPath, song.genre); 
            
            if(isTagged) resolve(song);
        })

        arrayOfpromises.push(promise);
    });

    return arrayOfpromises;
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


    let getSongDataPromises: Promise<Song>[];
    const taggedSongs: Song[] = [];

    try {
        
        getSongDataPromises = await getSongsData(listOfSongs, token);
        await Promise.allSettled(getSongDataPromises)
            .then((results) =>
                results.forEach((result) => {
                    if (result.status === "fulfilled") {
                        taggedSongs.push(result.value);
                    }
                }),
            );

        if (!taggedSongs.length) throw new Error('No songs data');
    }
    catch (e) {
        console.log('error to get songs data:' + e);
    }

    let tagSongDataPromises: Promise<Song>[];
    let resultSongs : Song[] = []; 

    
    const outputPath = path.normalize(folderPath + '/taggedSongs');

    if (fs.existsSync(outputPath)) throw new Error('"taggedSongs" folder already exist. Please delete it from folder to scan');
        
    fs.mkdirSync(outputPath);
        
    
    
    try {
        
        tagSongDataPromises = await tagGenreSongs(taggedSongs, outputPath);
        await Promise.allSettled(tagSongDataPromises)
            .then((results) =>
                results.forEach((result) => {
                    if (result.status === "fulfilled") {
                        resultSongs.push(result.value);
                    }
                }),
            );

        if (!taggedSongs.length) throw new Error('No songs data');
        
    } catch (e) {
        throw new Error('Error to tag' + e);
    }


    return resultSongs; 

}

