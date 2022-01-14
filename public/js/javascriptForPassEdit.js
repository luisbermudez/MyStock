   //confirmPasswordLogic
    let newPasswordCheck;
    const newPasswordInput = document.getElementById("newPasswordInput");
    const confirmPasswordInput = document.getElementById("confirmPasswordInput");
    const newPassErrMess = document.getElementById("newPassErrMess");
    const confirmPassErrMess = document.getElementById("confirmPassErrMess");

    newPasswordInput.addEventListener('keydown',() => {
    newPasswordCheck = newPasswordInput.value
    console.log("newpass", newPasswordCheck)

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if(!regex.test(newPasswordCheck)){
        console.log("Password must be at least 6 characters long and contain at least one number, and uppercase letter.")
        newPassErrMess.innerHTML = "Password must be at least 6 characters long and contain at least one number, and uppercase letter."
    }else{
        newPassErrMess.innerHTML = ""
    }
        });
    
    confirmPasswordInput.addEventListener('keydown', () => {
        let confirmPasswordCheck = confirmPasswordInput.value

        if(newPasswordCheck !== confirmPasswordCheck){
            console.log("Password does not match")
            confirmPassErrMess.innerHTML = "Password does not match"
        }else{
            confirmPassErrMess.innerHTML = ""
        }
    })