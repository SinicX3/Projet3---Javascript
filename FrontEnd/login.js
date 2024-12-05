// On écoute le bouton "Se connecter"
const login_btn = document.querySelector("input[type='submit']");

// Y a-t-il un token d'authentification valide ?
async function auth_token() {
    const token = window.localStorage.getItem("token");
    const req = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczMzQzMjU1MSwiZXhwIjoxNzMzNTE4OTUxfQ.QxwWSe7uZCqNolIpPQo9QzWDQk99Ii-LOjHHV0zE9K4`,
        },
    });
    console.log(token);
    console.log(req);
}

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
        window.localStorage.setItem("token", reponse.token);
        console.log(reponse.token);
    } else {
        console.log ("Y a eu un problème !");
    }
}

auth_token();
auth_usr();