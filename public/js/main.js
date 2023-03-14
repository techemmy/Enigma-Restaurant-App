document.querySelectorAll(".navbar .nav-link").forEach(navLink => {
    navLink.addEventListener("click", function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            const hash = this.hash;

            const section = document.querySelector(`${hash}`);
            section.scrollIntoView({behavior: "smooth"})
        }
    })
})