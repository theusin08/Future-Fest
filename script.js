    const header = document.querySelector('header');

    window.addEventListener("scroll", function(){
        header.classList.toggle("sticky", window.scrollY >0)
    });

    let menu = document.querySelector('#menu-icon');

    let navbar = document.querySelector('.navbar');

    menu.onclick = ()=>{
        menu.classList.toggle('bx-x');
        navbar.classList.toggle('open');
    }

    window.onscroll = ()=>{
        menu.classList.remove('bx-x');
        navbar.classList.remove('open');
    }

    const sr = ScrollReveal({
        distance: '30px' , 
        duration: 2500,
        reset: true,
    })

    sr.reveal('.home-text' , {delay:200 , origin:'left'});
    sr.reveal('.home-text' , {delay:200 , origin:'right'});
    sr.reveal('.container , .menu , .contact' , {delay:200 , origin:'bottom'});

    document.getElementById('fullscreenLink').addEventListener('click', function (event) {
        event.preventDefault(); // Previne o comportamento padrão da âncora
    
        if (!document.fullscreenElement) {
            // Tenta entrar em tela cheia
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) { // Firefox
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { // Internet Explorer/Edge
                document.documentElement.msRequestFullscreen();
            }
        } else {
            // Sai da tela cheia, caso já esteja em tela cheia
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // Internet Explorer/Edge
                document.msExitFullscreen();
            }
        }
    });