// pcm 20172018a Blackjack object



//constante com o número máximo de pontos para blackJack
const MAX_POINTS = 21;


// Classe BlackJack - construtor
class BlackJack {
    constructor() {
        // array com as cartas do dealer
        this.dealer_cards = [];
        // array com as cartas do player
        this.player_cards = [];
        // variável booleana que indica a vez do dealer jogar até ao fim
        //passar a true quando o player faz STAND.
        this.dealerTurn = false;



        // objeto na forma literal com o estado do jogo
        this.state = {
            'gameEnded': false,
            'dealerWon': false,
            'playerBusted': false
        };

        //métodos utilizados no construtor (DEVEM SER IMPLEMENTADOS PELOS ALUNOS)
        this.new_deck = function () {
            const SUITS=4;
            const CARDS_PER_SUIT=13;
            let deck=[];

            for(let i=0; i<SUITS*CARDS_PER_SUIT; i++){
                deck[i]=(i%CARDS_PER_SUIT)+1;
            }
            return deck;
        };

        this.shuffle = function (deck) {
            let indexes=[];
            let shuffled=[];
            let index=null;
            for(let n=0; n<deck.length;n++){
                indexes.push(n);
            }
            for(let n=0; n<deck.length;n++){
                index=Math.floor(Math.random()*indexes.length);
                shuffled.push(deck[indexes[index]]);
                indexes.splice(index, 1);
            }
            return shuffled;
        };

        // baralho de cartas baralhado
        this.deck = this.shuffle(this.new_deck());
    }

    // métodos
    // devolve as cartas do dealer num novo array (splice)
    get_dealer_cards() {
        return this.dealer_cards.slice();
    }

    // devolve as cartas do player num novo array (splice)
    get_player_cards() {
        return this.player_cards.slice();
    }

    // Ativa a variável booleana "dealerTurn"
    setDealerTurn (val) {
        this.dealerTurn = true;
    }

    //MÉTODOS QUE DEVEM SER IMPLEMENTADOS PELOS ALUNOS
    get_cards_value(cards) {
        let noAces = cards.filter(function (card) {return card !=1;});
        let figtransf=noAces.map(function (c){return c>10?10:c;});
        let sum=figtransf.reduce(function (sum, value) {return sum += value;}, 0);
        let numAces=cards.length-noAces.length;
        while (numAces>0){
            if(sum+11>MAX_POINTS){
                return sum+numAces;
            }
            sum+=11;
            numAces-=1;
        }
        return sum+numAces;
    }


    dealer_move() {
        let card=this.deck[0];
        this.deck.splice(0, 1);
        this.dealer_cards.push(card);
        return this.get_game_state();
    }

    player_move() {
        let card=this.deck[0];
        this.deck.splice(0, 1);
        this.player_cards.push(card);
        return this.get_game_state();
    }

    get_game_state() {
        let playerPoints=this.get_cards_value(this.player_cards);
        let dealerPoints=this.get_cards_value(this.dealer_cards);


        //condiçoes vitoria e derrota do player
        let playerBusted=playerPoints>MAX_POINTS;
        let playerWon=playerPoints===MAX_POINTS;

        //condiçoes vitoria e derrota do dealer
        let dealerBusted=this.dealerTurn&&dealerPoints>MAX_POINTS;
        let dealerWon=this.dealerTurn&&dealerPoints>playerPoints&&dealerPoints<=MAX_POINTS;

        this.state.gameEnded=playerBusted||playerWon||dealerBusted||dealerWon;

        this.state.dealerWon=dealerWon;
        this.state.playerBusted=playerBusted;

        return this.state;
    }
}