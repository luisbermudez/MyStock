class Input {
  constructor(inpElement, placeholder, label) {
    this.inpElement = inpElement;
    this.placeholder = placeholder;
    this.label = label;
  }

  // Sets focus style if field is clicked
  clickInputListener() {
    //   Doesn't set focus style unless field gets an input
    if (this.label.style.color === "red") {
      return;
    }

    this.label.style.visibility = "visible";
    this.inpElement.removeAttribute("placeholder");
    this.inpElement.setAttribute("class", "fillingOut");
  }

  // Sets the alert style if field is empty
  emptyInputCheck(e) {
    // keycode 8 = delete key ; keycode 88 = x
    // After pressed if the field is empty it becomes true
    if (
      (e.keyCode === 8 && this.inpElement.value === "") ||
      (e.keyCode === 88 && this.inpElement.value === "") ||
      (e.keyCode === 91 && this.inpElement.value === "")
    ) {
      this.inpElement.removeAttribute("class", "fillingOut");
      this.inpElement.setAttribute("class", "emptyField");
      this.label.style.color = "red";
    } else {
      this.inpElement.removeAttribute("class", "emptyField");
      this.inpElement.setAttribute("class", "fillingOut");
      this.label.style.color = "rgb(137, 100, 197)";
    }
  }

  // Sets the not-empty style
  formClickListener(e) {
    //   Doesn't set Not-focused & not-empty style style unless field gets an input
    if (this.label.style.color === "red") {
      return;
    }

    // Sets up style when clicking the input
    if (e.target === this.inpElement) {
      this.label.style.color = "rgb(137, 100, 197)";
      this.clickInputListener();
      this.inpElement.addEventListener("keyup", (e) => {
        this.emptyInputCheck(e);
      });
    } else {
      this.label.style.color = "rgb(126, 126, 126)";

      if (this.inpElement.value === "") {
        this.inpElement.setAttribute("placeholder", this.placeholder);
        this.inpElement.removeAttribute("class", "fillingOut");
        this.label.style.visibility = "hidden";
      }
    }
  }

  completeStatusCheck() {
    if (this.inpElement.value === "") {
      return false;
    } else {
      return true;
    }
  }
}

function $(id) {
  return document.getElementById(id);
}