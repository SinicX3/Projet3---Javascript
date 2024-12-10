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
        window.localStorage.removeItem("token");                    //
        window.location.href = "index.html";                        //
    });                                                             //
}

    //Génération de la galerie pour la modale
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
    }
    
    target.appendChild(galerie_modale);
}

    //Ajout de la modale
function AddModale(){

    // Création des éléments de la modale
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

    const bar = document.createElement("hr");
    const input = document.createElement("input");
    input.type = "submit";
    input.value = "Ajouter une photo";

    // Ajout des éléments à la modale
    innerDiv.appendChild(span);
    innerDiv.appendChild(p);
    GenGalleryModale(innerDiv);             // Génération et ajout de la galerie
    innerDiv.appendChild(bar);
    innerDiv.appendChild(input);
    div.appendChild(innerDiv);

    target.insertAdjacentElement("afterend", div);
}

    // Ouverture/fermeture de la modale
function Modale(){
    const ouvrir_modale = document.getElementById("btn_modale");
    const modale = document.querySelector(".modale");
    const fermer_modale = document.getElementById("btn_fermer_modale");
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

        // Deuxième modale (ajout photo)
        const target = document.querySelector(".contenu_modale");
        target.innerHTML="";

        const p = document.createElement("p");
        p.innerText = "Ajout photo";
        target.appendChild(p);

        const form = document.createElement("form");                                                // Liste trop longue, à remplacer par un object.assign
        form.action = "#";
        form.method = "post";
        const label_f = document.createElement("label");
        label_f.for = "file"
        label_f.innerText = "Fichier";
        const input_f = document.createElement("input");
        input_f.type = "file";
        input_f.name = "photo";
        input_f.id = "photo";
        const label_t = document.createElement("label");
        label_f.for = "Titre"
        label_f.innerText = "Titre";
        const input_t = document.createElement("input");
        input_t.type = "text";
        input_t.name = "titre";
        input_t.id = "titre";

        form.appendChild(label_f);                                                                  // Idem, itérer avec un ForEach
        form.appendChild(input_f);
        form.appendChild(label_t);
        form.appendChild(input_t);
        target.appendChild(form);

        const bar = document.createElement("hr");
        const input = document.createElement("input");
        input.type = "submit";
        input.value = "Ajouter une photo";
        target.appendChild(bar);
        target.appendChild(input);
    });
} 





/////****  Lancement des fonctions ****/////

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