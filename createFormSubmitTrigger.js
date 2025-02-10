function createFormSubmitTrigger() {
var form =
FormApp.openById("Your_Form_ID"); //
Replace with your form's ID
ScriptApp.newTrigger("onFormSubmit_Custom")
.forForm(form)
.onFormSubmit()
.create();
}
