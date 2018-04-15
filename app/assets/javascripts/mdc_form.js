window.formInputs = [];
Array.from(document.getElementsByClassName('challenges-js__form_label')).forEach(input => {
  window.formInputs.push(new window.mdc.textfield.MDCTextfield(input));
  console.log(input);
});
