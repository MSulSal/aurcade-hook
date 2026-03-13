const refreshNode = document.getElementById("refresh-time");
const nowPlayingNode = document.getElementById("now-playing");
const counterNode = document.getElementById("counter");

const nowPlayingList = [
  "Track and Field",
  "Mortal Kombat II",
  "Galaga",
  "Pac-Man",
  "Donkey Kong",
  "NBA Jam",
  "Street Fighter II",
];

let playIndex = 0;

function pad(value) {
  return value.toString().padStart(2, "0");
}

function updateRefreshTime() {
  if (!refreshNode) {
    return;
  }
  const now = new Date();
  refreshNode.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function rotateNowPlaying() {
  if (!nowPlayingNode) {
    return;
  }
  nowPlayingNode.textContent = nowPlayingList[playIndex];
  playIndex = (playIndex + 1) % nowPlayingList.length;
}

function tickCounter() {
  if (!counterNode) {
    return;
  }
  const current = Number(counterNode.textContent) || 0;
  const jump = Math.floor(Math.random() * 4) + 1;
  const next = current + jump;
  counterNode.textContent = next.toString().padStart(7, "0");
}

updateRefreshTime();
rotateNowPlaying();

setInterval(updateRefreshTime, 60_000);
setInterval(rotateNowPlaying, 2_600);
setInterval(tickCounter, 4_000);
