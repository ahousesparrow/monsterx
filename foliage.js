let number = 10;

function spawnTree() {
  for(i = 0; i < number; i++){
    const world = document.querySelector("#world");
    if (!world) return;

    const randomNumX = Math.floor(Math.random() * window.innerWidth);
    const randomNumY = Math.floor(Math.random() * window.innerHeight);
    const randomNumber = Math.floor(Math.random() * 24) + 1;

    const treeObject = document.createElement("div");
    const tree = document.createElement("div");
    const treeShadow = document.createElement("div");
    const treeCollBox = document.createElement("div");

    treeObject.classList.add("treeObject");
    treeObject.style.left = randomNumX + "px";
    treeObject.style.top = randomNumY + "px";

    tree.classList.add("tree");
    tree.style.backgroundImage = `url(./textures/environment/foliage/trees/Tree01_${randomNumber}.png)`;
    
    treeShadow.classList.add("treeShadow");
    treeShadow.style.backgroundImage = `url(./textures/environment/foliage/trees/shadows/Tree01_${randomNumber}.png)`;;

    treeCollBox.classList.add("collisionBox");

    world.appendChild(treeObject);
    treeObject.appendChild(tree);
    treeObject.appendChild(treeShadow);
    treeObject.appendChild(treeCollBox);

    const treeRect = tree.getBoundingClientRect();
    tree.style.zIndex = Math.floor(treeRect.top + tree.offsetHeight);
    treeShadow.style.zIndex = "2";
  }
}

document.addEventListener("DOMContentLoaded", spawnTree);