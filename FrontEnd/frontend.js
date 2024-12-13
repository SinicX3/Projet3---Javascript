const req_works = await fetch("http://localhost:5678/api/works/");
const travaux = await req_works.json();

    // Génération/ajout de la galerie
function GenGallery (target) {

    let gallery = document.querySelector(target);
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
        filterEvent[i].addEventListener("click", () => {
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
                else if (filterEvent[i].outerText === "Tous") (GenGallery(".gallery")) 
            }
        });
    }
}

    // Modifications d'index.html si l'utilisateur est connecté
function modif_page() {

    //Ajout du bloc noir avant le header
    let target = document.querySelector("header"); 
    const div = document.createElement("div");
    div.className = "bloc_edit"

    div.innerHTML = `<i class="fa-regular fa-pen-to-square";"></i> Mode édition`;
    target.style.padding = "100px";                                 // Ajustement du header
    target.insertAdjacentElement("beforebegin", div);

    //Ajout du bouton "Modifier"
    target = document.querySelector("#portfolio h2");
    const div2 = document.createElement("div");
    div2.className = "modif_btn";
    div2.id = "btn_modale";
    div2.innerHTML = `<i class="fa-regular fa-pen-to-square";"></i> modifier`;
    target.insertAdjacentElement("afterend", div2);

    //Remplacement de "login" par "logout"
    target = document.querySelectorAll('li')[2];
    target.innerText = "logout"
    target.addEventListener("click", () => {                        // Si on clique sur "logout", on supprime le token et on recharge la page
        window.localStorage.removeItem("token");                    
        window.location.href = "index.html";                        
    });                                                             
}

    // Génération de la galerie pour la modale
function GenGalleryModale(target) {

    const galerie_modale = document.createElement("div");
    galerie_modale.className = "galerie_modale";
    for (let i=0 ; i<travaux.length ; i++) {
        const n_work = document.createElement ("figure");

        const work_container = document.createElement ("div");
        const work_img = document.createElement ("img");
        work_img.src = travaux[i].imageUrl;        
        const corbeille = document.createElement ("div");
        corbeille.className = "corbeille";
        corbeille.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

        work_container.appendChild(work_img);
        work_container.appendChild(corbeille);
        n_work.appendChild(work_container);
        
        galerie_modale.appendChild(n_work);
    
        corbeille.addEventListener("click", () => {
             RemoveObj(travaux[i].id);
        });
    }
    
    target.appendChild(galerie_modale);
}

    // Suppression d'une image
async function RemoveObj(imageId) {

    const token = window.localStorage.getItem("token");

    const req = await fetch(`http://localhost:5678/api/works/${imageId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    });
    
    if (req.status === 204) {
        const target = document.querySelector(".contenu_modale");
        GenGalleryModale(target);
    }
}

    // Ajout de la modale
function AddModale() {

    // Création des éléments de la modale
    let target = document.getElementById("contact");
    const div = document.createElement("div");
    div.className = "modale";

    const innerDiv = document.createElement("div");
    innerDiv.className = "contenu_modale";

    const div_btn = document.createElement("div");
    const span = document.createElement("span");
    div_btn.className = "entete_1";
    span.className = "btn_fermer";
    span.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    div_btn.appendChild(span);
    const p = document.createElement("p");
    p.innerText = "Galerie photo";

    const bar = document.createElement("hr");
    const input = document.createElement("input");
    input.type = "submit";
    input.value = "Ajouter une photo";

    // Ajout des éléments à la modale
    innerDiv.appendChild(div_btn);
    innerDiv.appendChild(p);
    GenGalleryModale(innerDiv);             // Génération et ajout de la galerie
    innerDiv.appendChild(bar);
    innerDiv.appendChild(input);
    div.appendChild(innerDiv);

    target.insertAdjacentElement("afterend", div);
}

    // Construction de la div d'image pour la seconde modale
function DivImage() {
    const div = document.createElement("div");
    div.className = "ajout_img";

    const btn_ajoutImage = Object.assign(document.createElement("input"), {type: "submit", value: "+ Ajouter photo", name: "photo", id: "photo"});
    const img = Object.assign(document.createElement("span"), {innerHTML: `<i class="fa-regular fa-image"></i>`});
    const text = Object.assign(document.createElement("p"), {innerText: "jpg, png : 4mo max"});
    [img, btn_ajoutImage, text].forEach(e => div.appendChild(e));

    return div;
}

    // Deuxième modale (ajout photo)
function AddPhotoModale(){
    
    const target = document.querySelector(".contenu_modale");
    target.innerHTML="";

    const div_entete = document.createElement("div");
    div_entete.className = "entete_2";
    const span_btn = Object.assign(document.createElement("span"), {className: "btn_fermer", innerHTML: `<i class="fa-solid fa-xmark"></i>`});
    const fleche = Object.assign(document.createElement("span"), {className: "fleche", id: "btn_fleche", innerHTML: `<i class="fa-solid fa-arrow-left"></i>`});
    div_entete.appendChild(fleche);
    div_entete.appendChild(span_btn);

    target.appendChild(div_entete);

    const p = document.createElement("p");
    p.innerText = "Ajout photo";
    target.appendChild(p);
    
    const form = Object.assign(document.createElement("form"), {className: "modale2", action: "#", method: "post"});                    
    const input_f = DivImage();   
    const label_t = Object.assign(document.createElement("label"), {for: "Titre", innerText: "Titre"});         
    const input_t = Object.assign(document.createElement("input"), {type: "text", name: "titre", id: "titre"});
    const label_c = Object.assign(document.createElement("label"), {for: "category", innerText: "Catégorie"});   
    const input_c = Object.assign(document.createElement("input"), {type: "text", name: "category", id: "catégorie"});

    [input_f, label_t, input_t, label_c, input_c].forEach(e => form.appendChild(e));

    target.appendChild(form);

    const retour = document.querySelector(".fleche");
    retour.addEventListener("click", () => {
        const innerDiv = document.querySelector(".modale");
        innerDiv.remove();
        AddModale();
        Modale();
        const modale = document.querySelector(".modale");
        modale.style.display = "grid";
    });

    const bar = document.createElement("hr");
    const input = document.createElement("input");
    input.type = "submit";
    input.value = "Valider";
    target.appendChild(bar);
    target.appendChild(input);
}

    // Ouverture/fermeture de la modale
function Modale(){
    const ouvrir_modale = document.getElementById("btn_modale");
    const modale = document.querySelector(".modale");
    const fermer_modale = document.querySelector(".btn_fermer");
    const btn_ajout_photo = document.querySelector(".contenu_modale input");

    ouvrir_modale.addEventListener("click", () => {
        modale.style.display = "grid";
    });

    fermer_modale.addEventListener("click", () => {
        modale.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === modale) {
            modale.style.display = "none";
        }
    });

    btn_ajout_photo.addEventListener("click", () => {
        AddPhotoModale();
    });
} 






/////****  Lancement des fonctions  ****/////

// On regarde si l'utilisateur dispose d'un token. Si oui, on charge la page modifiée. Sinon, on charge la page standard.
let token = window.localStorage.getItem("token");

if (token != null) {
    modif_page();
    GenGallery(".gallery");
    AddModale();
    Modale();
}
else {
    GenGallery(".gallery");
    AddFilters(filters());
    FilterGallery();
};