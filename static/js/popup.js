import {dataHandler} from "./data_handler.js";

export let popupLoginHiding = {
    loginForm: `
    <div id="popup-main">
        <div id="popup-log">
            <form id="popup-form-log" name="popup-form-log" class="popup-form">
                <img id="popup-close" src="static/img/close.png" alt="X">
                <h2 class="popup-h2">Login Form</h2>
                <hr class="popup-hr">
                <div class="popup-div-img">
                    <img class="popup-img" src="static/img/email.png" alt="">
                    <input type="email" id="popup-email" name="popup-email" placeholder="Email" autocomplete="on" minlength="5" required>
                </div>
                <div class="popup-div-img">
                    <img class="popup-img" src="static/img/password.png" alt="">
                    <input type="password" id="popup-password" name="popup-password" class="popup-pass" placeholder="Password" autocomplete="current-password" minlength="8" required>
                </div>
                <a id="popup-submit">Login</a>
                <div id="popup-error" ></div>
            </form>
        </div>
    </div>
    `,
    registerForm: `
    <div id="popup-main">
        <div id="popup-log">
            <form id="popup-form-reg" name="popup-form-reg" class="popup-form">
                <img id="popup-close" src="static/img/close.png" alt="X">
                <h2 class="popup-h2">Register Form</h2>
                <hr class="popup-hr">
                <div class="popup-div-img">
                    <img class="popup-img" src="static/img/email.png" alt="">
                    <input type="email" id="popup-email" name="popup-email" placeholder="Email" autocomplete="on" minlength="5" required>
                </div>
                <div class="popup-div-img">
                    <img class="popup-img" src="static/img/password.png" alt="">
                    <input type="password" id="popup-password-1" name="popup-password-1" class="popup-pass" placeholder="Password" autocomplete="current-password" minlength="8" required>
                </div>
                <div class="popup-div-img">
                    <img class="popup-img" src="static/img/password.png" alt="">
                    <input type="password" id="popup-password-2" name="popup-password-2" class="popup-pass" placeholder="Confirm Password" autocomplete="current-password" minlength="8" required>
                </div>
                <a id="popup-submit">Register</a>
                <div id="popup-error" ></div>
            </form>
        </div>
    </div>
    `,

    divTopBar: document.getElementById('top-bar-login'),

    loginButton: document.getElementById('popup-login'),

    logButtonAddListener: function () {
        popupLoginHiding.loginButton.addEventListener('click', this.divLoginShow);
    },


    registerButton: document.getElementById('popup-register'),

    regButtonAddListener: function () {
        popupLoginHiding.registerButton.addEventListener('click', this.divRegisterShow);
    },

    logoutButton: document.getElementById('popup-logout'),

    logoutButtonAddListener: function () {
        popupLoginHiding.logoutButton.addEventListener('click', this.logoutUser);
    },

    // All listener in one function
    popupAddListeners: function () {
        popupLoginHiding.logButtonAddListener();
        popupLoginHiding.regButtonAddListener();
        popupLoginHiding.logoutButtonAddListener();
        popupLoginHiding.jsIsUserLogin(sessionStorage.getItem('users_login'));
    },

    userLoginButton: document.getElementById('popup-user-log'),

    //Function To Display Popup Login
    divLoginShow: function () {
        popupLoginHiding.divTopBar.insertAdjacentHTML('beforebegin', popupLoginHiding.loginForm);
        document.getElementById('popup-main').style.display = "block";
        popupLoginHiding.closeSubmitAddListener();
    },

    //Function To Display Popup Register
    divRegisterShow: function () {
        popupLoginHiding.divTopBar.insertAdjacentHTML('beforebegin', popupLoginHiding.registerForm);
        document.getElementById('popup-main').style.display = "block";
        popupLoginHiding.closeSubmitAddListener();
    },

    // Function adds the event listener to the submit button and the close cross image.
    closeSubmitAddListener: function () {
        let closeImg = document.getElementById('popup-close');
        closeImg.addEventListener('click', popupLoginHiding.removeForm);

        let submitButton = document.getElementById('popup-submit');
        submitButton.addEventListener('click', popupLoginHiding.submitForm);
    },

    //Function to Remove Popup
    removeForm: function () {
        let loginForm = document.getElementById('popup-main');
        loginForm.style.display = "none";
        loginForm.remove();
    },

    // Function to Submit Form depends on form ID
    submitForm: function () {
        let divForm = document.getElementById('popup-main');
        let formId = divForm.getElementsByTagName('form')[0].id;

        if (formId === 'popup-form-log') {
            let emailValue = document.getElementById('popup-email').value;
            let emailCorrect = popupLoginHiding.validateEmail(emailValue);

            let passValue = document.getElementById('popup-password').value;
            let passCorrect = false

            if (emailCorrect === true) {
                passCorrect = popupLoginHiding.validatePassword(passValue);
            }

            if (emailCorrect === true && passCorrect === true) {
                let dataLogForm = {
                    users_login: emailValue,
                    users_pass: passValue
                };
                dataHandler.loginUser(dataLogForm, function (dataLogForm) {
                    if (dataLogForm['login'] === 'Success') {
                        popupLoginHiding.jsIsUserLogin(dataLogForm['users_login']);
                        popupLoginHiding.jsSetSession(dataLogForm['users_id'], dataLogForm['users_login']);
                        popupLoginHiding.removeForm();
                    } else {
                        let divError = document.getElementById('popup-error');
                        divError.innerText = dataLogForm['error'];
                        divError.style.display = 'block';
                    }
                });
            }
        } else if (formId === 'popup-form-reg') {
            let emailValue = document.getElementById('popup-email').value;
            let emailCorrect = popupLoginHiding.validateEmail(emailValue);

            let pass1Value = document.getElementById('popup-password-1').value;
            let pass1Correct = false

            let pass2Value = document.getElementById('popup-password-2').value;
            let pass2Correct = false

            if (emailCorrect === true) {
                pass1Correct = popupLoginHiding.validatePassword(pass1Value);
            }

            if (emailCorrect === true && pass1Correct === true) {
                pass2Correct = popupLoginHiding.validatePassword(pass1Value, pass2Value);
            }

            if (emailCorrect === true && pass1Correct === true && pass2Correct === true) {
                let dataRegForm = {
                    users_login: emailValue,
                    users_pass: pass1Value
                };
                dataHandler.registerUser(dataRegForm, function (dataRegForm) {
                    if (dataRegForm['register'] === 'Success') {
                        popupLoginHiding.removeForm();
                    } else {
                        let divError = document.getElementById('popup-error');
                        divError.innerText = dataRegForm['error'];
                        divError.style.display = 'block';
                    }
                });
            }
        }
    },

    // Validating Form Field Email
    validateEmail: function (email) {
        let divForm = document.getElementById('popup-main');
        let formId = divForm.getElementsByTagName('form')[0].id;

        let divError = document.getElementById('popup-error');

        if (formId === 'popup-form-reg') {
            if (email === "") {
                divError.innerText = 'The field "Email" cannot be empty!';
                divError.style.display = 'block';
                return false;
            } else if (email.length < 6) {
                divError.innerText = 'The "Email" field must contain at least 6 characters!';
                divError.style.display = 'block';
                return false;
            } else {
                const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                let regexCorrect = re.test(email);

                if (regexCorrect === true) {
                    divError.innerText = '';
                    divError.style.display = 'none';
                    return true;
                } else {
                    divError.innerText = 'The "Email" must contain the at "@" and the dot "."!';
                    divError.style.display = 'block';
                    return false;
                }
            }
        } else if (formId === 'popup-form-log') {
            if (email === "") {
                divError.innerText = 'The field "Email" cannot be empty!';
                divError.style.display = 'block';
                return false;
            } else {
                divError.innerText = '';
                divError.style.display = 'none';
                return true;
            }
        }
    },

    // Validating Form Field Password
    validatePassword: function (password1, password2 = null) {
        let divForm = document.getElementById('popup-main');
        let formId = divForm.getElementsByTagName('form')[0].id;

        let divError = document.getElementById('popup-error');

        if (formId === 'popup-form-reg') {
            if (password1 === "") {
                divError.innerText = 'The field "Password" cannot be empty!';
                divError.style.display = 'block';
                return false;
            } else if (password1.length < 8) {
                divError.innerText = 'The "Password" field must contain at least 8 characters!';
                divError.style.display = 'block';
                return false;
            } else if (password2 !== null && password1 !== password2) {
                divError.innerText = 'The field "Passwords" must match.!';
                divError.style.display = 'block';
                return false;
            } else {
                divError.innerText = '';
                divError.style.display = 'none';
                return true;
            }
        } else if (formId === 'popup-form-log') {
            if (password1 === "") {
                divError.innerText = 'The field "Password" cannot be empty!';
                divError.style.display = 'block';
                return false;
            } else {
                divError.innerText = '';
                divError.style.display = 'none';
                return true;
            }
        }
    },

    jsSetSession: function (users_id, users_login) {
        sessionStorage.clear();
        sessionStorage.setItem('users_id', users_id);
        sessionStorage.setItem('users_login', users_login);
    },

    jsIsUserLogin: function (userName) {
        let dataLogin = {
            users_id: sessionStorage.getItem('users_id'),
            users_login: sessionStorage.getItem('users_login')
        };
        dataHandler.isUserLogin(dataLogin, function (dataLogin) {
            if (dataLogin['is_login'] === true) {
                popupLoginHiding.topBarBtnAppearance(true, userName);
            } else {
                popupLoginHiding.topBarBtnAppearance(false, userName);
            }
        });
    },

    topBarBtnAppearance: function (isLogin, userName) {
        if (isLogin) {
            popupLoginHiding.loginButton.style.display = 'none';
            popupLoginHiding.registerButton.style.display = 'none';
            popupLoginHiding.userLoginButton.innerText = userName;
            popupLoginHiding.userLoginButton.style.display = 'inline-block';
            popupLoginHiding.logoutButton.style.display = 'inline-block';
        } else {
            popupLoginHiding.loginButton.style.display = 'inline-block';
            popupLoginHiding.registerButton.style.display = 'inline-block';
            popupLoginHiding.userLoginButton.innerText = '';
            popupLoginHiding.userLoginButton.style.display = 'none';
            popupLoginHiding.logoutButton.style.display = 'none';
        }
    },

    logoutUser: function () {
        let dataLogout = {
            command: 'LOGOUT'
        };
        dataHandler.userLogout(dataLogout, function (dataLogout) {
            if (dataLogout['logout'] === 'Success') {
                popupLoginHiding.topBarBtnAppearance(false, '');
                sessionStorage.clear();
            } else {
                popupLoginHiding.topBarBtnAppearance(true, sessionStorage.getItem('users_login'));
            }
        });

    },
};