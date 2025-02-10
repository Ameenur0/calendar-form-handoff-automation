/** 
Triggered upon form submission.
* It:
*   - Retrieves Participant B's email from the form submission.
*   - Looks up the corresponding folder using the stored mapping.
*   - Uses a custom Google Doc template to populate placeholders with form responses.
*   - Converts the resulting document into a PDF.
*   - Saves the PDF in the correct folder.
*   - Emails the PDF as an attachment to Participant B.
*   - Notifies Participant A via email.
*
* IMPORTANT:
*   - Ensure your Google Form is set to "Collect email addresses".
*   - Your template should include placeholders like {Timestamp}, {Email}, {Question1}, {Question2}, {Question3},
*     {Question4}, {Question5}, and {Question6}.
*/
function onFormSubmit_Custom(e) {
 try {
   // Get Participant B's email from the form submission.
   var participantBEmail = e.response.getRespondentEmail();
   if (!participantBEmail) {
     throw new Error("No respondent email found; ensure the form collects email addresses.");
   }
  
   // Look up the folder using Participant B's email.
   var props = PropertiesService.getScriptProperties();
   var folderKey = "folder_" + participantBEmail;
   var folderId = props.getProperty(folderKey);
   if (!folderId) {
     throw new Error("No folder mapping found for Participant B: " + participantBEmail);
   }
   var folder = DriveApp.getFolderById(folderId);
  
   // Define your template document ID.
   var templateId = "Your_Google_Doc_Template_ID";  // Replace with your actual template document ID.
  
   // Make a copy of the template in the designated folder.
   var templateFile = DriveApp.getFileById(templateId);
   var copyName = "Submission " + participantBEmail + " " + new Date().toISOString();
   var copyFile = templateFile.makeCopy(copyName, folder);
  
   // Open the copied document for editing.
   var doc = DocumentApp.openById(copyFile.getId());
   var body = doc.getBody();
  
   // Get the current timestamp (or use an actual form timestamp if available).
   var timestamp = new Date().toLocaleString();
  
   // Build a mapping from placeholder names to form response values.
   // Assume your form questions are titled exactly "Question 1", "Question 2", etc.
   // If your template placeholders do not include spaces (e.g. {Question1} instead of {Question 1}),
   // adjust the keys accordingly.
   var responses = {};
   var itemResponses = e.response.getItemResponses();
   itemResponses.forEach(function(itemResponse) {
     // Remove spaces from the question title if necessary (e.g., "Question 1" becomes "Question1").
     var qKey = itemResponse.getItem().getTitle().replace(/\s+/g, "");
     responses[qKey] = itemResponse.getResponse();
   });
  
   // Replace placeholders in the template.
   body.replaceText("{Timestamp}", timestamp);
   body.replaceText("{Email}", participantBEmail);
   body.replaceText("{Question1}", responses["Question1"] || "");
   body.replaceText("{Question2}", responses["Question2"] || "");
   body.replaceText("{Question3}", responses["Question3"] || "");
   body.replaceText("{Question4}", responses["Question4"] || "");
   body.replaceText("{Question5}", responses["Question5"] || "");
   body.replaceText("{Question6}", responses["Question6"] || "");
  
   // Save and close the document.
   doc.saveAndClose();
  
   // Convert the updated document into a PDF blob.
   var pdfBlob = copyFile.getAs("application/pdf").setName("Form Submission - " + participantBEmail + ".pdf");
  
   // Save the PDF in the designated folder (Participant B's folder).
   folder.createFile(pdfBlob);
  
   // Delete the temporary document (move to trash).
   copyFile.setTrashed(true);
  
   // Prepare email details.
   var subject = "Handoff: Your Form Submission";
   var message = "Hello,\n\nAttached is the PDF version of your recent form submission.\n\nThank you.";
  
   // Email the PDF to Participant B with the PDF attached.
   MailApp.sendEmail({
     to: participantBEmail,
     subject: subject,
     body: message,
     attachments: [pdfBlob]
   });
  
   // Retrieve Participant A's email (stored during calendar event processing) for notification.
   var participantAEmail = props.getProperty("participantA_" + participantBEmail);
   if (participantAEmail) {
     // Optionally notify Participant A that a submission was processed.
     var notifySubject = "Handoff: Form Submission Processed";
     var notifyMessage = "A form submission from " + participantBEmail +
                         " has been processed and the PDF was emailed to Participant B.";
     MailApp.sendEmail(participantAEmail, notifySubject, notifyMessage);
   }
  
   Logger.log("Processed and emailed formatted form submission from " + participantBEmail);
 } catch (error) {
   Logger.log("Error in onFormSubmit: " + error.toString());
 }
}
