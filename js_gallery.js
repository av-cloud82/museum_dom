//Create a list of photos
const QTY = 15;
const picsLocation = "assets/gallery/";
let imgs = appendImages(); 

window.addEventListener("scroll", showHide);

const gallery = document.querySelector('#gallery');
function showHide(){
    const rect = gallery.getBoundingClientRect();
    const halfViewport = window.innerHeight / 2;
    const toBeShown = rect.top < halfViewport


    if (rect.top < halfViewport) {
        showImages(imgs);
    } else if (rect.top >= window.innerHeight) {
        hideImages(imgs);
    }
}

function appendImages(){
    const paths = [];
    for (let i = 1; i <= QTY; i++) {
        const picsPath = `${picsLocation}galery${i}.webp`;
        paths.push(picsPath);
    }

    const allImages = [];
    for (let i = 0; i < paths.length; i++){
        const img = document.createElement("img");
        img.src = paths[i];
        img.alt = `Image ${i + 1}`;
        img.classList.add("gallery-image");
        allImages.push(img);
    }

    const shuffledImages = shuffle(allImages);

    const container1 = document.querySelector(".column1");
    const container2 = document.querySelector(".column2");
    const container3 = document.querySelector(".column3");

    const allContainers = [container1, container2, container3];

    // const visibleContainers = allContainers.filter((container) => {
    //     return window.getComputedStyle(container).display !== 'none';
    // });
    
    shuffledImages.forEach(function(each, index){
        const container = allContainers[index % allContainers.length];
        container.append(each);
    })

    return shuffledImages;
}

function showImages(images){
    images.forEach(function(each, index){
        setTimeout(function(){
            each.classList.add("show");
        }, 150 * index);
    })
}

function hideImages(images){
    images.forEach(function(each){
        each.classList.remove("show");
    })
}

function shuffle(array){
    let i = array.length, j, temp;

    while (--i > 0) {
    j = Math.floor(Math.random () * (i+1));
    temp = array[j];   
    array[j] = array[i];
    array[i] = temp;
    }
    
    return array;
}

