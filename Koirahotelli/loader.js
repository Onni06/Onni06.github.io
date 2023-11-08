window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");
    
    loader.classList.add("loader-hidden");
    
    loader.addEventListener("transitionend", () => {
        while (loader.hasChildNodes()) {
            loader.removeChild(loader.firstChild);
          }
    })
    
    })