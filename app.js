// Mobile Menu
const menuToggle = document.querySelector("#menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu-wrapper");
const overlay = document.querySelector("#menu-overlay");
menuToggle.addEventListener("click", function(e){
    e.stopPropagation();
    menuToggle.classList.toggle("active");
    mobileMenu.classList.toggle("active");
})

document.addEventListener("click", function(e){
    if(
        mobileMenu.classList.contains("active") &&
        !mobileMenu.contains(e.target)
    ){
        menuToggle.classList.remove("active");
        mobileMenu.classList.remove("active");
    }
})

const links = mobileMenu.querySelectorAll("a")
links.forEach(function(link){
    link.addEventListener("click", function(){
        menuToggle.classList.remove("active");
        mobileMenu.classList.remove("active");
    })
})


// Hero Slider
let items = document.querySelectorAll(".carousel .item"),
    navDots = document.querySelectorAll(".slider-dot"),
    currentItem = 0,
    isEnabled = true;

function changeCurrentItem(n){
    currentItem = (n + items.length) % items.length;
    updateIndex(currentItem);
}

function updateIndex(index){
    document.querySelector("#slider-index").innerText = `0${index + 1}`;
}

function hideItem(direction){
    isEnabled = false;
    items[currentItem].classList.add(direction);
    items[currentItem].addEventListener("animationend", function(){
        this.classList.remove("active", direction);
    })
    navDots[currentItem].classList.remove("active");
}

function showItem(direction){
    items[currentItem].classList.add("next", direction);
    items[currentItem].addEventListener("animationend", function(){
        this.classList.remove("next", direction);
        this.classList.add("active");
        isEnabled = true;
    })
    navDots[currentItem].classList.add("active");
}

function nextItem(targetIndex){
    hideItem("to-left");
    changeCurrentItem(targetIndex);
    showItem("from-right");
}

function previousItem(targetIndex){
    hideItem("to-right");
    changeCurrentItem(targetIndex);
    showItem("from-left");
}


document.querySelector(".control.left").addEventListener("click", function(){
    if(isEnabled){
        previousItem(currentItem - 1); 
    }
})

document.querySelector(".control.right").addEventListener("click", function(){
    if(isEnabled){
        nextItem(currentItem + 1); 
    }
})

navDots.forEach(function(dot, index){
    dot.addEventListener("click", function(){
        if(index === currentItem){
            return;
        }
        if(index > currentItem){
            nextItem(index);
        } else {
            previousItem(index);
        }
    })
})
    


const swipedetect = (el) => {
  
	let surface = el,
	    startX = 0,
        startY = 0,
        distX = 0,
        distY = 0,
        startTime = 0,
        elapsedTime = 0;

	let threshold = 10,
        restraint = 100,
        allowedTime = 1000,
        isHorizontalSwipe = false;
    
	surface.addEventListener('mousedown', function(e){
		startX = e.pageX;
		startY = e.pageY;
		startTime = new Date().getTime();
		e.preventDefault();
	}, false);


	surface.addEventListener('mouseup', function(e){
		distX = e.pageX - startX;
		distY = e.pageY - startY;
		elapsedTime = new Date().getTime() - startTime;
		if (elapsedTime <= allowedTime){
			if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
				if ((distX > 0)) {
					if (isEnabled) {
						previousItem(currentItem - 1);
					}
				} else {
					if (isEnabled) {
						nextItem(currentItem + 1);
					}
				}
			}
		}
		e.preventDefault();
	}, false);


	surface.addEventListener('touchstart', function(e){
		if (e.target.classList.contains('arrow') || e.target.classList.contains('control')) {
			if (e.target.classList.contains('left')) {
				if (isEnabled) {
					previousItem(currentItem - 1);
				}
			} else {
				if (isEnabled) {
					nextItem(currentItem + 1);
				}
			}
		}

        var touchobj = e.changedTouches[0];
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime();
        isHorizontalSwipe = false;
        // e.preventDefault();
        
	}, false);


	surface.addEventListener('touchmove', function(e){
		const touch = e.changedTouches[0];
        const deltaX = touch.pageX - startX;
        const deltaY = touch.pageY - startY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            isHorizontalSwipe = true;
            e.preventDefault();
        }
        // e.preventDefault();
	}, false);


	surface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0];
        distX = touchobj.pageX - startX;
        distY = touchobj.pageY - startY;
        elapsedTime = new Date().getTime() - startTime;

        if (!isHorizontalSwipe) return;

        if (elapsedTime <= allowedTime){
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
                if ((distX > 0)) {
                    if (isEnabled) {
                        previousItem(currentItem - 1);
                    }
                } else {
                    if (isEnabled) {
                        nextItem(currentItem + 1);
                    }
                }
            }
        }
        // e.preventDefault();
	}, false);
}

var el = document.querySelector('.carousel');
swipedetect(el);
