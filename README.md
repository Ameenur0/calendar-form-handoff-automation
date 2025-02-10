# 📆 **Calendar-Form-Handoff-Automation** 

> **Automate folder creation and PDF handoff using Google Calendar events and Form submissions**  
> *An end-to-end workflow that creates dedicated Drive folders for event attendees (Participant B), then emails them a PDF of their form submissions.*

---

## 🎉 Features
- **Calendar to Drive Folder Mapping**  
  Automatically scans Google Calendar events (within a given date range) and creates a shared folder for Participant A (organizer) and Participant B (attendee).

- **Form Submission Trigger**  
  Sets up an installable trigger on a Google Form so that a custom script runs whenever someone submits the form.

- **Automated PDF Generation**  
  Copies a Google Doc template, replaces placeholders with form responses, then generates a PDF. The PDF is saved in Participant B’s folder and emailed directly to them. Participant A receives a notification too.

---

## 🌐 Prerequisites
1. **Google Apps Script** with the [Advanced Calendar Service](https://developers.google.com/apps-script/advanced/calendar) enabled.  
2. A **Google Form** set to *Collect email addresses*.
3. A **Google Doc template** with placeholders (e.g., `{Email}`, `{Question1}`) to be replaced at runtime.
4. Sufficient permissions to create folders in Drive and send emails via your Google account.

---

## ⚙️ Setup & Usage

1. **Clone This Repository**  
   ```bash
   git clone https://github.com/yourusername/Calendar-Form-Handoff-Automation.git
Or just copy the files into your Apps Script environment.

Enable Advanced Services

In your Apps Script editor, go to Project Settings and enable Calendar API.
Ensure it’s also enabled in the Google Cloud console for this project.
Update Calendar Script (processCalendarEventsForWeek.js)

Adjust startDate and endDate to suit your time range.
Optionally change calendarId if you’re not using "primary".
Link the Form (createFormSubmitTrigger.js)

Replace the placeholder form ID with your actual Form ID.
Run createFormSubmitTrigger() once to install the trigger.
Verify under Edit > Current project's triggers that the trigger is active.
Customize the Template Script (onFormSubmit_Custom.js)

Insert your Google Doc template’s file ID into templateId.
Adjust placeholder replacements (like {Question1}) to match the titles in your form.
Run & Test

Step A: Run processCalendarEventsForWeek() (or set a time-based trigger) to generate folders for upcoming events.
Step B: As Participant B (the invited attendee), submit the Google Form.
Result: You (Participant B) receive a PDF via email, and Participant A gets notified.
🚀 Example Flow
Event in Calendar

You schedule a Calendar event for next week and invite john.doe@example.com.
The script creates a folder named yourName john.doe Handoff and shares it with Participant A.
Form Submission

John Doe fills out the Google Form.
Apps Script copies the Doc template, replaces placeholders with John’s answers, saves the PDF in his folder, and emails him the PDF.
Participant A gets an alert that the submission was processed.
📂 File Structure
bash
Copy
Edit
/Calendar-Form-Handoff-Automation
├── processCalendarEventsForWeek.js   # Calendar scanning & folder creation
├── createFormSubmitTrigger.js        # Generates installable form submission trigger
└── onFormSubmit_Custom.js            # Custom form submission logic (template -> PDF -> email)
🔧 Contributing
Fork this repository.
Create a new branch (e.g. feature/my-improvements).
Commit & push your changes.
Open a Pull Request describing enhancements.
💌 Support
For questions or troubleshooting, feel free to open an issue or contact the repository maintainer.

📝 License
This project is provided under an MIT License. See the LICENSE file for details.

Enjoy automating your Google Workspace workflows! ✨
