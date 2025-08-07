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
    console.log(rect.top)
    console.log(halfViewport)


    if (rect.top < halfViewport) {
        showImages(imgs);
        console.log("1 function fired")
    } else if (rect.top >= window.innerHeight) {
        hideImages(imgs);
        console.log("2 function fired")
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

    const visibleContainers = allContainers.filter((container) => {
        return window.getComputedStyle(container).display !== 'none';
    });
    
    shuffledImages.forEach(function(each, index){
        const container = visibleContainers[index % visibleContainers.length];
        container.append(each);
    })

    return shuffledImages;
}

function showImages(images){
    images.forEach(function(each, index){
        setTimeout(function(){
            each.classList.add("show");
        }, 100 * index);
    })
}

function hideImages(images){
    images.forEach(function(each){
        each.classList.remove("show");
    })
}

function shuffle(array){
    //   set the index to the arrays length
    let i = array.length, j, temp;
    //   create a loop that subtracts everytime it iterates through
    while (--i > 0) {
    //  create a random number and store it in a variable
    j = Math.floor(Math.random () * (i+1));
    // create a temporary position from the item of the random number    
    temp = array[j];
    // swap the temp with the position of the last item in the array    
    array[j] = array[i];
    // swap the last item with the position of the random number 
    array[i] = temp;
    }
    
    return array;
}

