document.addEventListener('DOMContentLoaded', (event) => {

    const HandGestureImage = document.getElementById('hg-img');
    const ObjectDetectionImage = document.getElementById('od-img');
    const FaceExpressionImage = document.getElementById('fe-img');
    const TUIOImage = document.getElementById('t-img');
    const VirtualMouseImage = document.getElementById('vm-img');

    // BUTTONS

    const HandGestureButton = document.getElementById('GestureButton');
    const ObjectDetectionButton = document.getElementById('ObjectDetectionButton');
    const FaceExpressionButton = document.getElementById('FaceExpressionButton');
    const TUIOButton = document.getElementById('TUIOButton');
    const VirtualMouseButton = document.getElementById('VirtualMouseButton');

    // EVENT LISTENERS


    // HAND GESTURE BUTTON
    HandGestureButton.addEventListener('mouseover', function () {
        HandGestureImage.src = '../../Backend/Database/icons/w-hg.png';
    });
    HandGestureButton.addEventListener('mouseout', () => {
        HandGestureImage.src = '../../Backend/Database/icons/hand-gesture.png';
    });
    // OBJECT DETECTION BUTTON
    ObjectDetectionButton.addEventListener('mouseover', function () {
        ObjectDetectionImage.src = '../../Backend/Database/icons/w-cup.png';
    });
    ObjectDetectionButton.addEventListener('mouseout', () => {
        ObjectDetectionImage.src = '../../Backend/Database/icons/object-detection.png';
    });
    // FACE EXPRESSION BUTTON
    FaceExpressionButton.addEventListener('mouseover', function () {
        FaceExpressionImage.src = '../../Backend/Database/icons/w-fe.png';
    });
    FaceExpressionButton.addEventListener('mouseout', () => {
        FaceExpressionImage.src = '../../Backend/Database/icons/face-expression.png';
    });
    // TUIO BUTTON
    TUIOButton.addEventListener('mouseover', function () {
        TUIOImage.src = '../../Backend/Database/icons/w-qr.png';
    });
    TUIOButton.addEventListener('mouseout', () => {
        TUIOImage.src = '../../Backend/Database/icons/tuio.png';
    });
    // VIRTUAL MOUSE BUTTON
    VirtualMouseButton.addEventListener('mouseover', function () {
        VirtualMouseImage.src = '../../Backend/Database/icons/w-cursor.png';
    });
    VirtualMouseButton.addEventListener('mouseout', () => {
        VirtualMouseImage.src = '../../Backend/Database/icons/virtual-mouse.png';
    });

});