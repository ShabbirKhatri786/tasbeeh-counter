const firebaseConfig = {
    apiKey: "AIzaSyCBqOmCloTVn6gmCljLdLYLhKtp9lNNJEw",
    authDomain: "fire-base-sign-in-practice.firebaseapp.com",
    projectId: "fire-base-sign-in-practice",
    storageBucket: "fire-base-sign-in-practice.appspot.com",
    messagingSenderId: "999920116269",
    appId: "1:999920116269:web:529c51bb417eb9db744ea4",
    measurementId: "G-R94D42KP0Q",
};

var provider = new firebase.auth.GoogleAuthProvider();

firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var db = firebase.firestore();

var subhanallah = 0;
var alhamdulillah = 0;
var allahHooAkber = 0;
var kalmaShareef = 0;
var duroodEPak = 0;
var activeTasbeeh = "";

// Function to update dashboard counts
function updateDashboardCounts() {
    document.getElementById("subhanallahCount").innerText = subhanallah + " Times";
    document.getElementById("alhamdulillahCount").innerText = alhamdulillah + " Times";
    document.getElementById("allahHooAkberCount").innerText = allahHooAkber + " Times";
    document.getElementById("kalmaShareefCount").innerText = kalmaShareef + " Times";
    document.getElementById("duroodEPakCount").innerText = duroodEPak + " Times";
}


function dashboard() {
    var dashbaordSection = document.getElementById("dashboard_section");
    var tasbeehSection = document.getElementById("tasbeeh__section");
    dashbaordSection.classList.remove("d-none");
    tasbeehSection.classList.add("d-none");
    updateDashboardCounts();
    console.log("Daboard");
  }

// Function to show tasbeeh count
function showTasbeeh(tasbeeh) {
    var allTasbeeh = {
        subhanallah,
        alhamdulillah,
        allahHooAkber,
        kalmaShareef,
        duroodEPak,
    };
    var dashboardSection = document.getElementById("dashboard_section");
    var tasbeehSection = document.getElementById("tasbeeh__section");
    var heading = document.getElementById("tasbeehHeading");
    var count = document.getElementById("tasbeehCount");

    dashboardSection.classList.add("d-none");
    tasbeehSection.classList.remove("d-none");

    activeTasbeeh = tasbeeh;
    count.innerHTML = allTasbeeh[tasbeeh] || 0; // Set the current tasbeeh count
    heading.innerHTML = tasbeeh; // Set the current tasbeeh heading
    console.log("tasbeeh")
}


// Function to increment or decrement tasbeeh count
function changeCounter(type) {
    var count = document.getElementById("tasbeehCount");
    if (type === "plus") {
        if (activeTasbeeh === "subhanallah") subhanallah++;
        else if (activeTasbeeh === "alhamdulillah") alhamdulillah++;
        else if (activeTasbeeh === "allahHooAkber") allahHooAkber++;
        else if (activeTasbeeh === "kalmaShareef") kalmaShareef++;
        else if (activeTasbeeh === "duroodEPak") duroodEPak++;
    } else if (type === "minus" && Number(count.innerHTML) > 0) {
        if (activeTasbeeh === "subhanallah") subhanallah--;
        else if (activeTasbeeh === "alhamdulillah") alhamdulillah--;
        else if (activeTasbeeh === "allahHooAkber") allahHooAkber--;
        else if (activeTasbeeh === "kalmaShareef") kalmaShareef--;
        else if (activeTasbeeh === "duroodEPak") duroodEPak--;
    }
    count.innerHTML = window[activeTasbeeh];
}

// Save tasbeeh count to Firestore and local storage
function handleSave() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please login first.');
        return;
    }

    // Update Firestore and local storage
    db.collection("tasbeeh").doc(user.uid).set({
        subhanallah,
        alhamdulillah,
        allahHooAkber,
        kalmaShareef,
        duroodEPak,
    }, { merge: true })
        .then(() => {
            console.log("Tasbeeh data saved to Firestore");

            // Save tasbeeh count in local storage
            localStorage.setItem('tasbeehCounts', JSON.stringify({ subhanallah, alhamdulillah, allahHooAkber, kalmaShareef, duroodEPak }));
            alert("Tasbeeh count saved successfully!");
        })
        .catch((error) => {
            console.error("Error saving tasbeeh data:", error);
        });
}


function authAction() {
    let activeTab = document.querySelector('.nav-link.active').id;
    if (activeTab === 'login-tab') {
        login();
    } else if (activeTab === 'signup-tab') {
        signup();
    }
}



// Signup function
function signup() {
    var name = document.getElementById("signup-name").value;
    var email = document.getElementById("signup-email").value;
    var password = document.getElementById("signup-password").value;
    var confirmPassword = document.getElementById("signup-confirm-password").value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;

            // Save user data to Firestore
            db.collection("tasbeeh").doc(user.uid).set({
                name: name,
                email: email,
                uid: user.uid,
            }).then(() => {
                console.log("User data saved to Firestore");

                // Save user data in local storage
                localStorage.setItem('user', JSON.stringify(user));
                alert("Signup successful!");
            }).catch((error) => {
                console.error("Error saving user data:", error);
            });
        })
        .catch((error) => {
            console.error("Error signing up:", error);
        });
}

// Login function
function login() {
    var email = document.getElementById("login-email").value;
    var password = document.getElementById("login-password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;

            // Save user data in local storage
            localStorage.setItem('user', JSON.stringify(user));
            alert("Login successful!");

            // Load tasbeeh counts from Firestore
            db.collection("tasbeeh").doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    let data = doc.data();
                    subhanallah = data.subhanallah || 0;
                    alhamdulillah = data.alhamdulillah || 0;
                    kalmaShareef = data.kalmaShareef || 0;
                    duroodEPak = data.duroodEPak || 0;

                       // Update dashboard counts
                       updateDashboardCounts();

                    // Save tasbeeh counts in local storage
                    localStorage.setItem('tasbeehCounts', JSON.stringify({ subhanallah, alhamdulillah, kalmaShareef, duroodEPak }));
                }
            }).catch((error) => {
                console.error("Error getting tasbeeh data:", error);
            });
        })
        .catch((error) => {
            console.error("Error logging in:", error);
        });
}



// Load counts when page loads
window.onload = function() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        let counts = JSON.parse(localStorage.getItem('tasbeehCounts'));
        if (counts) {
            subhanallah = counts.subhanallah || 0;
            alhamdulillah = counts.alhamdulillah || 0;
            allahHooAkber = counts.allahHooAkber || 0;
            kalmaShareef = counts.kalmaShareef || 0;
            duroodEPak = counts.duroodEPak || 0;

            updateDashboardCounts();
        }
    }
}