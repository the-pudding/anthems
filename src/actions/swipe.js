export function swipe(node, { onSwipeLeft, onSwipeRight }) {
	let xDown, yDown;

	function handleTouchStart(e) {
		xDown = e.touches[0].clientX;
		yDown = e.touches[0].clientY;
	}

	function handleTouchMove(e) {
		if (!xDown || !yDown) {
			return;
		}

		let xUp = e.touches[0].clientX;
		let yUp = e.touches[0].clientY;

		let xDiff = xDown - xUp;
		let yDiff = yDown - yUp;

		if (Math.abs(xDiff) > Math.abs(yDiff)) {
			// Most significant.
			if (xDiff > 0) {
				// left swipe
				onSwipeLeft && onSwipeLeft();
			} else {
				// right swipe
				onSwipeRight && onSwipeRight();
			}
		}

		// Reset values
		xDown = null;
		yDown = null;
	}

	node.addEventListener("touchstart", handleTouchStart);
	node.addEventListener("touchmove", handleTouchMove);

	return {
		destroy() {
			node.removeEventListener("touchstart", handleTouchStart);
			node.removeEventListener("touchmove", handleTouchMove);
		}
	};
}
