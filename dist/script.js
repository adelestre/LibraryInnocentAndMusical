(()=>{const e=document.querySelector("body"),t=document.querySelector("#panel-center1"),r=document.querySelector("#panel-center2"),n=document.querySelector("#panel-center-overlay"),a=document.querySelector("#tiles-artists"),c=(document.querySelectorAll(".album.tile"),document.querySelector("#button-play")),l=document.querySelector("#music"),d=document.querySelector("#song-progress"),o=document.querySelector("#song-progress-fill"),s=document.querySelector("#current-time"),i=document.querySelector("#duration"),u=document.querySelector("#back-center2"),m=(document.querySelectorAll(".back-center2"),document.querySelector("#content-center2")),v=document.querySelector("#header-center2"),h=document.querySelector("#artists-slide-center2"),p=document.querySelector("#scroll-down-button"),L=document.querySelector("#scroll-up-button"),y=document.querySelector("#volume-button"),f=(document.querySelector("#volume-slider"),document.querySelector("#volume-slider-fill")),E=document.querySelector("#volume-slider-thumb"),S=document.querySelector("#songs-container-center2");var g,q=firebase.firestore();function T(e){var t=E.value;E.value=`${parseInt(t)+e}`,l.volume=E.value/400,f.style.width=24*l.volume+"vw"}function b(e){l.currentTime+=e}function w(){l.paused||l.ended?(l.play(),c.innerHTML="pause",g=setInterval(M,1e3)):(l.pause(),c.innerHTML="play_arrow",clearInterval(g))}function M(){var e="",t=Math.floor(l.currentTime/60);e+=t+":";var r=Math.floor(l.currentTime)-60*t;r<10&&(e+="0"),e+=r,s.innerHTML=e}function A(){t.classList.remove("scroll-down"),p.classList.remove("hide"),L.classList.add("hide")}function C(){t.classList.add("scroll-down"),p.classList.add("hide"),L.classList.remove("hide")}function k(e,t){return e.length>t?e.substr(0,t-3)+"...":e}e.addEventListener("keydown",(t=>{switch(e.focus(),t.code){case"Space":w();break;case"ArrowUp":T(2.5);break;case"ArrowDown":T(-2.5);break;case"ArrowLeft":b(-10);break;case"ArrowRight":b(10)}})),document.querySelectorAll("button").forEach((function(e){e.addEventListener("focus",(function(){this.blur()}))})),y.addEventListener("click",(()=>{l.muted?(l.muted=!1,y.innerHTML="volume_up"):(l.muted=!0,y.innerHTML="volume_off")})),l.addEventListener("volumechange",(()=>{f.style.width=24*l.volume+"vw"})),E.addEventListener("input",(()=>{l.volume=E.value/400})),E.value=50,l.volume=.125,c.onclick=()=>{w()},l.addEventListener("timeupdate",(()=>{o.style.width=l.currentTime/l.duration*45+"vw",M()})),d.addEventListener("click",(e=>{l.currentTime=e.offsetX/d.offsetWidth*l.duration})),M(),setTimeout((()=>{!function(){var e="",t=Math.floor(l.duration/60);e+=t+":";var r=Math.floor(l.duration)-60*t;r<10&&(e+="0"),e+=r,i.innerHTML=e}()}),500),q.collection("Artists").get().then((e=>{var c=0;e.docs.forEach((e=>{!function(e,c,l){var d=function(e,t,r){var n=document.createElement("div"),a=document.createElement("p");a.classList.add("tile-title"),a.innerHTML=k(e.data().NAME,18);var c=document.createElement("img");return c.src=e.data().img,n.appendChild(c),n.appendChild(a),n.classList="artist tile",n.id="artist"+e.data().ID_ARTIST,n.style.top=80*r+4+25*Math.floor(t/7)+"vh",n.style.left=.5+t%7*12+"vw",n}(e,c,l);d.onclick=()=>{var a,o;a=e.data().ID_ARTIST,o=e.data().NAME,q.collection("Albums").where("ID_Artist","==",a).orderBy("Date").get().then((e=>{e.forEach((e=>{!function(e){var t=document.createElement("div"),r=document.createElement("p"),n=document.createElement("p");r.classList.add("tile-title"),r.innerHTML=k(e.data().Name,30),n.classList.add("tile-date"),n.innerHTML=e.data().Date;var a=document.createElement("img");a.src=e.data().img,t.id="album"+e.data().ID_Album,t.appendChild(a),t.appendChild(r),t.appendChild(n),t.classList="tile-album",t.addEventListener("click",(()=>{var r;t.classList.contains("selected")?(t.classList.remove("selected"),S.childNodes.forEach((e=>{e.classList.contains("hide")&&e.classList.remove("hide")}))):(document.querySelectorAll(".tile-album.selected").forEach((e=>{e.classList.remove("selected")})),t.classList.add("selected"),r="album"+e.data().ID_Album,S.childNodes.forEach((e=>{e.classList.contains(r)?e.classList.remove("hide"):e.classList.add("hide")})))})),h.appendChild(t)}(e),function(e,t){q.collection("Songs").where("ID_Album","==",e.data().ID_Album).orderBy("ID_Song").get().then((r=>{r.forEach((r=>{!function(e,t,r,n,a){var c=document.createElement("div"),l=document.createElement("div");l.classList.add("song-artist-container"),c.id="song"+e.data().ID_Song,c.classList.add("tile-song"),c.classList.add("album"+a);var d=document.createElement("p");d.classList.add("title-song"),d.innerText=e.data().Name;var o=document.createElement("p");o.classList.add("Author-song"),o.innerText=t;var s=document.createElement("img");s.src=n;var i=document.createElement("button");i.innerHTML="play_arrow",i.classList.add("material-icons-round");var u=document.createElement("p");u.innerText=r,u.classList.add("tile-song-album-name");var m=document.createElement("p");m.innerText=e.data().Duration,m.classList.add("tile-song-duration");var v=document.createElement("div");v.classList.add("song-data"),c.appendChild(i),c.appendChild(s),v.appendChild(l),v.appendChild(u),v.appendChild(m),c.appendChild(v),l.appendChild(d),l.appendChild(o),c.addEventListener("click",(function(){document.querySelectorAll(".tile-song.selected").forEach((e=>{e.classList.remove("selected")})),c.classList.add("selected")})),S.appendChild(c)}(r,t,e.data().Name,e.data().img,e.data().ID_Album)}))})).catch((e=>{console.log("Error getting documents: ",e)}))}(e,o)}))})).catch((e=>{console.log("Error getting documents: ",e)})),function(e){var t=document.createElement("span");t.innerHTML=e.data().BIO,t.id="artist-bio",t.classList.add("overlay-header-center2"),v.appendChild(t)}(e),u.onclick=()=>{d.style.top=80*l+4+25*Math.floor(c/7)+"vh",d.style.left=.5+c%7*12+"vw",t.classList.remove("hide"),r.classList.add("hide"),document.querySelectorAll(".overlay-header-center2").forEach((e=>{e.classList.remove("show"),e.innerHTML=""})),h.innerHTML="",S.innerHTML="",m.classList.remove("show"),setTimeout((()=>{document.querySelector("#header-center2 .tile-selected").remove()}),500)},c>0&&(d.style.top=4+25*Math.floor(c/7)+"vh"),r.scrollTop-=200,n.appendChild(d),t.classList.add("hide"),r.classList.remove("hide"),setTimeout((()=>{var e;switch(d.style="",d.classList.add("tile-selected"),l){case 0:e=document.querySelector("#tiles-artists");break;case 1:e=document.querySelector("#tiles-albums")}var t=document.querySelector(".tile-selected p"),r=document.querySelector("#title-header-center2"),n=t.cloneNode(!0);r.appendChild(n),t.innerHTML="";var a=d.cloneNode(!0);document.querySelectorAll(".overlay-header-center2").forEach((e=>{e.classList.add("show")})),m.classList.add("show"),setTimeout((()=>{var r=document.querySelector(".tile-selected");v.appendChild(a),e.appendChild(d),t.innerHTML=n.innerHTML,r.classList.remove("tile-selected")}),500)}),500)},a.appendChild(d)}(e,c++,0)}))})),p.addEventListener("click",(()=>{A()})),L.addEventListener("click",(()=>{C()})),t.addEventListener("mousewheel",(e=>{e.wheelDelta>=0?A():C()}))})();