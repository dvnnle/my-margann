let currentSlide = 1;

// Slide wechseln
function nextSlide() {
    const oldSlide = document.getElementById("slide" + currentSlide);
    oldSlide.classList.remove("active");

    if (currentSlide === 6) stopFireworks();
    if (currentSlide === 7) document.getElementById("typewriter").innerHTML = "";

    currentSlide++;
    const slide = document.getElementById("slide" + currentSlide);
    if(slide) {
        slide.classList.add("active");

        if(currentSlide === 6) startFireworks();
        if(currentSlide === 7) startCinematic();
    }
}

//////////////////////////////
// Slide 6 Feuerwerk
//////////////////////////////
let fireworksInterval;

function startFireworks() {
    const container = document.querySelector("#slide6 .fireworks");
    container.innerHTML = "";
    const colors = ["#ff4d4d","#ffb84d","#ffff4d","#4dff88","#4dd2ff","#b84dff"];

    function createExplosion() {
        const numParticles = 30 + Math.floor(Math.random() * 20);
        const centerX = Math.random() * container.clientWidth;
        const centerY = Math.random() * container.clientHeight * 0.5;

        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement("span");
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = centerX + "px";
            particle.style.top = centerY + "px";
            particle.style.opacity = 1;

            const size = 8 + Math.random() * 6;
            particle.style.width = size + "px";
            particle.style.height = size + "px";

            container.appendChild(particle);

            const angle = Math.random() * 2 * Math.PI;
            const distance = 50 + Math.random() * 300;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            setTimeout(() => {
                particle.style.transition = "transform 1s ease-out, opacity 1s ease-out";
                particle.style.transform = `translate(${x}px, ${y}px)`;
                particle.style.opacity = 0;
            }, 10);

            setTimeout(() => particle.remove(), 1200);
        }
    }

    createExplosion();
    fireworksInterval = setInterval(() => {
        createExplosion();
        createExplosion();
        createExplosion();
    }, 800);
}

function stopFireworks() {
    clearInterval(fireworksInterval);
}

//////////////////////////////
// Slide 7 Cinematic
//////////////////////////////
function startCinematic() {
    const slide7 = document.getElementById("slide7");
    slide7.classList.add("active");
    startStars();
    playFullTypewriterSequence(typewriterSequence);
}

function startStars() {
    const canvas = document.getElementById("stars");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";

        stars.forEach(star => {
            star.y += star.speed;
            if (star.y > canvas.height) star.y = 0;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

//////////////////////////////
// Typewriter Sequenz Slide 7
//////////////////////////////
const typewriterSequence = [
    ["alrightyyy","","this is serious business now.","","LISTEN."],
    ["a very special day is coming up","for a very special lady (GUESS WHO IT IS 👀)","","so i just wanted to take this opportunity to say..."],
    ["meeting you was probably one of the most random and unexpected things that happened last year, but also one of the best.","","now here we are, and i am so thankful for every moment we get to spend together, though from afar."],
    ["i wish i could give you the whole world and more, since you deserve nothing less.","but for now, i hope this tiinnyyy surprise can still show you how much you mean to me."],
    ["sooo this is the moment where i want to ask you something very important (drumroll please🥁)"],
    ["will you be my valentine?"]
];

function typeTextBlock(lines, charSpeed = 80, linePause = 600, callback) {
    const element = document.getElementById("typewriter");
    element.innerHTML = "";
    let lineIndex = 0;
    let charIndex = 0;

    function typeLine() {
        if (lineIndex < lines.length) {
            if (charIndex < lines[lineIndex].length) {
                element.innerHTML += lines[lineIndex].charAt(charIndex);
                charIndex++;
                setTimeout(typeLine, charSpeed);
            } else {
                element.innerHTML += "<br>";
                lineIndex++;
                charIndex = 0;
                setTimeout(typeLine, linePause);
            }
        } else if (callback) {
            setTimeout(callback, 500);
        }
    }

    typeLine();
}

function deleteTypewriterBlock(callback) {
    const element = document.getElementById("typewriter");
    element.classList.add("fade-out");

    element.addEventListener("transitionend", function handler() {
        element.classList.remove("fade-out");
        element.innerHTML = "";
        element.removeEventListener("transitionend", handler);
        if (callback) callback();
    });
}

function playFullTypewriterSequence(sequence, index = 0) {
    if (index >= sequence.length) {
        showValentineContainer(); // letzte Nachricht bleibt stehen, Buttons erscheinen
        return;
    }

    typeTextBlock(sequence[index], 80, 600, () => {
        // Nur löschen, wenn es **nicht** die letzte Nachricht ist
        if (index < sequence.length - 1) {
            deleteTypewriterBlock(() => playFullTypewriterSequence(sequence, index + 1));
        } else {
            showValentineContainer();
        }
    });
}

function showValentineContainer() {
    const element = document.getElementById("typewriter");
    element.innerHTML = "will you be my valentine?<br>";

    const buttonContainer = document.createElement("div");
    buttonContainer.style.marginTop = "30px";

    const yesBtn = document.createElement("button");
    yesBtn.innerText = "YES";
    yesBtn.classList.add("yes-btn");
    yesBtn.onclick = () => {
        buttonContainer.remove(); // Buttons weg
        startYesSequence();
    };

    const noBtn = document.createElement("button");
    noBtn.innerText = "NO";
    noBtn.classList.add("no-btn");

    // Roter Knopf rennt weg
    noBtn.addEventListener("mousemove", () => {
        const x = Math.random() * 200 - 100;
        const y = Math.random() * 100 - 50;
        noBtn.style.transform = `translate(${x}px, ${y}px)`;
    });

    buttonContainer.appendChild(yesBtn);
    buttonContainer.appendChild(noBtn);
    element.appendChild(buttonContainer);
}

// Funktion für Typewriter Effekt
function typeWriterText(element, text, speed = 80, callback) {
    let i = 0;
    element.innerHTML = "";
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if(callback) {
            setTimeout(callback, 800); // kurze Pause bevor nächste Nachricht
        }
    }
    type();
}

// Sequenz nach YES Klick
function startYesSequence() {
    const element = document.getElementById("typewriter");
    const messages = [
        "🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯OH MA GAAAAAAD YOU SAID YESSS🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯",
        "to many more valentines with you <3",
        "mahal na mahal kita, margann"
    ];

    function nextMessage(index = 0) {
        if (index >= messages.length) return;

        typeWriterText(element, messages[index], 80, () => {
            if(index < messages.length - 1) {
                // Fade out für die ersten zwei Nachrichten
                element.classList.add("fade-out");
                element.addEventListener("transitionend", function handler() {
                    element.classList.remove("fade-out");
                    element.removeEventListener("transitionend", handler);
                    nextMessage(index + 1);
                });
            }
            // Letzte Nachricht bleibt dauerhaft stehen
        });
    }

    nextMessage();
}

