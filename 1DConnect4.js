let board = [];
let numColumns = 20; // Number of slots in the circular board
let currentPlayer = 1; // Player 1 starts
let currentPosition = 0; // Rotating position of the active piece
let winner = null;
let pieceSpeed = 0.15; // Speed at which the piece spins around the board
let canPlace = true; // Prevent placing multiple pieces in quick succession

let centerX, centerY, radius;

function setup() {
  createCanvas(1000, 1000); // Create a canvas for the circular board
  centerX = width / 2;
  centerY = height / 2;
  radius = 150; // Radius of the circular board

  for (let i = 0; i < numColumns; i++) {
    board[i] = 0; // Initialize empty board
  }

  // Setup reset button event
  let resetButton = select('#resetButton');
  resetButton.mousePressed(resetGame);
}

function draw() {
  background(220);
  drawBoard();  // Draw the circular board with squares
  checkWinner();  // Check for win condition

  if (winner) {
    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    text(`Player ${winner} wins!`, centerX, centerY);
    noLoop(); // Stop the game once we have a winner
    select('#resetButton').style('display', 'block'); // Show reset button
  } else {
    rotatePiece(); // Continue rotating the current piece
  }
}

// Draw the circular board using square cells
function drawBoard() {
  let angleStep = TWO_PI / numColumns; // Divide the circle into equal slots

  for (let i = 0; i < numColumns; i++) {
    let angle = i * angleStep;

    // Calculate x, y positions based on the angle
    let x = centerX + radius * cos(angle);
    let y = centerY + radius * sin(angle);

    // Draw each slot as a square (aligned to the angle)
    push();
    translate(x, y);  // Move to the calculated position
    rotate(angle);    // Rotate to align the square with the circle

    stroke(0);
    fill(255);  // Set the color for empty squares
    rectMode(CENTER);
    rect(0, 0, 50, 50);  // Draw square slot

    pop();

    // Draw the player's pieces in the corresponding slots
    if (board[i] === 1) {
      fill(255, 0, 0); // Player 1's piece (red)
      ellipse(x, y, 40, 40);
    } else if (board[i] === 2) {
      fill(0, 0, 255); // Player 2's piece (blue)
      ellipse(x, y, 40, 40);
    }
  }
}

// Animate the piece rotating around the board
function rotatePiece() {
  let angleStep = TWO_PI / numColumns;
  let currentAngle = currentPosition * angleStep;

  // Calculate the position of the rotating piece
  let x = centerX + radius * cos(currentAngle);
  let y = centerY + radius * sin(currentAngle);

  // Draw the active player's rotating piece
  if (currentPlayer === 1) {
    fill(255, 0, 0); // Player 1's piece (red)
  } else {
    fill(0, 0, 255); // Player 2's piece (blue)
  }

  ellipse(x, y, 50, 50);  // Draw the rotating piece larger than placed pieces

  // Move the piece around the board
  currentPosition += pieceSpeed;

  if (currentPosition >= numColumns) {
    currentPosition = 0;
  }
}

// Handle placing the piece when the spacebar is pressed
function keyPressed() {
  if (key === ' ' && canPlace) {
    placePiece();
    canPlace = false;
    setTimeout(() => canPlace = true, 200); // Prevent rapid piece placement
  }
}

// Place the current player's piece in the nearest empty slot
function placePiece() {
  if (winner) return; // If there's a winner, do nothing

  let nearestSlot = findNearestOpenSlot();
  if (nearestSlot !== null) {
    board[nearestSlot] = currentPlayer; // Place the piece in the nearest open slot
    currentPlayer = currentPlayer === 1 ? 2 : 1; // Switch players
  }
}

// Find the nearest open slot to the current rotating position
function findNearestOpenSlot() {
  let minDistance = Infinity;
  let nearestSlot = null;

  let angleStep = TWO_PI / numColumns;
  let currentAngle = currentPosition * angleStep;

  // Calculate the position of the rotating piece
  let currentX = centerX + radius * cos(currentAngle);
  let currentY = centerY + radius * sin(currentAngle);

  // Check each slot to find the closest empty one
  for (let i = 0; i < numColumns; i++) {
    if (board[i] === 0) {  // Only consider empty slots
      let angle = i * angleStep;
      let slotX = centerX + radius * cos(angle);
      let slotY = centerY + radius * sin(angle);

      let distance = dist(currentX, currentY, slotX, slotY);
      if (distance < minDistance) {
        minDistance = distance;
        nearestSlot = i;
      }
    }
  }

  return nearestSlot;
}

// Check if a player has connected 4 pieces in a row
function checkWinner() {
  for (let i = 0; i <= numColumns - 4; i++) {
    if (board[i] !== 0 && board[i] === board[i+1] && board[i] === board[i+2] && board[i] === board[i+3]) {
      winner = board[i]; // Declare the winner
      return;
    }
  }

  // Check the "wraparound" condition (i.e., wrapping from the end of the board to the start)
  for (let i = numColumns - 3; i < numColumns; i++) {
    if (board[i] !== 0 && board[i] === board[(i+1) % numColumns] && board[i] === board[(i+2) % numColumns] && board[i] === board[(i+3) % numColumns]) {
      winner = board[i]; // Declare the winner
      return;
    }
  }
}

// Reset the game when the reset button is pressed
function resetGame() {
  board = Array(numColumns).fill(0); // Clear the board
  currentPlayer = 1; // Reset to Player 1
  currentPosition = 0; // Reset piece position
  winner = null; // No winner yet
  loop(); // Restart the game
  select('#resetButton').style('display', 'none'); // Hide the reset button
}
