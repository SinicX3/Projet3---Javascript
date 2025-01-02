// On écoute le bouton "Se connecter"
const LoginBtn = document.querySelector("input[type='submit']");

// Sinon, au clic, récupération des identifiants entrés par l'utilisateur
function AuthUsr() {
    LoginBtn.addEventListener("click", (event) =>{
        event.preventDefault();

        const UsrForm = document.querySelector("form");
        const BodyUsr = {
            "email" : UsrForm.email.value,
            "password" : UsrForm.pw.value
        };

        AuthSrv(BodyUsr);
    })
}

// Authentification auprès du serveur
async function AuthSrv (BodyUsr) {
    const Req = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify (BodyUsr)
    });
    const SrvAnswer = await Req.json();

    if (Req.ok) {
        window.localStorage.removeItem("token");
        window.localStorage.setItem("token", SrvAnswer.token);       // Stockage du token, puis redirection vers index.html
        window.location.href = "index.html";
        window.localStorage.setItem("userId", SrvAnswer.userId);
    } else {
        ErrorMessage (Req.status);
    }
}

// Ajout du message d'erreur en cas de problème
function ErrorMessage (response) {
    const Target = document.querySelector("#login h2");
    const Check = document.querySelector("#login div");

    if (Check !== null) {
        Check.remove();
    }

    let DivMsg = document.createElement ("div");
    let Msg = "";

    switch (response) {
        case 400:
            Msg = "Votre upload ne respecte pas le format demandé"
            break;
        case 401:
            Msg = "Vos identifiants sont incorrects"
            break;
        case 500:
            Msg = "La base de données a rencontré un problème"
            break;
        default:
            Msg = "Une erreur inconnue est survenue"
    }

    DivMsg.innerText = Msg;
    Target.insertAdjacentElement("afterend", DivMsg);
}

AuthUsr();
