import { Howl } from 'howler';

// TODO: Implement sound player using the "howler" package
// Simple map to store our sounds
const soundLibrary: { [key: string]: Howl } = {};

export const sound = {
    /**
     * Add a sound to the library
     * @param alias Name to refer to the sound by
     * @param url Path to the sound file
     */
    add: (alias: string, url: string): void => {
        try {
            soundLibrary[alias] = new Howl({
                src: [url],
                preload: true,
                html5: true
            });
            console.log(`Sound added: ${alias} from ${url}`);
        } catch (error) {
            console.error(`Error adding sound: ${alias}`, error);
        }
    },

    /**
     * Play a sound by its alias
     * @param alias The name of the sound to play
     */
    play: (alias: string): void => {
        try {
            const sound = soundLibrary[alias];
            if (sound) {
                sound.play();
                console.log(`Playing sound: ${alias}`);
            } else {
                console.warn(`Sound not found: ${alias}`);
            }
        } catch (error) {
            console.error(`Error playing sound: ${alias}`, error);
        }
    },

    /**
     * Stop a sound by its alias
     * @param alias The name of the sound to stop
     */
    stop: (alias: string): void => {
        try {
            const sound = soundLibrary[alias];
            if (sound) {
                sound.stop();
                console.log(`Stopped sound: ${alias}`);
            }
        } catch (error) {
            console.error(`Error stopping sound: ${alias}`, error);
        }
    }
};
