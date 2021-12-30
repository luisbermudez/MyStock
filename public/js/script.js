document.addEventListener(
  "DOMContentLoaded",
  () => {
    // Signup logic
    // DOM Variables setup
    const errorMessageCont = [...document.getElementsByClassName("errorMessageCont")];
    const signupInput = [...document.getElementsByClassName("signupInputField")];
    const signupInputLabel = [...document.getElementsByClassName("signupInputLabel")];
    const genContainer = $("genContainer");
    const signupBtn = $("signupBtn");

    console.log(signupInput);


    // Input classes creation
    const nameCompanyInput = new Input(signupInput[0], "Name or Company Name", signupInputLabel[0]);
    const emailInput = new Input(signupInput[1], "Email", signupInputLabel[1]);
    const passwordInput = new Input(signupInput[2], "Password", signupInputLabel[2]);

    genContainer.addEventListener("click", (e) => {
      nameCompanyInput.formClickListener(e);
      emailInput.formClickListener(e);
      passwordInput.formClickListener(e);
    });

    genContainer.addEventListener("keyup", (e) => {
      if(e.keyCode === 9) {
        nameCompanyInput.formClickListener(e);
        emailInput.formClickListener(e);
        passwordInput.formClickListener(e);
      }
    });

    genContainer.addEventListener("input", () => {
      if (
        nameCompanyInput.completeStatusCheck() &&
        emailInput.completeStatusCheck() &&
        passwordInput.completeStatusCheck()
      ) {
        signupBtn.disabled = false;
      } else {
        signupBtn.disabled = true;
      }
    });

    errorMessageCont.forEach((each) => {
      each.addEventListener("click", (e) => {
        if (e.target.classList[0] === "errorMessageClose"){
          e.target.parentNode.style.display = "none";
        }
      })
    })
  },
  false
);
