const feedbackForm = document.getElementById('feedback-form');
feedbackForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(feedbackForm);
  fetch('/send', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert(data.message);
      feedbackForm.reset();
    } else {
      alert(data.message);
    }
  })
  .catch(error => {
    console.error(error);
    alert('Ошибка отправки формы');
  });
});

const containers = document.querySelectorAll('.container');
const about = document.querySelectorAll(".about");

function checkContainers() {
  containers.forEach((container) => {
    const containerTop = container.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;

    if (containerTop < screenHeight - 50) { container.classList.add('visible');
    } else {
        container.classList.remove('visible');
      }
  });

  about.forEach((about) => {
    const aboutTop = about.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;
  
    if (aboutTop < screenHeight) { about.classList.add('visible');
    } else {
        about.classList.remove('visible');
      }
  });
}


window.addEventListener('scroll', checkContainers);
window.addEventListener('load', checkContainers);