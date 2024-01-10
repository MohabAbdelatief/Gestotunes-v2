const LogoutButton = document.getElementById('Logout');

LogoutButton.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = '../Start/startpage.html';
});