const body = document.querySelector("body");
const panel_center1 = document.querySelector("#panel-center1");
const panel_center2 = document.querySelector("#panel-center2");
const panel_center_overlay = document.querySelector("#panel-center-overlay");
const tiles_artists = document.querySelector("#tiles-artists");
const tiles_albums = document.querySelectorAll(".album.tile");
const button_play = document.querySelector("#button-play");
const music = document.querySelector("#music");
const progress = document.querySelector("#song-progress");
const progress_fill = document.querySelector("#song-progress-fill");
const current_time = document.querySelector("#current-time");
const music_duration = document.querySelector("#duration");
const back_center2 = document.querySelector("#back-center2");
const array_back_center2 = document.querySelectorAll(".back-center2");
const content_center2 = document.querySelector("#content-center2");
const header_center2 = document.querySelector("#header-center2");
const artists_slide_center2 = document.querySelector("#artists-slide-center2")
const scroll_down_button = document.querySelector("#scroll-down-button");
const scroll_up_button = document.querySelector("#scroll-up-button");
const volume_button = document.querySelector("#volume-button");
const volume_slider = document.querySelector("#volume-slider");
const volume_slider_fill = document.querySelector("#volume-slider-fill");
const volume_slider_thumb = document.querySelector("#volume-slider-thumb");
const songs_container_center2 = document.querySelector("#songs-container-center2")

var db = firebase.firestore();

body.addEventListener('keydown', (key) => { // Keys listener for music controls
    body.focus();
    switch (key.code) {
        case "Space":
            playOrPause();
            break;
        case "ArrowUp":
            modVolume(2.5);
            break;
        case "ArrowDown":
            modVolume(-2.5);
            break;
        case "ArrowLeft":
            modTime(-10);
            break;
        case "ArrowRight":
            modTime(10);
            break;
    }
})

document.querySelectorAll("button").forEach(function(item) {
    item.addEventListener('focus', function() {
        this.blur();
    })
})

function modVolume(float) { // adds 'float' to volume
    var vol = volume_slider_thumb.value
    volume_slider_thumb.value = `${parseInt(vol) + float}`;
    music.volume = volume_slider_thumb.value / 400;
    volume_slider_fill.style.width = music.volume * 24 + "vw";
}

volume_button.addEventListener('click', () => {
    if (music.muted) {
        music.muted = false;
        volume_button.innerHTML = "volume_up";
    } else {
        music.muted = true;
        volume_button.innerHTML = "volume_off";
    }
})

music.addEventListener('volumechange', () => {
    volume_slider_fill.style.width = music.volume * 24 + "vw";
})

volume_slider_thumb.addEventListener('input', () => {
    music.volume = volume_slider_thumb.value / 400;
});

volume_slider_thumb.value = 50;
music.volume = 0.125;

button_play.onclick = () => {
    playOrPause();
}

music.addEventListener('timeupdate', () => {
    progress_fill.style.width = `${(music.currentTime / music.duration) * 45}` + "vw";
    update_current_time();

});

function modTime(float) { // adds 'float' seconds to playing song's time
    music.currentTime += float;
}

progress.addEventListener('click', (e) => {
    music.currentTime = (e.offsetX / progress.offsetWidth) * music.duration;
});

var current_time_update;

function playOrPause() {
    if (!music.paused && !music.ended) {
        music.pause();
        button_play.innerHTML = 'play_arrow';
        clearInterval(current_time_update);

    } else {
        music.play();
        button_play.innerHTML = 'pause';
        current_time_update = setInterval(update_current_time, 1000);
    }
}

function update_duration() { // Update the duration displayed
    var update_string = "";
    var min = Math.floor(music.duration / 60);
    update_string += min + ":";
    var sec = Math.floor(music.duration) - min * 60;
    if (sec < 10) {
        update_string += "0";
    }
    update_string += sec;

    music_duration.innerHTML = update_string;
}

function update_current_time() { // Update playing song's time display
    var current_time_string = "";
    var min = Math.floor(music.currentTime / 60);
    current_time_string += min + ":";
    var sec = Math.floor(music.currentTime) - min * 60;
    if (sec < 10) {
        current_time_string += "0";
    }
    current_time_string += sec;

    current_time.innerHTML = current_time_string;
}

function randomNum(range, outputCount) { // Return random 'outputCount' number from 0 to range
    let arr = []
    for (let i = 0; i <= range; i++) {
        arr.push(i)
    }
    let result = [];
    for (let i = 1; i <= outputCount; i++) {
        const random = Math.floor(Math.random() * (range - i));
        result.push(arr[random]);
        arr[random] = arr[range - i];
    }
    return result;
}

update_current_time();

setTimeout(() => {
    update_duration();
}, 500)

displayArtists();

function displayArtists() {
    db.collection("Artists").get().then((snapshot) => {
        var i = 0;
        snapshot.docs.forEach(artist => {
            initialise_artist(artist, i++, 0);
        })
    })
}

function displayAlbumsFromArtist(ID_Artist, Artist_name) { // Loads all albums from Artist
    db.collection("Albums").where("ID_Artist", "==", ID_Artist).orderBy("Date").get().then((querySnapshot) => {
            querySnapshot.forEach((Album) => {
                initialise_album(Album);
                displaySongsFromAlbum(Album, Artist_name);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

function displaySongsFromAlbum(Album, Artist_name) { // Loads all songs from Artist
    db.collection("Songs").where("ID_Album", "==", Album.data()["ID_Album"]).orderBy("ID_Song").get().then((querySnapshot) => {
            querySnapshot.forEach((Song) => {
                initialise_song(Song, Artist_name, Album.data()["Name"], Album.data()["img"], Album.data()["ID_Album"]);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

function initialise_song(Song, Artist_name, Album_name, src_img, Album_ID) {
    var wtile = document.createElement("div");
    var name_artist = document.createElement("div");
    name_artist.classList.add("song-artist-container");
    wtile.id = "song" + Song.data()["ID_Song"];
    wtile.classList.add("tile-song");
    wtile.classList.add("album" + Album_ID);
    var title = document.createElement("p");
    title.classList.add('title-song');
    title.innerText = Song.data()["Name"];
    var artist = document.createElement("p");
    artist.classList.add("Author-song");
    artist.innerText = Artist_name;
    var img = document.createElement("img");
    img.src = src_img;
    var button = document.createElement("button");
    button.innerHTML = "play_arrow";
    button.classList.add("material-icons-round");
    var album_name = document.createElement('p');
    album_name.innerText = Album_name;
    album_name.classList.add('tile-song-album-name');
    var duration = document.createElement('p');
    duration.innerText = Song.data()["Duration"];
    duration.classList.add('tile-song-duration');
    var song_data = document.createElement("div");
    song_data.classList.add('song-data');
    wtile.appendChild(button);
    wtile.appendChild(img);
    song_data.appendChild(name_artist);
    song_data.appendChild(album_name);
    song_data.appendChild(duration);
    wtile.appendChild(song_data);
    name_artist.appendChild(title);
    name_artist.appendChild(artist);
    wtile.addEventListener('click', function select_song() {
        var selected_songs = document.querySelectorAll(".tile-song.selected");
        selected_songs.forEach((selected_song) => {
            selected_song.classList.remove("selected");
        })
        wtile.classList.add('selected');
    })
    songs_container_center2.appendChild(wtile);
}

function initialise_artist(Artist, i, int) {
    var tile = create_artist_tile(Artist, i, int);
    tile.onclick = () => {
        displayAlbumsFromArtist(Artist.data()["ID_ARTIST"], Artist.data()["NAME"]);
        load_bio(Artist);
        // fonction back to center1
        back_center2.onclick = () => {
                tile.style.top = (80 * int) + 4 + (25 * (Math.floor(i / 7))) + "vh";
                tile.style.left = (0.5 + (12 * (i % 7))) + "vw";
                panel_center1.classList.remove("hide");
                panel_center2.classList.add("hide");
                var overlay_header_center2 = document.querySelectorAll(".overlay-header-center2");
                overlay_header_center2.forEach((overlay) => {
                    overlay.classList.remove("show");
                    overlay.innerHTML = "";
                })
                artists_slide_center2.innerHTML = "";
                songs_container_center2.innerHTML = "";
                content_center2.classList.remove("show");
                setTimeout(() => {
                    document.querySelector("#header-center2 .tile-selected").remove();
                }, 500);
            }
            // **********************
        if (i > 0) {
            tile.style.top = 4 + (25 * (Math.floor(i / 7))) + "vh";
        }
        // Animation 1
        panel_center2.scrollTop -= 200;
        panel_center_overlay.appendChild(tile);
        panel_center1.classList.add("hide");
        panel_center2.classList.remove("hide");
        // Animation 2
        setTimeout(() => {
            tile.style = "";
            tile.classList.add("tile-selected");
            var tiles
            switch (int) {
                case 0:
                    tiles = document.querySelector("#tiles-artists");
                    break;
                case 1:
                    tiles = document.querySelector("#tiles-albums");
                    break
            }
            var album_title = document.querySelector(".tile-selected p");
            var title_header_center2 = document.querySelector("#title-header-center2");
            var title_clone = album_title.cloneNode(true);
            title_header_center2.appendChild(title_clone);
            album_title.innerHTML = "";
            var clone_tile = tile.cloneNode(true);
            var overlay_header_center2 = document.querySelectorAll(".overlay-header-center2");
            overlay_header_center2.forEach((overlay) => {
                overlay.classList.add("show");
            })
            content_center2.classList.add("show");
            // Animation 3
            setTimeout(() => {
                var tile_selected = document.querySelector(".tile-selected");
                header_center2.appendChild(clone_tile);
                tiles.appendChild(tile);
                album_title.innerHTML = title_clone.innerHTML;
                tile_selected.classList.remove("tile-selected");
            }, 500);
        }, 500);
    }
    tiles_artists.appendChild(tile);
}

function create_artist_tile(Artist, i, int) { // Artist's data treatment to create a tile
    var tile = document.createElement('div');
    var title = document.createElement('p');
    title.classList.add('tile-title');
    title.innerHTML = truncate(Artist.data()["NAME"], 18);
    var img = document.createElement('img');
    img.src = Artist.data()["img"];
    tile.appendChild(img);
    tile.appendChild(title);
    tile.classList = "artist tile";
    tile.id = "artist" + Artist.data()["ID_ARTIST"];
    tile.style.top = (80 * int) + 4 + (25 * (Math.floor(i / 7))) + "vh";
    tile.style.left = (0.5 + (12 * (i % 7))) + "vw";
    return tile;
}

function initialise_album(Album) { // Function called when an artist is clicked. Loads its albums from db
    var tile = document.createElement('div');
    var title = document.createElement('p');
    var date = document.createElement('p');
    title.classList.add('tile-title');
    title.innerHTML = truncate(Album.data()["Name"], 30);
    date.classList.add('tile-date');
    date.innerHTML = Album.data()["Date"];
    var img = document.createElement('img');
    img.src = Album.data()["img"];
    tile.id = "album" + Album.data()["ID_Album"];
    tile.appendChild(img);
    tile.appendChild(title);
    tile.appendChild(date);
    tile.classList = "tile-album";
    tile.addEventListener('click', () => {
        if (tile.classList.contains('selected')) {
            tile.classList.remove("selected");
            unsort_songs();
        } else {
            var selected_albums = document.querySelectorAll(".tile-album.selected");
            selected_albums.forEach((selected_album) => {
                selected_album.classList.remove("selected");
            })
            tile.classList.add('selected');
            sort_songs("album" + Album.data()["ID_Album"]);
        }
    })
    artists_slide_center2.appendChild(tile);
}

function unsort_songs() {
    songs_container_center2.childNodes.forEach((song) => {
        if (song.classList.contains("hide")) {
            song.classList.remove("hide");
        }
    })
}

function sort_songs(album_ID) {
    songs_container_center2.childNodes.forEach((song) => {
        if (song.classList.contains(album_ID)) {
            song.classList.remove("hide");
        } else {
            song.classList.add("hide");
        }
    })
}

function load_bio(Artist) {
    var bio = document.createElement("span");
    bio.innerHTML = Artist.data()["BIO"];
    bio.id = "artist-bio";
    bio.classList.add('overlay-header-center2');
    header_center2.appendChild(bio);
}

scroll_down_button.addEventListener('click', () => {
    scroll_up();
})

scroll_up_button.addEventListener('click', () => {
    scroll_down();
})

function scroll_up() {
    panel_center1.classList.remove('scroll-down');
    scroll_down_button.classList.remove('hide');
    scroll_up_button.classList.add('hide');
}

function scroll_down() {
    panel_center1.classList.add('scroll-down');
    scroll_down_button.classList.add('hide');
    scroll_up_button.classList.remove('hide');
}

panel_center1.addEventListener('mousewheel', (event) => {
    if (event.wheelDelta >= 0) {
        scroll_up();
    } else {
        scroll_down();
    }
})

function truncate(str, n) { // truncate a string to n char, replacing the last 3 to ...
    return (str.length > n) ? str.substr(0, n - 3) + '...' : str;
}