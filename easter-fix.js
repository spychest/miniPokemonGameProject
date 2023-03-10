const audioPath = './pokemon.mp3';
const audio = new Audio(audioPath);
const secretCode = "\x02ºèÁJ@®º0R\x90+®\x8C\x03£\tÀ®º0\x0E\x8C'\x02ºèÀ·\x9F´\në£\x04b\x82\x1B@®º0-çí\x02ºèÁ\x18 \x86ÖÚ";

let isAudioPlaying = false;
let secret = '';

const playMusic = () => {
  isAudioPlaying = true;
  audio.play();
  audio.volume = 0.03;
};

const stopMusic = () => {
  audio.pause();
  audio.currentTime = 0;
  isAudioPlaying = false;
};

const resetSecret = () => {
  secret = '';
};

window.addEventListener('keyup', (event) => {
  if (!isAudioPlaying) {
    secret += event.key;
    if (secret === btoa(secretCode)) {
      playMusic();
    }
    return;
  }
  stopMusic();
  resetSecret();
});
