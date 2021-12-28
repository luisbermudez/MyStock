document.addEventListener(
  "DOMContentLoaded",
  () => {
    
    // Signup logic
    // DOM Variables setup
    const signupInput = [...document.getElementsByClassName("signupInputField")];
    const signupInputLabel = [...document.getElementsByClassName("signupInputLabel")];
    const genContainer = $("genContainer");
    const signupBtn = $("signupBtn");

    const nameCompanyInput = new Input(
      signupInput[0], 
      signupInput[0].placeholder, 
      signupInputLabel[0], 
    );

    const emailInput = new Input(
      signupInput[1],
      signupInput[1].placeholder,
      signupInputLabel[1]
    );

    const passwordInput = new Input(
      signupInput[2],
      signupInput[2].placeholder,
      signupInputLabel[2]
    );

    genContainer.addEventListener("click", (e) => {
      nameCompanyInput.formClickListener(e);
      emailInput.formClickListener(e);
      passwordInput.formClickListener(e);
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
    })
  },
  false
);
