// score.js
function showError(message) {
    var errorBox = document.getElementById('error-box');
    var errorMessage = errorBox.querySelector('.error-message p');
    errorMessage.textContent = message;

    errorBox.style.left = '50%'; // 显示错误消息框
    errorBox.style.opacity = 1; // 显示错误消息框

    setTimeout(function() {
        errorBox.style.opacity = 0; // 几秒后隐藏
    }, 2000); // 3秒后消失
    setTimeout(function() {
        errorBox.style.left = '-50%'; // 显示错误消息框
    }, 3000); // 3秒后消失
}

function showSuccess(message) {
    var successBox = document.getElementById('success-box');
    var successMessage = successBox.querySelector('.success-message p');
    successMessage.textContent = message;

    successBox.style.left = '50%'; // 显示错误消息框
    successBox.style.opacity = 1; // 显示错误消息框

    setTimeout(function() {
        successBox.style.opacity = 0; // 几秒后隐藏

    }, 2000); // 3秒后消失
    setTimeout(function() {
        successBox.style.left = '-50%'; // 显示错误消息框
    }, 3000); // 3秒后移出屏幕，因为会和登陆框重叠
}

function showWarn(message) {
    var warnBox = document.getElementById('warn-box');
    var warnMessage = warnBox.querySelector('.warn-message p');
    warnMessage.textContent = message;

    warnBox.style.left = '50%'; // 显示错误消息框
    warnBox.style.opacity = 1; // 显示错误消息框

    setTimeout(function() {
        warnBox.style.opacity = 0; // 几秒后隐藏

    }, 10000); // 等待用户确认，10秒后消失

    setTimeout(function() {
        warnBox.style.left = '-50%'; // 显示错误消息框
    }, 11000); // 3秒后移出屏幕，因为会和登陆框重叠
}

