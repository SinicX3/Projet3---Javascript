const req_works = await fetch("http://localhost:5678/api/works/");
const travaux = await req_works.json();

// Génération/ajout de la galerie
function GenGallery () {

    let gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    for (let i=0 ; i<travaux.length ; i++) {
        const n_work = document.createElement ("figure");
        const work_img = document.createElement ("img");
        work_img.src = travaux[i].imageUrl;        
        const work_title = document.createElement ("figcaption");
        work_title.innerText = travaux[i].title;

        n_work.appendChild(work_img);
        n_work.appendChild(work_title);
        
        gallery.appendChild(n_work);
    }
}

// Génération de la liste des filtres
function filters () {
    let l_filters = ["Tous"];

    for (let i=0 ; i<travaux.length ; i++) {
        if (l_filters.includes (travaux[i].category.name)) {
        }
        else {l_filters.push (travaux[i].category.name)}
    }

    return l_filters;
}

// Ajout des filtres au DOM
function AddFilters (l_filters) {
    let filters = document.querySelector("#portfolio h2");

    let ul_filter = document.createElement("div");
    ul_filter.className="ul_div";
    filters.insertAdjacentElement("afterend", ul_filter);
    let filter = document.querySelector(".ul_div");

    for (let i=0 ; i<l_filters.length ; i++) {
        let li_filter = document.createElement("div");
        li_filter.className="li_div";
        li_filter.innerText = l_filters[i];
        filter.appendChild(li_filter);
    }
}

// Tri des images selon le filtre
function FilterGallery () {
    let filterEvent = document.querySelectorAll(".li_div");
    let gallery = document.querySelector(".gallery");

    for (let i=0 ; i<filterEvent.length ; i++) {
        filterEvent[i].addEventListener("click", event => {
            gallery.innerHTML = "";
            for (let j=0 ; j<travaux.length ; j++) {
                if (filterEvent[i].outerText === travaux[j].category.name) {
                    const n_work = document.createElement ("figure");
                    const work_img = document.createElement ("img");
                    work_img.src = travaux[j].imageUrl;        
                    const work_title = document.createElement ("figcaption");
                    work_title.innerText = travaux[j].title;
    
                    n_work.appendChild(work_img);
                    n_work.appendChild(work_title);
    
                    gallery.appendChild(n_work)
                }
                else if (filterEvent[i].outerText === "Tous") (GenGallery()) 
            }
        });
    }
}

//Modifications d'index.html si l'utilisateur est connecté
function modif_page() {

    //Ajout du bloc noir avant le header
    let target = document.querySelector("header"); 
    const div = document.createElement("div");
    div.className = "bloc_edit"

    div.innerHTML = `<i class="fa-regular fa-pen-to-square";"></i> Mode édition`;
    target.style.padding = "100px";             // Ajustement du header
    target.insertAdjacentElement("beforebegin", div);

    //Remplacement de "login" par "logout"
    target = document.querySelectorAll('li')[2];
    target.innerText = "logout"

    //Ajout du bouton "Modifier"
    target = document.querySelector("#portfolio h2");
    const div2 = document.createElement("div");
    div2.className = "modif_btn";
    div2.id = "btn_modale";
    div2.innerHTML = `<i class="fa-regular fa-pen-to-square";"></i> modifier`;
    target.insertAdjacentElement("afterend", div2);
}

    //Ajout de la modale
function AddModale(){

    let target = document.getElementById("contact");
    const div = document.createElement("div");
    div.className = "modale";

    const innerDiv = document.createElement("div");
    innerDiv.className = "contenu_modale";

    const span = document.createElement("span");
    span.className = "close-btn";
    span.id = "btn_fermer_modale";
    span.innerText = "X";
    const p = document.createElement("p");
    p.innerText = "Galerie photo";

//        gallery_modale = GenModaleGallery (); // Génération de la gallerie pour la modale

    innerDiv.appendChild(span);
    innerDiv.appendChild(p);
    div.appendChild(innerDiv);
    target.insertAdjacentElement("afterend", div);
}

    //Ouverture/fermeture de la modale
function Modale(){
    const ouvrir_modale = document.getElementById("btn_modale");
    const modale = document.querySelector(".modale");
    const fermer_modale = document.getElementById("btn_fermer_modale");

    ouvrir_modale.addEventListener("click", function() {
    modale.style.display = "flex";
    });

    fermer_modale.addEventListener("click", function() {
    modale.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === modale) {
            modale.style.display = "none";
        }
    })
} 





/////****  Lancement des fonctions ****/////

// On regarde si l'utilisateur dispose d'un token. Si oui, on charge la page modifiée. Sinon, on charge la page standard.
// window.localStorage.removeItem("token");
let token = window.localStorage.getItem("token");

if (token != null) {
    modif_page();
    GenGallery();
    AddModale();
    Modale();
}
else {
    GenGallery();
    AddFilters(filters());
    FilterGallery();
};