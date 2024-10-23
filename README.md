
# Track-Genre-Tagger

**Track-Genre-Tagger** es una biblioteca de Node.js que te permite analizar y etiquetar archivos de música con información de géneros obtenida a través de la API de Spotify. Soporta múltiples formatos de audio, como MP3, WAV y AIFF, y permite agregar el género directamente a los metadatos de los archivos de audio.

## Características

- **Análisis de archivos de música**: Escanea directorios para encontrar canciones y extraer información básica (título, artista, álbum, etc.).
- **Integración con la API de Spotify**: Utiliza la API de Spotify para obtener los géneros de los artistas de las canciones.
- **Modificación de metadatos**: Etiqueta los archivos de música con el género obtenido y guarda el cambio de manera persistente en los metadatos.
- **CLI**: Incluye una interfaz de línea de comandos para facilitar la ejecución desde la terminal.
- **Soporte para múltiples formatos**: MP3, WAV, AIFF y otros formatos de audio.

## Instalación

Puedes instalar **Track-Genre-Tagger** directamente desde npm:

```bash
npm install track-genre-tagger
```

## Uso

### Requisitos previos

- Necesitas `ffmpeg` en tu sistema
- Necesitarás credenciales de la [API de Spotify](https://developer.spotify.com/dashboard/login). 
  - Regístrate en el panel de desarrollador de Spotify.
  - Obtén tu `CLIENT_ID` y `CLIENT_SECRET`.

### Configuración

1. Crea un archivo `.env` en la raíz de tu proyecto para almacenar tus credenciales de Spotify:

   ```bash
   SPOTIFY_CLIENT_ID=tu_client_id
   SPOTIFY_CLIENT_SECRET=tu_client_secret
   ```

2. Usa la biblioteca para escanear carpetas y etiquetar tus archivos de música.

### Ejemplo de uso

#### Uso de la API:

```ts
import { main } from 'track-genre-tagger';

const folderPath = 'C:/path/to/your/music';

// Ejecutar el etiquetado de canciones con los géneros obtenidos de Spotify
main(folderPath)
    .then((taggedSongs) => {
        console.log('Canciones etiquetadas exitosamente:', taggedSongs);
    })
    .catch((error) => {
        console.error('Error al etiquetar canciones:', error);
    });
```

#### Uso desde la línea de comandos:

```bash
npx track-genre-tagger "C:/path/to/your/music" --data "C:/path/to/output"
```

Este comando analizará las canciones de la carpeta `C:/path/to/your/music` y guardará los resultados en `C:/path/to/output/songs.json`.

### API

#### `main(folderPath: string): Promise<Song[]>`

- **Descripción**: Escanea una carpeta en busca de archivos de música, obtiene el género de los artistas de las canciones a través de la API de Spotify, y etiqueta los archivos de música con el género obtenido.
- **Parámetros**:
  - `folderPath` - Ruta al directorio donde se encuentran los archivos de música.
- **Retorno**: Una promesa que se resuelve con una lista de canciones etiquetadas.

### Formatos de archivos soportados

- `.mp3`
- `.wav`
- `.aiff`
- Otros formatos compatibles con FFmpeg

## Contribuciones

Si deseas contribuir al proyecto, siéntete libre de crear un _pull request_ o abrir un _issue_ en el repositorio de GitHub.

## Licencia

Este proyecto está licenciado bajo la licencia MIT. 
