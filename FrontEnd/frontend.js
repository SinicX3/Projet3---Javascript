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
        const work_img = document.createElement ("img");
        work_img.src = travaux[i].imageUrl;        
        const corbeille = document.createElement ("div");
        corbeille.className = "corbeille";
        corbeille.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

        n_work.appendChild(corbeille);
        n_work.appendChild(work_img);
        
        galerie_modale.appendChild(n_work);
    
        corbeille.addEventListener("click", () => {
            //RemoveObj(travaux[i].id);
            console.log(travaux[i].id);
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

    // Ajout de la première modale
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

        // Construction du bouton d'upload
    const div_ajoutImage = Object.assign(document.createElement("div"));
    const btn_ajoutImage = Object.assign(document.createElement("input"), {type: "file", name: "photo", id: "photo"});
    const label_btn_ajoutImage = Object.assign(document.createElement("button"), {type: "button", innerText: "+ Ajouter photo", id: "label_photo"});
    label_btn_ajoutImage.appendChild(btn_ajoutImage);
    div_ajoutImage.appendChild(label_btn_ajoutImage);

        // Quand on appuie sur le label, c'est le bouton caché qui réagit.
    label_btn_ajoutImage.addEventListener("click", () => {btn_ajoutImage.click()}); 

    const img = Object.assign(document.createElement("span"), {innerHTML: `<i class="fa-regular fa-image"></i>`});
    const text = Object.assign(document.createElement("p"), {innerText: "jpg, png : 4mo max"});
    [img, div_ajoutImage, text].forEach(e => div.appendChild(e));

    return div;
}

    // Récupération des données entrées par l'utilisateur pour l'ajout d'image
function ValidationForm() {
    const form = document.querySelector(".modale2");
    const btn_form = document.getElementById("btn_form_img");
    form.addEventListener("input", () => {
        btn_form.style.backgroundColor = "#1D6154";
    });
    btn_form.addEventListener("click", () => {
        const usr_form = new FormData();
        usr_form.append("title", form[1].value);
        usr_form.append("category", form[2].value);
    })

        // Upload de l'image et préchargement dans le formulaire
    const img_form = document.getElementById("label_photo");
    img_form.addEventListener("click", () => {
        
    });
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
    
    // Construction du formulaire
    const form = Object.assign(document.createElement("form"), {className: "modale2"});                    
    const input_f = DivImage();   
    const label_t = Object.assign(document.createElement("label"), {for: "Titre", innerText: "Titre"});         
    const input_t = Object.assign(document.createElement("input"), {type: "text", name: "titre", id: "titre"});
    const label_c = Object.assign(document.createElement("label"), {for: "category", innerText: "Catégorie"});   

        // Choix possibles pour la liste des catégories
    const input_c = Object.assign(document.createElement("select"), {name: "category", id: "catégorie"});
    const l_filters = filters();
    for (let i=0 ; i<l_filters.length; i++) {
        const option = document.createElement("option");
        option.innerHTML = l_filters[i];
        option.value = l_filters[i];
        if (option.value=== "Tous") {option.innerText = ""};
        input_c.appendChild(option);
    }
        // Ajout de la flèche sur la liste des catégories
    const div_input_c = document.createElement("div");
    div_input_c.className = "div_category";
    const fleche_cat = document.createElement("span");
    fleche_cat.id = "cat_fleche";
    fleche_cat.innerHTML = `<i class="fa-solid fa-chevron-down"></i>`;
    div_input_c.appendChild(input_c);
    div_input_c.appendChild(fleche_cat);

    [input_f, label_t, input_t, label_c, div_input_c].forEach(e => form.appendChild(e));
    target.appendChild(form);

    // Retour à la page précédente quand on clique sur la flèche
    const retour = document.querySelector(".fleche");
    retour.addEventListener("click", () => {
        const innerDiv = document.querySelector(".modale");
        innerDiv.remove();
        AddModale();
        Modale();
        const modale = document.querySelector(".modale");
        modale.style.display = "grid";
    });

    //Fermeture en cliquant sur la croix. A factoriser avec les instructions identiques dans la fonction Modale()
    const fermer_modale = document.querySelector(".btn_fermer");
    const modale = document.querySelector(".modale");
    fermer_modale.addEventListener("click", () => {
        modale.style.display = "none";
    });

    const bar = document.createElement("hr");
    const input = document.createElement("input");
    input.type = "submit";
    input.value = "Valider";
    input.id = "btn_form_img";
    target.appendChild(bar);
    target.appendChild(input);

    ValidationForm();
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