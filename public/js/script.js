document.addEventListener(
  "DOMContentLoaded",
  () => {
    // General DOM elements
    const errorMessageCont = [
      ...document.getElementsByClassName("errorMessageCont"),
    ];
    const genContainer = $("genContainer");

    // Signup logic
    // DOM Variables setup
    const signupInput = [
      ...document.getElementsByClassName("signupInputField"),
    ];
    const signupInputLabel = [
      ...document.getElementsByClassName("signupInputLabel"),
    ];
    const signupBtn = $("signupBtn");

    // Input classes creation
    const signupNameCompanyInput = new Input(
      signupInput[0],
      "Name or Company Name",
      signupInputLabel[0]
    );
    const signupEmailInput = new Input(
      signupInput[1],
      "Email",
      signupInputLabel[1]
    );
    const signupPasswordInput = new Input(
      signupInput[2],
      "Password",
      signupInputLabel[2]
    );

    // Signup event listeners
    formEventListeners(genContainer, [
      signupNameCompanyInput,
      signupEmailInput,
      signupPasswordInput,
    ]);

    genContainer.addEventListener("input", () => {
      if (
        signupNameCompanyInput.completeStatusCheck() &&
        signupEmailInput.completeStatusCheck() &&
        signupPasswordInput.completeStatusCheck()
      ) {
        signupBtn.disabled = false;
      } else {
        signupBtn.disabled = true;
      }
    });

    // Login logic
    // DOM Variables setup
    const loginInput = [...document.getElementsByClassName("loginInputField")];
    const loginInputLabel = [
      ...document.getElementsByClassName("loginInputLabel"),
    ];
    const loginBtn = $("loginBtn");

    // Input classes creation
    const loginEmailInput = new Input(
      loginInput[0],
      "Email",
      loginInputLabel[0]
    );
    const loginPasswordInput = new Input(
      loginInput[1],
      "Password",
      loginInputLabel[1]
    );

    // Login event listeners
    formEventListeners(genContainer, [loginEmailInput, loginPasswordInput]);

    genContainer.addEventListener("input", () => {
      if (
        loginEmailInput.completeStatusCheck() &&
        loginPasswordInput.completeStatusCheck()
      ) {
        loginBtn.disabled = false;
      } else {
        loginBtn.disabled = true;
      }
    });

    // Error message event listener
    errorMessageCont.forEach((each) => {
      each.addEventListener("click", (e) => {
        if (e.target.classList[0] === "errorMessageClose") {
          e.target.parentNode.style.display = "none";
        }
      });
    });

    // Add new item - Add extra properties event listener
    const checkBoxProperties = $("extraProperties");
    const extraProperties = $("extraPropOptions");

    checkBoxProperties.addEventListener('change', function() {
      if (this.checked) {
        extraProperties.style.display = "block";
      } else {
        extraProperties.style.display = "none";
      }
    })

    //add itemns in collection
    const checkBoxForAddAnItem = $("addNewItem");
    const newItemContainer = $("newItemContainer");

    checkBoxForAddAnItem.addEventListener('change', function(){
      if (this.checked) {
        newItemContainer.style.display = "block";
      } else {
        newItemContainer.style.display = "none";
      }
    })
  },
  false
);
