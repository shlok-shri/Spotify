console.log("Hello")
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesAndSeconds(seconds) {
    // Ensure the input is a valid number and non-negative
    seconds = isNaN(seconds) ? 0 : Math.max(0, seconds);
  
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    // Pad single-digit seconds with a leading zero
    const formattedSeconds = (remainingSeconds < 10) ? `0${remainingSeconds}` : `${remainingSeconds}`;
  
    // Pad single-digit minutes with a leading zero
    const formattedMinutes = (minutes < 10) ? `0${minutes}` : `${minutes}`;
  
    // Return the formatted time
    return `${formattedMinutes}:${formattedSeconds}`;
  }

async function getSongs (folder){
    currFolder = folder
    let a = await fetch(`${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }

    let songsUl = document.querySelector(".songsList").getElementsByTagName("ul")[0]
    songsUl.innerHTML = ""
    for (const song of songs) {
        songsUl.innerHTML = songsUl.innerHTML + `<li>
        <img src="images/music.svg" alt="Music">
        <div class="info">
            <div>${song.replaceAll("%20", " ").replace(".mp3", "").replace("hits/", "").replace("ChillMood/", "")}</div>
            <div>Shlok</div>
        </div>
        <div class="playnow">
            <img class = "invert" src="images/play.svg" alt="play">
        </div>
    </li> `
    }

    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())  
        })      
    });
    return songs
}

const playMusic = (track, pause = false) => {
//   let audio = new Audio("/songs/" + track + ".mp3")
    currentSong.src = `${currFolder}/` + track + ".mp3"
    if(!pause){
        currentSong.play()  
        play.src = "images/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track).replace(".mp3", "")
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


async function main(){

    songs = await getSongs("songs/ChillMood")
    playMusic(songs[0].replace(".mp3", "").replace("hits/", "").replace("ChillMood/", ""), true)
    // console.log(songs)

    

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "images/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "images/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)} / ${secondsToMinutesAndSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
       document.querySelector(".circle").style.left = percent + "%"
       currentSong.currentTime = (currentSong.duration*percent)/100
    }   
    )

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-100%"
    })

    prev.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/songs/")[1]) - 1;
        if (index != -1 ){
            playMusic(songs[index].replace(".mp3", "").replace("hits/", "").replace("ChillMood/", ""))
        }
    })
    
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/songs/")[1]) + 1;
        if (index != songs.length){
            playMusic(songs[index].replace(".mp3", "").replace("hits/", "").replace("ChillMood/", ""))
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e, e.target, e.target.value)
        currentSong.volume = parseInt(e.target.value)/100
    })
    let volume = currentSong.volume
    vol.addEventListener("click", () => {
        if ((vol.src).split("/images/")[1] == "volume.svg"){
            vol.src = "images/mute.svg"
            currentSong.muted = true
        }
        else{
            vol.src = "images/volume.svg"
            currentSong.muted = false
            currentSong.volume = volume
        }
    })

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click",async item => {
            console.log(item.currentTarget)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            console.log(item.dataset.folder)
        })
    })
}
main()