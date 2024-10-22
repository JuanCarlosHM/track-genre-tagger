import fs  from 'fs';
import { Command } from 'commander';
import { main } from './index.js';

 



const program = new Command();




program
    .version('1.0.0')
    .description('Una herramienta para analizar canciones y agregarles género')
    .argument('<folder>', 'Ruta de la carpeta que contiene las canciones')
    .option('-d, --data <file>', 'Archivo de salida para guardar las canciones analizadas (ej. analyzed_songs.json)')
    program.usage('[folder] [options]')
    .action(async (folder, options) => {
        try {

            
            const songs = await main(folder);
            console.log('Canciones analizadas:');
            console.table(songs);

            if (options.output && songs) {
                fs.writeFileSync(options.output + '/songs.json', JSON.stringify(songs, null, 2), 'utf-8');
                console.log(`Resultados guardados en ${options.output}`);
            }
        } catch (error) {
            console.error('Error al analizar las canciones:', error);
        }
    });

program.parse(process.argv);