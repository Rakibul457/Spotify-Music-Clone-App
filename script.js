  let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500//`);
    let response = await a.text();
    
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for(let i=0; i<as.length; i++){
        const element = as[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }    
    return songs;
}

const playMusic = (track,pause=false)=>{
    // let audio = new Audio("/songs/" + track);
    currentSong.src = `/${currFolder}/` + track;
    if(!pause){

        currentSong.play();
        play.src = "images/pause.svg"
    }
      document.querySelector(".songinfo").innerHTML = track;
      document.querySelector(".songtime").innerHTML = "00.00 / 00.00"
}

async function main (){
  
     songs = await getSongs("songs/ncs");
    playMusic(songs[0],true)
  
    let songurl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songurl.innerHTML = songurl.innerHTML + `<li>
              <img class="invert" src="images/music.svg" alt="">
           <div class="info">
              <div>${song.replaceAll("-"," ")}</div>
              <div>Rakibul Islam Sawon</div>
           </div>
           <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="images/play.svg" alt="">
           </div>
        </li>`;
    }
     Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
        
     })
    // var audio = new Audio(songs[0])
    // // audio.play()
    // audio.addEventListener("loadeddata",()=>{
      
    //     console.log(audio.duration,audio.currentSrc,audio.currentTime);
        
    // })

    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "images/pause.svg"
        }else{
            currentSong.pause()
            play.src = "images/play.svg"
        }
    })
    currentSong.addEventListener("timeupdate",()=>{
      
       document.querySelector(".songtime").innerHTML = 
       `${secondsToMinutesSeconds(currentSong.currentTime)}/
       ${secondsToMinutesSeconds(currentSong.duration)}`
       document.querySelector(".circel").style.left = (currentSong.currentTime/currentSong.duration)*100+"%";
        
    })
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let parcent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circel").style.left = parcent +"%";
        currentSong.currentTime = ((currentSong.duration)*parcent)/100;
        
    })
    document.querySelector(".humburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0";
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%";
    })
    previous.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index-1) >= 0){
            playMusic(songs[index-1])
        }
    })
    next.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1) < songs.length-1){
            playMusic(songs[index+1])
        }
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",e=>{
        currentSong.volume = parseInt(e.target.value)/100;
        
    })
}
main();
