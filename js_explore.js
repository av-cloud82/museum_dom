const container = document.querySelector(".explore-container .image-block");
document.querySelector(".ba-slider").addEventListener("input", function(e){
    container.style.setProperty("--position", `${e.target.value}%`)
})