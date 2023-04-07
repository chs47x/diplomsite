const right_side = document.querySelectorAll(".gameR")
const left_side = document.querySelectorAll(".gameL")
function checkContainers() {
    right_side.forEach((right_side) => {
      const right_sideTop = right_side.getBoundingClientRect().top;
      const screenHeight = window.innerHeight;
  
      if (right_sideTop < screenHeight - 150) { right_side.classList.add('visible');
      } else {
        right_side.classList.remove('visible');
        }
    });

    left_side.forEach((left_side) => {
        const left_sideTop = left_side.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;
    
        if (left_sideTop < screenHeight - 150) { left_side.classList.add('visible');
        } else {
            left_side.classList.remove('visible');
          }
      });
}
window.addEventListener('scroll', checkContainers);
window.addEventListener('load', checkContainers);