let mode = "online";

// ---------------- REGISTER ----------------
async function register() {
    let res = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    });

    msg.innerText = (await res.json()).msg;
}

// ---------------- LOGIN ----------------
async function login() {
    let res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    });

    let data = await res.json();

    msg.innerText = data.msg;

    if (data.msg === "Login success") {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("modePage").style.display = "block";
    }
}

// ---------------- MODE ----------------
function setMode(m) {
    mode = m;

    document.getElementById("modePage").style.display = "none";
    document.getElementById("mainPage").style.display = "block";
}

// ---------------- BACK ----------------
function back() {
    document.getElementById("mainPage").style.display = "none";
    document.getElementById("modePage").style.display = "block";
}

// ---------------- LOAD VIDEO ----------------
async function loadVideo() {

    let subject = document.getElementById("subject").value;
    let chapter = document.getElementById("chapter").value;
    let concept = document.getElementById("concept").value;

    let res = await fetch(
        `http://127.0.0.1:8000/video?concept=${concept}&subject=${subject}&chapter=${chapter}`
    );

    let data = await res.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    document.getElementById("video").innerHTML = `
        <h3>${data.title}</h3>
        <iframe width="500" height="300" src="${data.video_url}" allowfullscreen></iframe>
    `;

    loadAnalysis(concept);
}

// ---------------- ANALYSIS ----------------
async function loadAnalysis(concept) {

    let res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({concept})
    });

    let data = await res.json();

    document.getElementById("summary").innerHTML =
        "<h3>Explanation</h3><p>" + data.summary + "</p>";

    let quiz = "<h3>Quiz</h3>";

    data.questions.forEach((q, i) => {
        quiz += `
            <p>${q}</p>
            <input id="a${i}">
            <button onclick="check(${i})">Check</button>
            <p id="r${i}"></p>
        `;
    });

    document.getElementById("quiz").innerHTML = quiz;
}

// ---------------- EVALUATION ----------------
async function check(i) {

    let ans = document.getElementById("a" + i).value;

    let res = await fetch("http://127.0.0.1:8000/evaluate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({answer: ans})
    });

    let data = await res.json();

    document.getElementById("r" + i).innerText =
        data.result + " → " + data.explanation;
}