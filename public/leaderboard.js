const tables = document.querySelectorAll('.tableGame');
let tableIndex = 0;
const leaderboard = document.querySelector('.leaderboard');
const backgroundImages = ["url('backgroundImg0.svg')", "url('backgroundImg1.png')", "url('backgroundImg2.svg')", "url('backgroundImg3.png')"]; 
let bgImageIndex = 0; 
document.getElementById('prevGame').addEventListener('click', () => {
  tables[tableIndex].style.display = 'none';
  bgImageIndex--;
  bgImageIndex = bgImageIndex < 0 ? backgroundImages.length - 1 : bgImageIndex;
  leaderboard.style.backgroundImage = backgroundImages[bgImageIndex];
  tableIndex--; 
  if (tableIndex < 0) { 
    tableIndex = tables.length - 1;
  }
  tables[tableIndex].style.display = 'block'; 
});

document.getElementById('nextGame').addEventListener('click', () => {
  tables[tableIndex].style.display = 'none'; 
  bgImageIndex++;
  bgImageIndex = bgImageIndex % backgroundImages.length; 
  leaderboard.style.backgroundImage = backgroundImages[bgImageIndex]; 
  tableIndex++;
  if (tableIndex >= tables.length) { 
    tableIndex = 0;
  }
  tables[tableIndex].style.display = 'block';
});