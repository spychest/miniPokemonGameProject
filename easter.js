let secret = '';
const audioPath = './pokemon.mp3';
let isAudioPlay = false;
let audio = new Audio(audioPath);
const secretCode = "\x02ºèÁJ@®º0R\x90+®\x8C\x03£\tÀ®º0\x0E\x8C'\x02ºèÀ·\x9F´\në£\x04b\x82\x1B@®º0-çí\x02ºèÁ\x18 \x86ÖÚ";
window.addEventListener('keyup', (event) => {
    if (isAudioPlay === false) {
        secret += event.key;
        if (secret === btoa(secretCode)) {
            playMusic();
        }
        return;
    }
    stopMusic();
    resetSecret();
})

const playMusic = () => {
    isAudioPlay = true;
    audio.play();
    audio.volume = 0.03;
}

const stopMusic = () => {
    audio.pause();
    audio.currentTime = 0;
    isAudioPlay = false;
}

const resetSecret = () => {
    secret = '';
}