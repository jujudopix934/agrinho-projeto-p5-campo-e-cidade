let player;
let trees = [];
let score = 0;
let tileSize = 40;
let cols, rows;

function setup() {
  createCanvas(800, 400);
  cols = floor(width / tileSize);
  rows = floor(height / tileSize);
  player = { x: 1, y: 1 };
  generateTrees();
}

function draw() {
  background(200, 250, 200);
  
  drawGrid();
  drawTrees();
  drawPlayer();
  
  fill(0);
  textSize(20);
  text("Pontos: " + score, 10, height - 10);
}

function drawGrid() {
  stroke(180);
  for (let i = 0; i < cols; i++) {
    line(i * tileSize, 0, i * tileSize, height);
  }
  for (let j = 0; j < rows; j++) {
    line(0, j * tileSize, width, j * tileSize);
  }
}

function drawPlayer() {
  fill(255, 0, 0);
  rect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
}

function drawTrees() {
  for (let tree of trees) {
    if (tree.state === 'planted') {
      fill(0, 200, 0); // muda
    } else if (tree.state === 'growing') {
      fill(0, 150, 0); // jovem
    } else if (tree.state === 'mature') {
      fill(0, 100, 0); // árvore pronta
    }
    rect(tree.x * tileSize + 5, tree.y * tileSize + 5, tileSize - 10, tileSize - 10);
    
    // Crescimento automático
    if (frameCount % 120 === 0 && tree.state === 'planted') {
      tree.state = 'growing';
    } else if (frameCount % 240 === 0 && tree.state === 'growing') {
      tree.state = 'mature';
    }
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW && player.x > 0) player.x--;
  if (keyCode === RIGHT_ARROW && player.x < cols - 1) player.x++;
  if (keyCode === UP_ARROW && player.y > 0) player.y--;
  if (keyCode === DOWN_ARROW && player.y < rows - 1) player.y++;

  // Colher árvore madura
  if (key === ' ') {
    for (let i = 0; i < trees.length; i++) {
      let t = trees[i];
      if (t.x === player.x && t.y === player.y && t.state === 'mature') {
        trees.splice(i, 1);
        score++;
        break;
      }
    }
  }

  // Plantar nova árvore
  if (keyCode === ENTER) {
    if (!treeAt(player.x, player.y)) {
      trees.push({ x: player.x, y: player.y, state: 'planted' });
    }
  }
}

function generateTrees() {
  // Gerar árvores aleatórias
  for (let i = 0; i < 10; i++) {
    let tx = floor(random(cols));
    let ty = floor(random(rows));
    if ((tx !== player.x || ty !== player.y) && !treeAt(tx, ty)) {
      trees.push({ x: tx, y: ty, state: 'mature' });
    }
  }
}

function treeAt(x, y) {
  for (let t of trees) {
    if (t.x === x && t.y === y) return true;
  }
  return false;
}
