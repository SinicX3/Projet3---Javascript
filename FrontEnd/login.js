// On écoute le bouton "Se connecter"
const login_btn = document.querySelector("input[type='submit']");

// Sinon, au clic, récupération des identifiants entrés par l'utilisateur
function auth_usr() {
    login_btn.addEventListener("click", (event) =>{
        event.preventDefault();

        const user_form = document.querySelector("form");
        const body_usr = {
            "email" : user_form.email.value,
            "password" : user_form.pw.value
        };

        auth_server (body_usr);
    })
}

// Authentification auprès du serveur
async function auth_server (body_usr) {
    const req = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify (body_usr)
    });
    const reponse = await req.json();

    if (req.ok) {
        window.localStorage.removeItem("token");
        window.localStorage.setItem("token", reponse.token);       // Stockage du token, puis redirection vers index.html
        window.location.href = "index.html";

    } else {
        Error_Message (req.status);
    }
}

// Ajout du message d'erreur en cas de problème
function Error_Message (reponse) {
    const target = document.querySelector("#login h2");
    let div_message = document.createElement ("div");
    let message = "";

    switch (reponse) {
        case 400:
            message = "Votre upload ne respecte pas le format demandé"
            break;
        case 401:
            message = "Vos identifiants sont incorrects"
            break;
        case 500:
            message = "La base de données a rencontré un problème"
            break;
        default:
            message = "Une erreur inconnue est survenue"
    }

    div_message.innerText = message;
    target.insertAdjacentElement("afterend", div_message);
}

// Ajout d'une nouvelle référence
async function AddObj() {
    const token = window.localStorage.getItem("token");
    console.log(token);
    const body = {
        "image": "imageURL",
        "title": "string",
        "category": 1,
   }

    const req = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        // La nouvelle image à ajouter
         body: JSON.stringify(body)
    });

    if (!req.ok) {Error_Message (req.status);}
    console.log("Bonjour");
}

auth_usr();
//AddObj();