const HomeButton = document.getElementById("home");
const LibraryButton = document.getElementById("Library");

HomeButton.addEventListener("click", () => {
    window.location.href = "../Home/home.html";
});

LibraryButton.addEventListener("click", () => {
    window.location.href = "../Playlist/playlist.html";
});