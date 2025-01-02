////*** Récupération des travaux ***////
async function GetWorks () {

    const ReqWorks = await fetch("http://localhost:5678/api/works/");
    const Works = await ReqWorks.json();

    return Works ;

}



////*** Premiers éléments du DOM ***////

    // Ajout des filtres au DOM
function AddFilters (LFilters) {
    let Filters = document.querySelector("#portfolio h2");

    let UlFilter = document.createElement("div");
    UlFilter.className="ul_div";
    Filters.insertAdjacentElement("afterend", UlFilter);
    let Filter = document.querySelector(".ul_div");

    for (let i=0 ; i<LFilters.length ; i++) {
        let LiFilter = document.createElement("div");
        LiFilter.className="li_div";
        LiFilter.innerText = LFilters[i];
        Filter.appendChild(LiFilter);
    }
}

    // Tri des images selon le filtre
function FilterGallery () {
    let FilterEvent = document.querySelectorAll(".li_div");
    let Gallery = document.querySelector(".gallery");

    for (let i=0 ; i<FilterEvent.length ; i++) {
        FilterEvent[i].addEventListener("click", () => {
            Gallery.innerHTML = "";
            for (let j=0 ; j<Works.length ; j++) {
                if (FilterEvent[i].outerText === Works[j].category.name) {
                    const NewWork = document.createElement ("figure");
                    const WorkImg = document.createElement ("img");
                    WorkImg.src = Works[j].imageUrl;        
                    const WorkTitle = document.createElement ("figcaption");
                    WorkTitle.innerText = Works[j].title;
    
                    NewWork.appendChild(WorkImg);
                    NewWork.appendChild(WorkTitle);
    
                    Gallery.appendChild(NewWork)
                }
                else if (FilterEvent[i].outerText === "Tous") (GenGallery(".gallery")) 
            }
        });
    }
}
    
    // Génération de la liste des filtres
function Filters () {
    let LFilters = ["Tous"];

    for (let i=0 ; i<Works.length ; i++) {
        if (LFilters.includes (Works[i].category.name)) {
        }
        else {LFilters.push (Works[i].category.name)}
    }

    return LFilters;
}

    // Génération/ajout de la galerie
function GenGallery (target) {

    let Gallery = document.querySelector(target);
    Gallery.innerHTML = "";

    for (let i=0 ; i<Works.length ; i++) {
        const NewWork = document.createElement ("figure");
        const WorkImg = document.createElement ("img");
        WorkImg.src = Works[i].imageUrl;        
        const WorkTitle = document.createElement ("figcaption");
        WorkTitle.innerText = Works[i].title;

        NewWork.appendChild(WorkImg);
        NewWork.appendChild(WorkTitle);
        
        Gallery.appendChild(NewWork);
    }
    
}

    // Modifications d'index.html si l'utilisateur est connecté
function UptPage() {

    //Ajout du bloc noir avant le header
    let Target = document.querySelector("header"); 
    const Div = document.createElement("div");
    Div.className = "bloc_edit"

    Div.innerHTML = `<i class="fa-regular fa-pen-to-square";"></i> Mode édition`;
    Target.style.paddingTop = "100px";                                 // Le header descend de 100 px pour laisser de la place au bloc "Mode édition"
    Target.insertAdjacentElement("beforebegin", Div);

    //Ajout du bouton "Modifier"
    Target = document.querySelector("#portfolio h2");
    const Div2 = document.createElement("div");
    Div2.className = "modif_btn";
    Div2.id = "btn_modale";
    Div2.innerHTML = `<i class="fa-regular fa-pen-to-square";"></i> modifier`;
    Target.insertAdjacentElement("afterend", Div2);

    //Remplacement de "login" par "logout"
    Target = document.querySelectorAll('li')[2];
    Target.innerText = "logout"
    Target.addEventListener("click", () => {                        // Si on clique sur "logout", on supprime le token et on recharge la page
        window.localStorage.removeItem("token");                    
        window.location.href = "index.html";                        
    });                                                             
}



////*** Première modale ***////

    // Ajout de la première modale
async function AddModal() {

    // Création des éléments de la modale
    let Target = document.getElementById("contact");
    const Div = document.createElement("div");
    Div.className = "modal";

    const InnerDiv = document.createElement("div");
    InnerDiv.className = "contentModal";

    const DivBtn = Object.assign(document.createElement("div"), {className:"header1"});
    const Span = Object.assign(document.createElement("span"), {className:"btnClose", innerHTML:`<i class="fa-solid fa-xmark"></i>`});
    DivBtn.appendChild(Span);
    const P = Object.assign(document.createElement("p"), {innerText:"Galerie photo"});

    const Bar = document.createElement("hr");
    const Input = Object.assign(document.createElement("input"), {type:"submit", value:"Ajouter une photo"});

    // Ajout des éléments à la modale
    InnerDiv.appendChild(DivBtn);
    InnerDiv.appendChild(P);
    InnerDiv.appendChild(Bar);
    InnerDiv.appendChild(Input);
    Div.appendChild(InnerDiv);

    Target.insertAdjacentElement("afterend", Div);
    await GenGalleryModal();             // Génération et ajout de la galerie
    CloseModal();
}

    // Génération de la galerie pour la modale
async function GenGalleryModal() {

    let Works = await GetWorks();

    const GalleryModal = document.createElement("div");
    GalleryModal.className = "galleryModal";
    for (let i=0 ; i<Works.length ; i++) {
        const NewWork = document.createElement ("figure");
        const WorkImg = document.createElement ("img");
        WorkImg.src = Works[i].imageUrl;        
        const Bin = document.createElement ("div");
        Bin.className = "bin";
        Bin.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

        NewWork.appendChild(Bin);
        NewWork.appendChild(WorkImg);
        
        GalleryModal.appendChild(NewWork);
    
        Bin.addEventListener("click", async () => {
            await RemoveObj(Works[i].id);
            await GenGalleryModal();
        });
    }

    const Target = document.querySelector(".contentModal p");
    Target.insertAdjacentElement("afterend", GalleryModal);

}

    // Ouverture/fermeture de la modale
function Modal(){
    const OpenModal = document.getElementById("btn_modale");
    const Modal = document.querySelector(".modal");
    const CloseModal = document.querySelector(".btnClose");
    const BtnAddPhoto = document.querySelector(".contentModal input");

    OpenModal.addEventListener("click", () => {
        Modal.style.display = "grid";
    });

    CloseModal.addEventListener("click", () => {
        Modal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === Modal) {
            Modal.style.display = "none";
        }
    });

    BtnAddPhoto.addEventListener("click", () => {
        AddPhotoModal();
    });
} 
    
    // Suppression d'une image
async function RemoveObj(imageId) {

    const Token = window.localStorage.getItem("token");

    const Req = await fetch(`http://localhost:5678/api/works/${imageId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${Token}`,
            "Content-Type": "application/json"
        },
    });

    if (Req.status === 204) {
        const Target = document.querySelector(".galleryModal");
        Target.remove();                                     // On supprime le div de la galerie pour le re-générer
        Works = await GetWorks();                     
        GenGallery(".gallery");                              // MàJ des travaux, puis re-génération de la galerie
    }

}
    
    //Fermeture en cliquant sur la croix.
function CloseModal(){
    const CloseModal = document.querySelector(".btnClose");
    const Modal = document.querySelector(".modal");
    CloseModal.addEventListener("click", () => {
        Modal.style.display = "none";
    });
} 



////*** Seconde modale ***////

    // Ajout d'une flèche de retour en arrière sur la modale
function AddArrowReturn() {
    
    const Return = document.querySelector(".arrow");
    Return.addEventListener("click", async () => {
        const InnerDiv = document.querySelector(".modal");
        InnerDiv.remove();
        await AddModal();
        Modal();
        const SelectModal = document.querySelector(".modal");
        SelectModal.style.display = "grid";
    });

}

    // Deuxième modale (ajout photo)
function AddPhotoModal(){

    const Target = document.querySelector(".contentModal");
    Target.innerHTML="";

    const DivHeader = document.createElement("div");
    DivHeader.className = "header2";
    const SpanBtn = Object.assign(document.createElement("span"), {className: "btnClose", innerHTML: `<i class="fa-solid fa-xmark"></i>`});
    const Arrow = Object.assign(document.createElement("span"), {className: "arrow", id: "btn_fleche", innerHTML: `<i class="fa-solid fa-arrow-left"></i>`});

    DivHeader.appendChild(Arrow);
    DivHeader.appendChild(SpanBtn);
    Target.appendChild(DivHeader);

    const P = document.createElement("p");
    P.innerText = "Ajout photo";
    Target.appendChild(P);
    
    GenForm(Target);
    AddArrowReturn();
    CloseModal();

    const Bar = document.createElement("hr");
    const Input = Object.assign(document.createElement("input"), {type: "submit", value: "Valider", id:"btn_form_img"});
    Target.appendChild(Bar);
    Target.appendChild(Input);
}

    // Prévisualisation de l'image
function LoadImage(Img) {

    const Target = document.querySelector(".addImg");
    Target.innerHTML="";

    const DivWrapper = document.createElement("div"); // Cette div sert à recevoir la prévisualisation de l'image uploadée
    DivWrapper.id = "divWrapper";
    const PreviewImg = document.createElement("img");

    const Image = URL.createObjectURL(Img); // Génération du blob pour la prévisualisation
    PreviewImg.src = Image ;
    PreviewImg.id = "img_id";
    DivWrapper.appendChild(PreviewImg);
    Target.appendChild(DivWrapper);

    ValidForm(Img);
}

    // Construction de la div d'upload d'image pour la seconde modale
function DivImage() {

    const Div = document.createElement("div");
    Div.className = "addImg";

        // Construction du bouton d'upload
    const DivAddImage = Object.assign(document.createElement("div"));
    const BtnAddImage = Object.assign(document.createElement("input"), {type: "file", name: "photo", id: "photo"});
    const LabelBtnAddImage = Object.assign(document.createElement("button"), {type: "button", innerText: "+ Ajouter photo", id: "labelPhoto"});
    LabelBtnAddImage.appendChild(BtnAddImage);
    DivAddImage.appendChild(LabelBtnAddImage);

    BtnAddImage.addEventListener("change", (e) => {
        const Target = document.querySelector(".error");            // Si un message d'erreur est affiché, on le supprime
        if (Target) {Target.remove()};

        if (e.target.files[0].size > 4000000){
            if (Target) {Target.remove()};    
            MsgError("l'image est trop grande");
        }
        else {
            switch (e.target.files[0].type){
                case "image/jpeg":
                case "image/jpg":
                case "image/png":
                case "image/webp":
                    LoadImage(e.target.files[0]);
                break;
    
                default: 
                    MsgError("le format est incorrect");
            }
        }
    });

    LabelBtnAddImage.addEventListener("click", () => {BtnAddImage.click()}); // Quand on appuie sur le label, c'est l'input caché qui réagit.

    const img = Object.assign(document.createElement("span"), {innerHTML: `<i class="fa-regular fa-image"></i>`});
    const text = Object.assign(document.createElement("p"), {innerText: "jpg, png : 4mo max"});
    [img, DivAddImage, text].forEach(e => Div.appendChild(e));

    return Div;
}

    // Envoi de la requête à l'API
async function SendForm(usr_form) {

    const Token = window.localStorage.getItem("token");
    const Req = await fetch(`http://localhost:5678/api/works`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${Token}`,
            "Accept": "application/json"
        },
        body: usr_form
        
    });

    if (Req.status === 201) {
        const Target = document.querySelector(".contentModal");
        Target.innerHTML = "";
        AddPhotoModal();
        Works = await GetWorks();                     
        GenGallery(".gallery");                              // MàJ des travaux, puis re-génération de la galerie
    }
    else {
        MsgError("Une erreur est survenue");
    }
}

    // Construction du formulaire
function GenForm(Target) {

    const Form = Object.assign(document.createElement("form"), {className: "modal2"});                    
    const InputF = DivImage();   
    const LabelT = Object.assign(document.createElement("label"), {for: "titre", innerText: "Titre"});        
    const InputT = Object.assign(document.createElement("input"), {type: "text", name: "titre", id: "titre"});
    const LabelC = Object.assign(document.createElement("label"), {for: "catégorie", innerText: "Catégorie"});   

        // Choix possibles pour la liste des catégories
    const InputC = Object.assign(document.createElement("select"), {name: "category", id: "catégorie"});
    const LFilters = Filters();
    for (let i=0 ; i<LFilters.length; i++) {
        const Option = document.createElement("option");
        Option.innerHTML = LFilters[i];
        Option.value = LFilters[i];
        if (Option.value === "Tous"){
            Option.value = "";                                      // On retire le "Tous" parmi les choix
            Option.innerText = "";
        }                  
        InputC.appendChild(Option);
    }                                      

        // Ajout de la flèche sur la liste des catégories
    const DivInputC = document.createElement("div");
    DivInputC.className = "div_category";
    const ArrowCategory = Object.assign(document.createElement("span"), {id:"arrowCategory", innerHTML:`<i class="fa-solid fa-chevron-down"></i>`});

    DivInputC.appendChild(InputC);
    DivInputC.appendChild(ArrowCategory);

    [InputF, LabelT, InputT, LabelC, DivInputC].forEach(e => Form.appendChild(e));
    Target.appendChild(Form);

}

    // Affichage des messages d'erreur
function MsgError (Msg) {
    const Target = document.querySelector(".contentModal hr");
    const Error = Object.assign(document.createElement("div"), {innerText: `Erreur : ${Msg}`, className: "error"})
    Target.insertAdjacentElement("beforebegin", Error);
}

    // Récupération des données entrées par l'utilisateur pour l'ajout d'image
function ValidForm(Img) {
    
    const Form = document.querySelector(".modal2");
    const BtnForm = document.getElementById("btn_form_img");

    Form.addEventListener("change", () => {

        if (!Form[0].value || !Form[1].value) {
            BtnForm.style.backgroundColor = "#4d4d4d54";               // On vérifie que les champs sont tous remplis
        }

        if (Form[0].value && Form[1].value) {
            BtnForm.style.backgroundColor = "#1D6154";
        }

    });

    BtnForm.addEventListener("click", () => {
           
        const UsrForm = new FormData();
        UsrForm.append("title", Form[0].value);
        UsrForm.append("category", Form[1].selectedIndex);
        UsrForm.append("image", Img);
        
        if (Form[0].value && Form[1].value) {
            SendForm(UsrForm);
        }

    })

}





/////****  Lancement des fonctions  ****/////

let Works = await GetWorks();              // Première récupération des travaux
let Token = window.localStorage.getItem("token"); // On regarde si l'utilisateur dispose d'un token. 

if (Token != null) {                                // Si oui, on charge la page modifiée. 
    UptPage();
    GenGallery(".gallery");
    await AddModal();
    Modal();
}
else {                                              // Sinon, on charge la page standard.
    GenGallery(".gallery");
    AddFilters(Filters());
    FilterGallery();
};