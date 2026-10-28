const PHONE_NUMBER = "523312883070";

// --- 1. LÓGICA DEL ENVIADOR DE WHATSAPP ---
function enviarWhatsApp() {
    const servicio = document.getElementById("servicioSelect").value;
    const metros = document.getElementById("metros").value;
    const comentarios = document.getElementById("comentarios").value;

    if (!servicio) {
        alert("Por favor selecciona un tipo de servicio.");
        return;
    }

    let mensaje = "*¡Hola G&B Cyclone Maestros!*\n\n";
    mensaje += "Me interesa cotizar el siguiente servicio:\n";
    mensaje += `-> *Servicio:* ${servicio}\n`;

    if (metros) {
        mensaje += `-> *Metros aprox:* ${metros} m\n`;
    }

    if (comentarios.trim() !== "") {
        mensaje += `-> *Detalles / Notas:* ${comentarios.trim()}\n`;
    }

    mensaje += "\nQuedo a la espera de su presupuesto. ¡Muchas gracias!";

    const whatsappURL = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    
    window.location.href = whatsappURL;
}

// --- 2. SELECCIÓN RÁPIDA DE SERVICIO DESDE LAS TARJETAS ---
function selectService(serviceName) {
    const selectElement = document.getElementById("servicioSelect");
    if (selectElement) {
        selectElement.value = serviceName;
        document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
    }
}

// --- 3. CONTROL DEL AVISO DE COOKIES Y MENÚ HAMBURGUESA MÓVIL ---
document.addEventListener("DOMContentLoaded", () => {
    // Aviso de cookies
    const cookiesAceptadas = localStorage.getItem("gb_cookies_aceptadas");
    if (!cookiesAceptadas) {
        const cookieBanner = document.getElementById("cookieBanner");
        if (cookieBanner) cookieBanner.style.display = "flex";
    }

    // Menú hamburguesa responsive
    const navToggle = document.getElementById("navToggle");
    const primaryNav = document.querySelector("nav ul");

    if (navToggle && primaryNav) {
        navToggle.addEventListener("click", () => {
            primaryNav.classList.toggle("active");
        });

        // Ocultar menú al hacer clic en cualquier enlace
        primaryNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                primaryNav.classList.remove("active");
            });
        });
    }
});

function aceptarCookies() {
    localStorage.setItem("gb_cookies_aceptadas", "true");
    const cookieBanner = document.getElementById("cookieBanner");
    if (cookieBanner) cookieBanner.style.display = "none";
}

// --- 4. LÓGICA DE GALERÍA AMPLIADA Y MULTI-IMAGEN (LIGHTBOX) ---
let currentImages = [];
let currentImageIndex = 0;
let currentTitle = "";

function openGallery(imagesArray, title) {
    currentImages = imagesArray;
    currentImageIndex = 0;
    currentTitle = title;

    updateModalImage();
    document.getElementById("imageModal").style.display = "flex";
}

function updateModalImage() {
    const modalImg = document.getElementById("modalImg");
    const modalCaption = document.getElementById("modalCaption");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    modalImg.src = currentImages[currentImageIndex];
    
    if (currentImages.length > 1) {
        modalCaption.innerText = `${currentTitle} (${currentImageIndex + 1}/${currentImages.length})`;
        prevBtn.style.display = "flex";
        nextBtn.style.display = "flex";
    } else {
        modalCaption.innerText = currentTitle;
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
    }
}

function changeImage(direction) {
    currentImageIndex += direction;
    if (currentImageIndex < 0) {
        currentImageIndex = currentImages.length - 1;
    } else if (currentImageIndex >= currentImages.length) {
        currentImageIndex = 0;
    }
    updateModalImage();
}

function closeGallery() {
    document.getElementById("imageModal").style.display = "none";
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeGallery();
    }
});

// --- 5. MOTOR 3D: MALLA CICLÓNICA GALVANIZADA EN VIVO ---
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("hero-3d-canvas");
    if (!canvas || typeof THREE === "undefined") return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 45);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const cols = 28;
    const rows = 18;
    const spacing = 3.2;

    const gridGroup = new THREE.Group();

    const positions = [];
    for (let r = -rows / 2; r < rows / 2; r++) {
        for (let c = -cols / 2; c < cols / 2; c++) {
            const x = c * spacing + (r % 2 === 0 ? 0 : spacing / 2);
            const y = r * (spacing * 0.866);
            const z = Math.sin(c * 0.3) * 1.5;

            positions.push(x, y, z);
        }
    }

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const planeGeo = new THREE.PlaneGeometry(110, 65, cols, rows);
    const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0x0088ff,
        wireframe: true,
        transparent: true,
        opacity: 0.28
    });

    const chainLinkFence = new THREE.Mesh(planeGeo, wireframeMat);
    chainLinkFence.rotation.z = Math.PI / 4; 
    chainLinkFence.rotation.x = -0.2;

    gridGroup.add(chainLinkFence);
    scene.add(gridGroup);

    const particleMat = new THREE.PointsMaterial({
        size: 0.9,
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.7
    });
    const nodesMesh = new THREE.Points(pointsGeo, particleMat);
    nodesMesh.rotation.z = Math.PI / 4;
    gridGroup.add(nodesMesh);

    let mouseX = 0;
    let mouseY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener("mousemove", (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    document.addEventListener("touchmove", (event) => {
        if (event.touches.length > 0) {
            mouseX = (event.touches[0].clientX - windowHalfX);
            mouseY = (event.touches[0].clientY - windowHalfY);
        }
    });

    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        const posAttr = planeGeo.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
            const x = posAttr.getX(i);
            const y = posAttr.getY(i);
            const z = Math.sin(elapsedTime * 1.8 + x * 0.1 + y * 0.1) * 1.2;
            posAttr.setZ(i, z);
        }
        posAttr.needsUpdate = true;

        const targetX = mouseX * 0.0005;
        const targetY = mouseY * 0.0005;

        gridGroup.rotation.y += (targetX - gridGroup.rotation.y) * 0.05;
        gridGroup.rotation.x += (-targetY - gridGroup.rotation.x) * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});

// --- 6. EFECTO INTERACTIVO AVANZADO DE INCLINACIÓN 3D EN TARJETAS ---
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card, .project-card, .feature-item");

    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
            card.style.transition = "transform 0.5s ease";
        });

        card.addEventListener("mouseenter", () => {
            card.style.transition = "none";
        });
    });
});
