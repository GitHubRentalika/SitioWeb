/* SELECTORS */
const slides = document.getElementsByClassName("carrousel-item")
let slidePosition = 0
const totalSlides = slides.length
const colorThief = new ColorThief()

/* EVENT LISTENERS */
document.getElementById("carrousel-btn-prev").addEventListener("click", function() {
    moveSlide("previous")
})
document.getElementById("carrousel-btn-next").addEventListener("click", function() {
    moveSlide("next")
})

/* FUNCTIONS */
function hideAllSlides() {
    for(const slide of slides) {
        slide.classList.remove("carrousel-item-visible")
    }
}

function showCurrentSlide() {
    slides[slidePosition].classList.add("carrousel-item-visible")
}

function moveToPreviousPosition() {
    if(slidePosition > 0) {
        slidePosition--
    } else {
        slidePosition = totalSlides - 1
    }
}

function moveToNextPosition() {
    if(slidePosition < totalSlides - 1) {
        slidePosition++
    } else {
        slidePosition = 0
    }
}

function moveSlide(direction) {
    hideAllSlides()

    if(direction === "previous") {
        moveToPreviousPosition()
    } else if(direction === "next") {
        moveToNextPosition()
    }

    showCurrentSlide()
    getDominantColor()
}

function changeBGColor(color) {
    //document.cflip.style.background =  `linear-gradient(to bottom right, rgb(15, 15, 15) 50%, rgb(${color[0]}, ${color[1]}, ${color[2]}))`
}

function getDominantColor() {
    const img = document.querySelector('.carrousel-item-visible .carrousel-item-img')

    // Make sure image is finished loading
    if (img.complete) {
        changeBGColor(colorThief.getColor(img))
    } else {
        img.addEventListener('load', function() {
            changeBGColor(colorThief.getColor(img))
        });
    }
}