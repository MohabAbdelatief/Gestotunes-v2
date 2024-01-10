const LoginTUIOButton = document.getElementById('tuio-btn');
const LoginFaceIDButton = document.getElementById('faceID-btn');

LoginTUIOButton.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = '../TUIO-Verify/TUIO.html';
});
LoginFaceIDButton.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = "../FaceID-Verify/FaceID.html";
});


