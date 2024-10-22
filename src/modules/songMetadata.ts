import { parseFile } from 'music-metadata'; 

export async function analyzeSong(filePath: string): Promise<Song> {
    try {
        const metadata = await parseFile(filePath);
   
        return {
            filePath,
            title: metadata.common.title || 'Unknown Title',
            artistName: metadata.common.artist || 'Unknown Artist',
            album: metadata.common.album || 'Unknown Album',
            genre: metadata.common.genre ? metadata.common.genre[0] : 'Unknown Genre',
            tagType: filePath.split('.').pop() || 'Unknown type'
        };
    } catch (error) {
        console.error(`Error al analizar la canción ${filePath}:`, error);
        return {
            filePath,
            title: 'Unknown Title',
            artistName: 'Unknown Artist',
            album: 'Unknown Album',
            tagType: 'Unknown type'
        };
    }
}
