let player;
let duration = 0;
let lastVolume = 100;
let seekBar, volumeSlider;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("ytplayer", {
    videoId: "zp1BXPX8jcU",
    playerVars: {
      controls: 0,
      modestbranding: 0,
      rel: 0,
      showinfo: 0,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  })
}

function onPlayerReady(){
  duration = player.getDuration();

  seekBar = document.getElementById("playback");
  volumeSlider = document.getElementById("volume");
  volumeSlider.value = player.getVolume();

  document.getElementById("ytplayer").classList.add("video-frame");
  document.getElementById("ytplayer").removeAttribute("width");
  document.getElementById("ytplayer").removeAttribute("height");

  //Fill updates on load
  updateSliderFill(seekBar);
  updateSliderFill(volumeSlider);

  //Event Listeners
  document
    .getElementById("play-pause")
    .addEventListener("click", togglePlayPause);
  
  document
    .getElementById("play-sign")
    .addEventListener("click", togglePlayPause);
  
  document
    .getElementById("volume-btn")
    .addEventListener("click", toggleMute);
  
  volumeSlider.addEventListener("input", handleVolume);

  seekBar.addEventListener("input", handleSeek);

  document
    .getElementById("fullscreen")
    .addEventListener("click", toggleFullscreen);

  // Keyboard shortcuts
  document.addEventListener("keydown", function(e){
    if (e.key === " ") togglePlayPause;
    if (e.key === "ArrowRight") player.seekTo(player.getCurrentTime() + 5, true);
    if (e.key === "ArrowLeft") player.seekTo(player.getCurrentTime() - 5, true);
    if (e.key === "m") toggleMute.call(document.getElementById("volume-btn"));
    if (e.key === "f") toggleFullscreen();
  })

  setInterval(updateProgress, 1000);
}

function togglePlayPause(){
  const state = player.getPlayerState();
  const overlay = document.getElementById("play-sign"),
        cover = document.querySelector(".video-cover");
  const btn = document.getElementById("play-pause");

  if (state === YT.PlayerState.PLAYING) {
    player.pauseVideo();
    overlay.style.opacity = ".7";
    btn.classList.remove("pause");
  } else {
    player.playVideo();
    overlay.style.opacity = "0";
    btn.classList.add("pause");
  }
}

function toggleMute(){
  const btn = this;
  if (player.isMuted()){
    player.unMute();
    btn.classList.remove("muted");
    volumeSlider.value = lastVolume;
    player.setVolume(lastVolume);
  } else {
    lastVolume = player.getVolume();
    player.mute();
    btn.classList.add("muted");
    volumeSlider.value = 0;
  }
  updateSliderFill(volumeSlider);
}

function handleVolume(e){
  const newVolume = parseInt(e.target.value);
  if (newVolume === 0) {
    player.mute();
    document.getElementById("volume-btn").classList.add("muted");
  } else {
    player.unMute();
    player.setVolume(newVolume);
    document.getElementById("volume-btn").classList.remove("muted");

  }
  lastVolume = newVolume;
  updateSliderFill(volumeSlider)
}

function handleSeek(e){
  player.seekTo((e.target.value / 100) * duration, true);
  updateSliderFill(seekBar)
}

function toggleFullscreen(){
  const elem = document.querySelector(".video-block");
  const btn = document.getElementById("fullscreen");

  if (!document.fullscreenElement) {
    elem.requestFullscreen().then(() => {
      btn.classList.add("full");
    });
  } else {
    document.exitFullscreen().then(() => {
      btn.classList.remove("full");
    });  
  }
}

function updateProgress(){
  const current = player.getCurrentTime();
  seekBar.value = (current / duration) * 100;
  updateSliderFill(seekBar);
}

function updateSliderFill(slider) {
  console.log("value:", slider.value);
  console.log("min:", slider.min);
  console.log("max:", slider.max);
  const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  console.log(percentage)
  slider.style.background = `linear-gradient(to right, #710707 ${percentage}%, rgba(196, 196, 196, 1) ${percentage}%)`
}

function onPlayerStateChange(event) {
  const playPauseBtn = document.getElementById("play-pause");
  const overlayPlay = document.getElementById("play-sign");
  const overlayCover = document.querySelector(".video-cover > img");

  if (event.data === YT.PlayerState.PLAYING) {
    playPauseBtn.classList.add("pause");
    overlayPlay.style.opacity = "0";
    overlayCover.style.display = "none";
  } else if (event.data === YT.PlayerState.PAUSED) {
    playPauseBtn.classList.remove("pause");
    overlayPlay.style.opacity = ".7";
  }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}