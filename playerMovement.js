let moveInterval = null;

function checkCollision(objA, objB) {
  return (
    objA.left < objB.left + objB.width &&
    objA.left + objA.width > objB.left &&
    objA.top < objB.top + objB.height &&
    objA.top + objA.height > objB.top
  );
}

const DIRECTION_KEYS = [
  "000", "022", "045", "067", 
  "090", "112", "135", "157", 
  "180", "202", "225", "247", 
  "270", "292", "315", "337"
];

// Snaps a 0-360 angle to the nearest 16-way direction suffix string
function getDirectionCode(angle) {
  const step = 22.5; // 360 degrees / 16 sectors
  
  // Offset by step/2 (11.25°) so 0° sits in the center of the sector
  const index = Math.floor((angle + step / 2) / step) % 16;
  return DIRECTION_KEYS[index];
}

document.addEventListener("pointerup", event => {
  if (event.button !== 0) return;

  // Set general variables
  const target = event.target;
  const world = document.querySelector("#world");

  // Delete previous pointer
  document.querySelector(".pointer")?.remove();

  if (target.closest("#world")) {

    // Create pointer
    const pointer = document.createElement("div");
    
    pointer.classList.add("pointer");
    pointer.style.position = "absolute";
    pointer.style.width = "6vh";
    pointer.style.height = "6vh";
    pointer.style.backgroundSize = "contain";
    pointer.style.backgroundRepeat = "no-repeat";
    
    pointer.style.backgroundImage = "url(./textures/misc/pointer.gif)";
    pointer.style.pointerEvents = "none";
    
    const worldRect = world.getBoundingClientRect();
    const worldPosX = event.clientX - worldRect.left;
    const worldPosY = event.clientY - worldRect.top;

    pointer.style.left = `calc(${worldPosX}px - 0.65vh)`;
    pointer.style.top = `calc(${worldPosY}px - 1.15vh)`;
    
    world.appendChild(pointer);

    pointer.style.zIndex = Math.floor(pointer.getBoundingClientRect().top);

    // Stop any current movement before starting a new one
    clearInterval(moveInterval);

    const speed = 2;
    const player = document.querySelector("#player");
    if (!player) return;

    // --- 1. CALCULATE DIRECTION ONCE ON CLICK ---
    const initialPlayerRect = player.getBoundingClientRect();
    const playerStartX = initialPlayerRect.left + (initialPlayerRect.width / 2);
    const playerStartY = initialPlayerRect.top + (initialPlayerRect.height / 2);

    const initialPointerRect = pointer.getBoundingClientRect();
    const pointerTargetX = initialPointerRect.left + (initialPointerRect.width / 5);
    const pointerTargetY = initialPointerRect.top + initialPointerRect.height;

    const initialDistanceX = pointerTargetX - playerStartX;
    const initialDistanceY = pointerTargetY - playerStartY;

    // Convert to 0 - 360 degrees
    let degrees = Math.atan2(initialDistanceY, initialDistanceX) * (180 / Math.PI);
    if (degrees < 0) degrees += 360;

    // Apply offset (-90 shift, + 21) and wrap around 360 degrees safely
    let adjustedDegrees = (degrees + 180 - 90 + 360) % 360;

    // Set animation keyframe once so sprite steps smoothly
    const dirCode = getDirectionCode(adjustedDegrees);
    player.style.animation = `model1-walk-${dirCode} 1s steps(5) infinite`;

    // --- 2. MOVEMENT LOOP ---
    moveInterval = setInterval(() => {
      const playerRect = player.getBoundingClientRect();
      
      const playerCenterPosX = playerRect.left + (playerRect.width / 2);
      const playerCenterPosY = playerRect.top + (playerRect.height / 2);

      const pointerRect = pointer.getBoundingClientRect();
      const pointerCenterPosX = pointerRect.left + (pointerRect.width / 5);
      const pointerCenterPosY = pointerRect.top + pointerRect.height;

      const distanceX = pointerCenterPosX - playerCenterPosX;
      const distanceY = pointerCenterPosY - playerCenterPosY;

      const totalDistance = Math.hypot(distanceX, distanceY);

      if (totalDistance < speed) {
        clearInterval(moveInterval);
        pointer.remove();
        player.style.animation = `model1-idle-${dirCode} 1s steps(4) infinite`;
        return;
      }

      // Calculate vector step along slope
      const vx = (distanceX / totalDistance) * speed;
      const vy = (distanceY / totalDistance) * speed;

      
      const playerCollBox = player.querySelector("#collisionBox")?.getBoundingClientRect();

      // Check collision for each tree
      document.querySelectorAll(".treeObject").forEach(tree => {
        const treeCollBox = tree.querySelector(".collisionBox")?.getBoundingClientRect();
        
        if (playerCollBox && treeCollBox && checkCollision(playerCollBox, treeCollBox)) {
          console.log("Collision detected!");

          player.style.left = `${player.offsetLeft - vx * 5}px`;
          player.style.top = `${player.offsetTop - vy * 5}px`;

          clearInterval(moveInterval);
          pointer.remove();
          player.style.animation = `model1-idle-${dirCode} 1s steps(4) infinite`;
          return;
        }
      });

      // Check collision for each dummy
      document.querySelectorAll(".dummy").forEach(dummy => {
        const dummyCollBox = document.querySelector(".dummy .collisionBox")?.getBoundingClientRect();
        
        if (playerCollBox && dummyCollBox && checkCollision(playerCollBox, dummyCollBox)) {
          console.log("Collision detected!");

          player.style.left = `${player.offsetLeft - vx * 5}px`;
          player.style.top = `${player.offsetTop - vy * 5}px`;

          clearInterval(moveInterval);
          pointer.remove();
          player.style.animation = `model1-idle-${dirCode} 1s steps(4) infinite`;
          return;
        }
      });

      player.style.left = `${player.offsetLeft + vx}px`;
      player.style.top = `${player.offsetTop + vy}px`;
      player.style.zIndex = Math.floor(player.offsetTop + player.offsetHeight);
    }, 10);
  }
});

document.addEventListener("DOMContentLoaded", event => {
  const dummies = document.querySelectorAll(".dummy");

  dummies.forEach(dummy => {
    dummy.style.zIndex = Math.floor(dummy.offsetTop + dummy.offsetHeight);
  });
});

