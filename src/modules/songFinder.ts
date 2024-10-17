import * as fs from 'fs';
import * as path from 'path';

export function readSongsFromFolder(folderPath: string): string[] {
    
    let songs: string[] = [];

    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
        const fullPath = path.join(folderPath, file);
        const stats = fs.statSync(fullPath);


        if (stats.isDirectory()) {
            songs = songs.concat(readSongsFromFolder(fullPath));
        } else if (stats.isFile() && 
        (path.extname(file.toLocaleLowerCase()) === '.mp3' || 
            path.extname(file.toLocaleLowerCase()) === '.aiff' ||
            path.extname(file.toLocaleLowerCase()) === '.flac' || 
            path.extname(file.toLocaleLowerCase()) === '.wav')) {
            songs.push(fullPath);
        }
    });

    return songs;
}


