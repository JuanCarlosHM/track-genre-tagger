import * as dotenv from 'dotenv';
import { SpotifyResponseUserCredentials } from '../interfaces/spotifyResponseUserCredentials';
import { SpotifyResponseSong } from '../interfaces/spotifyResponseSong';
import { SpotifyResponseArtist } from '../interfaces/spotifyResponseArtist';

dotenv.config();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let accessToken: string;


export async function authenticateSpotify(): Promise<string> {

    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) throw new Error('Invalid credentials');

    const headers = new Headers();
    const params = new URLSearchParams();
    const tokenUrl = 'https://accounts.spotify.com/api/token?';
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    const options = {
        method: 'POST',
        headers: headers,
    }

    params.set('grant_type', 'client_credentials');
    params.set('client_id', SPOTIFY_CLIENT_ID);
    params.set('client_secret', SPOTIFY_CLIENT_SECRET);

    try {

        const response = await fetch(tokenUrl + params, options);
        if (response?.ok) {
            const data = await response.json() as SpotifyResponseUserCredentials;
            accessToken = data.access_token;
            return accessToken;
        } else {
           throw new Error(response.status + response.statusText); 
        }


    } catch (error) {
        console.log('There was an error', error);
        throw new Error('error' + error);
    }

}


export async function getSongData(songTitle: string, token: string): Promise<Song> {
    
    if (!token) throw new Error('Invalid credentials');

    const params = new URLSearchParams();
    const tokenUrl = 'https://api.spotify.com/v1/search?';
    const headers = new Headers();
    
    headers.set('Authorization', `Bearer ${token}`);

    const options = {
        method: 'GET',
        headers: headers
    }

    params.set('q', songTitle);
    params.set('type', 'track');

    try {
        const response = await fetch(tokenUrl + params, options);
        if (response?.ok) {
            const data = await response.json() as SpotifyResponseSong;

            if(!data.tracks.items[0]) throw new Error('No data about this song! ' + songTitle);

            const songData : Song = {
                title: data.tracks.items[0].name,
                artistId: data.tracks.items[0].artists[0].id,
                artistName: data.tracks.items[0].artists[0].name,
                album: data.tracks.items[0].album.album_type,
                filePath: '',
                tagType: ''
            }
            return songData;
        } else {
            const error = new Error('Spotify API request failed') as any;
            error.response = response;  
            error.status = response.status; 
            error.statusText = response.statusText; 
            throw error; 
        }


    } catch (error) {
        console.log('There was an error');
        throw error
    }
   
}



export async function getArtistGenres(artistID: string, token: string): Promise<String[]> {
    
    if (!token) throw new Error('Invalid credentials');

    const tokenUrl = 'https://api.spotify.com/v1/artists/';
    const headers = new Headers();
    
    headers.set('Authorization', `Bearer ${token}`);

    const options = {
        method: 'GET',
        headers: headers
    }


    try {
        
        const response = await fetch(tokenUrl + artistID, options);
        if (response?.ok) {
            const data = await response.json() as SpotifyResponseArtist;
            return data.genres;

        } else {
            throw new Error(response.status + response.statusText); 
        }


    } catch (error) {
        console.log('There was an error', error);
        throw new Error('error' + error);
    }
   
}