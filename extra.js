const words = ["place", "destination", "hang out", "favorite"]
let letters = []
function onLoad() {
    //Get header
    let header = document.getElementById("header")
    //Get header text
    let text = header.textContent;
    header.textContent = "";
    //Replace with span for each
    for (let i = 0; i < text.length; i++) {
        const letter = text[i];
        let span = document.createElement("span")
        span.textContent = letter
        letters.push(span)
        header.append(span)
    }
    header.addEventListener("click", function () {
        for (let i = 0; i < letters.length; i++) {
            const letter = letters[i];
            setTimeout(function () {
                letter.classList.remove("rainbow");
            }, (50 * i) - 50);
            setTimeout(function () {
                letter.classList.add("rainbow");
            }, 50 * i);
            
        }
    })

}
onLoad()