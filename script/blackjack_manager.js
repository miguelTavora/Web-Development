// pcm 20172018a Blackjack oop

// pcm 20172018a Blackjack oop

let game = null;

function debug(an_object) {
	if (debug_page)
		document.getElementById("sec_debug").innerHTML = JSON.stringify(
			an_object
		);
}
let debug_page = true;
function toggle_debug() {
	let elem_debug = document.getElementById("sec_debug");
	if (debug_page) {
		elem_debug.style.display = "block";
	} else {
		elem_debug.style.display = "none";
	}

	debug_page = !debug_page;
}

function buttons_initialization() {
	document.getElementById("card").disabled = false;
	document.getElementById("stand").disabled = false;
	document.getElementById("new_game").disabled = true;
}

function finalize_buttons() {
	document.getElementById("card").disabled = true;
	document.getElementById("stand").disabled = true;
	document.getElementById("new_game").disabled = false;
}

//FUNÇÕES QUE DEVEM SER IMPLEMENTADOS PELOS ALUNOS
function new_game() {
	game = new BlackJack();
	wipe_cards();
	dealer_new_card();
	dealer_new_card();
	player_new_card();
	let cards = game.get_dealer_cards();

	document.getElementById("dealer").innerHTML = cards[0] + " X ";
	document.getElementById("resultado").innerHTML = "";

	document.getElementById("player").innerHTML = game.get_player_cards();

	buttons_initialization();
	debug(game);

	update_player(game.state);
}

function update_dealer(state) {
	document.getElementById("dealer").innerHTML = game.get_dealer_cards();

	let dealer_cards_value = game.get_cards_value(game.get_dealer_cards());
	let player_cards_value = game.get_cards_value(game.get_player_cards());

	if (state.gameEnded) {
		if (
			dealer_cards_value > player_cards_value &&
			dealer_cards_value <= 21
		) {
			document.getElementById("resultado").innerHTML =
				"DEALER WON WITH " + dealer_cards_value + " POINTS";
			finalize_buttons();
		} else if (player_cards_value == 21) {
			document.getElementById("resultado").innerHTML =
				"YOU WON WITH " + player_cards_value + " POINTS";
			finalize_buttons();
		} else {
			document.getElementById("resultado").innerHTML =
				"DEALER BUSTED WITH " + dealer_cards_value + " POINTS";
			finalize_buttons();
		}
	}
}

function update_player(state) {
	let dealer_cards_value = game.get_cards_value(game.get_dealer_cards());
	let player_cards_value = game.get_cards_value(game.get_player_cards());

	if (player_cards_value === 21) {
		document.getElementById("resultado").innerHTML =
			"YOU WON WITH " + player_cards_value + " POINTS";
		finalize_buttons();
	}

	document.getElementById("player").innerHTML = game.get_player_cards();

	if (state.gameEnded) {
		if (
			dealer_cards_value < player_cards_value &&
			player_cards_value <= 21
		) {
			document.getElementById("resultado").innerHTML =
				"YOU WON WITH " + player_cards_value + " POINTS";
			document.getElementById("pontuacao").innerHTML = "";
			finalize_buttons();
		} else {
			document.getElementById("resultado").innerHTML =
				"YOU  BUSTED WITH " + player_cards_value + " POINTS";
			document.getElementById("pontuacao").innerHTML = "";
			finalize_buttons();
		}
	}
	document.getElementById("pontuacao").innerHTML =
		"YOUR CURRENT SCORE IS " + player_cards_value + ".";
}

function dealer_new_card() {
	game.dealer_move();
	update_dealer(game.get_game_state());
	draw_card(game.get_dealer_cards(), true);
	return game.get_game_state();
}

function player_new_card() {
	game.player_move();
	update_player(game.get_game_state());
	draw_card(game.get_player_cards(), false);
	return game.get_game_state();
}

function dealer_finish() {
	game.setDealerTurn(true);

	while (!game.state.gameEnded) {
		game.state = game.get_game_state();
		update_dealer(game.state);
		if (!game.state.gameEnded) {
			game.state = dealer_new_card();
		}
	}
	if (
		game.state.gameEnded &&
		game.get_cards_value(game.get_player_cards()) == 21
	) {
		document.getElementById("resultado").innerHTML =
			"YOU WON WITH 21 POINTS";
		finalize_buttons();
		update_dealer(game.state);
		wipe_cards();
	}
}
