const div = document.querySelector("div");

function hello(event) {
    const curScrollY = window.scrollY + window.innerHeight;
    if (curScrollY >= div.offsetTop && !div.classList.contains("active")) {
        div.classList.add("active");
    }
}

window.addEventListener("scroll", hello);
