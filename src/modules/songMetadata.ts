import { parseFile } from 'music-metadata'; // Importación directa del módulo ESM

export async function analyzeSong(filePath: string): Promise<Song> {
    try {
        const metadata = await parseFile(filePath);
        
        return {
            filePath,
            title: metadata.common.title || 'Unknown Title',
            artist: metadata.common.artist || 'Unknown Artist',
            album: metadata.common.album || 'Unknown Album',
            genre: metadata.common.genre ? metadata.common.genre[0] : 'Unknown Genre'
        };
    } catch (error) {
        console.error(`Error al analizar la canción ${filePath}:`, error);
        return {
            filePath,
            title: 'Unknown Title',
            artist: 'Unknown Artist',
            album: 'Unknown Album'
        };
    }
}
