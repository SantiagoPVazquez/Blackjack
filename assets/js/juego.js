
const miModulo = (() => {
    'use strict';

    let deck = [];
    const tipos = ['C','H','D',"S"],
          especiales = ['A', 'J', 'Q', 'K']

    let puntosJugadores = [];
    
    // Referencias del HTML
    const btnPedir = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener'),
          btnNuevo = document.querySelector('#btnNuevo');

    const divCartasJugador = document.querySelectorAll('.divCartas'),
          puntosHTML = document.querySelectorAll('small');
    
    // Esta función inicializa el juego
    const inicializarJuego = (numJugadores = 2) => {
        console.clear();
        deck = crearDeck();
        puntosJugadores = [];
        for (let i=0; i < numJugadores; i++){
            puntosJugadores.push(0);
        }
        puntosHTML.forEach(elem => elem.innerText = 0);
        divCartasJugador.forEach(elem => elem.innerHTML = '');
        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }
    // Esta función crea una nueva baraja y la barajea
    const crearDeck = () => {
        deck = [];
        for(let i = 2; i <=10; i++){
            for (let tipo of tipos){
                deck.push( i + tipo );
            }
        }
    
        for(let tipo of tipos){
            for(let esp of especiales){
                deck.push(esp + tipo);
            }
        }
        return _.shuffle(deck);
    }
    
    // Esta función permite tomar una carta de la baraja
    const pedirCarta = () => {
        if (deck.length === 0) {
            throw 'No hay más cartas en la baraja';
        }
        return deck.pop();
    }
    
    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length -1);
        return (isNaN(valor)) ? 
        (valor === 'A') ? 11: 10
        : valor * 1;
    }
    // 0: Es el primer jugador y el último jugador será la computadora
    const acumularPuntos = ( carta, turno ) => {
        
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];

        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
            imgCarta.src = `assets/cartas/${carta}.png`;
            imgCarta.classList.add('carta');
            divCartasJugador[turno].append(imgCarta);
    }

    const determinarGanador = () => {
        const [puntosMinimos, puntosComputadora] = puntosJugadores;
        setTimeout(()=> {
            if (puntosComputadora === puntosMinimos) {
                alert('Nadie gana :(');
            } else if (puntosMinimos > 21) {
                alert('Computadora gana');
            } else if (puntosComputadora > 21) {
                alert('Jugador gana');
            } else {
                alert('Computadora gana');
            }
        }, 100 );
    }

    // Turno de la computadora
    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length -1);
            crearCarta(carta, puntosJugadores.length - 1)           
        } while ((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));
        determinarGanador();
    }
    
    crearDeck();
    
    // Eventos
    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);
        crearCarta(carta, 0)
    
        if(puntosJugador > 21){
            console.warn('Lo siento, perdiste');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugadores[0]);
        } else if (puntosJugador === 21){
            console.log('21, genial!');
            turnoComputadora(puntosJugadores[0]);
            btnDetener.disabled = true;
        }
    });
    
    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });
    
    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    });
    return {
        nuevoJuego: inicializarJuego
    };
})();

