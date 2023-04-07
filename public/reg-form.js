const regForm = document.getElementById('reg-form');
const loginForm = document.getElementById('login-form');
const errorElem = document.getElementById('errorReg');
const errorElemLogin = document.getElementById("errorLogin");

function showWindow(){
  const auth = document.getElementById("login-form");
  const reg = document.getElementById("reg-form");
  if (reg.style.display =="block"){
    reg.style.display = "none";
  }
  auth.style.display = "block";
  }
function changheWindow(){
  const auth = document.getElementById("login-form");
  const reg = document.getElementById("reg-form");
  if (auth.style.display =="block"){
    auth.style.display = "none";
  }
  reg.style.display = "block";
}

regForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(regForm);
  try {
    const response = await fetch('/registration', {
      method: 'POST',
      body: formData
    });
    if (response.ok) {
      window.location.href = '/games';
    } else{
      errorElem.style.display = 'block';
    }
  } catch (error) {
    console.error(error);
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  try {
    const response = await fetch('/login', {
      method: 'POST',
      body: formData
    });
    if (response.ok) {
      window.location.href = '/games';
    } else{
      errorElemLogin.style.display = 'block';
    }
  } catch (error) {
    console.error(error);
  }
});
