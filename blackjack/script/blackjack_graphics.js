function draw_card(cards, dealer) {
	let img_elem = document.createElement('img');

	if (dealer) {
		let dealer_elem = document.getElementById('dealer_cards_img');
		while (dealer_elem.firstChild) {
			dealer_elem.removeChild(dealer_elem.firstChild);
		}
		for (let index = 0; index < cards.length; index++) {
			let img_elem = document.createElement('img');
			//img_elem.src("images\\carta_" + cards[cards.length - 1] + ".jpg");

			if (index === 1 && cards.length === 2) {
				img_elem.src = 'images\\card_X.png';
			} else {
				img_elem.src = 'images\\card_' + cards[index] + '.png';
			}
			img_elem.classList.add('img_carta');
			dealer_elem.appendChild(img_elem);
		}
	} else {
		let player_elem = document.getElementById('player_cards_img');
		while (player_elem.firstChild) {
			player_elem.removeChild(player_elem.firstChild);
		}
		for (let index = 0; index < cards.length; index++) {
			let img_elem = document.createElement('img');
			//img_elem.src("images\\carta_" + cards[cards.length - 1] + ".jpg");

			img_elem.src = 'images\\card_' + cards[index] + '.png';
			img_elem.classList.add('img_carta');

			player_elem.appendChild(img_elem);
		}
	}
}

function wipe_cards() {
	let dealer_elem = document.getElementById('dealer_cards_img');
	while (dealer_elem.firstChild) {
		dealer_elem.removeChild(dealer_elem.firstChild);
	}
	let player_elem = document.getElementById('player_cards_img');
	while (player_elem.firstChild) {
		player_elem.removeChild(player_elem.firstChild);
	}
}
