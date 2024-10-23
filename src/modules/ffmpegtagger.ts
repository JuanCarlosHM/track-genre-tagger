
import ffmpeg from "fluent-ffmpeg";

export async function tagSong(path : string, outputPath : string, genre? : string) : Promise<boolean> {

    return new Promise((resolve, reject) => {
        
       if(!genre) return; 
        ffmpeg()
        .input(path)
        .outputOptions(
            "-map", "0",
            "-y",
            "-codec", "copy",
            "-write_id3v2", "1",
            "-metadata", `genre=${genre}`)
        .output(outputPath)
        .on('end', () => { 
            console.log('ffmpg: tagg success');
            resolve(true); 
        })
        .on('error', (err) => {
            console.log('error on ffmpg', err);
            reject(false);
        })
        .run()
    })
   
}
