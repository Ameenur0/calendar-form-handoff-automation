/**
* This function scans the calendar for events between February 4 and March 11,
* creates a unique folder for each event (if one has not already been created) using the event details,
* and shares the folder with Participant A (the organizer).
*
* IMPORTANT:
*  - Enable the Advanced Calendar Service (Calendar) in your project.
*  - Adjust the calendarId if you are not using the primary calendar.
*/
function processCalendarEventsForWeek() {
 try {
   // Specify your calendar (e.g., "primary" for the primary calendar)
   var calendarId = "primary";


   // Define the time window (ensure proper ISO strings and time zone as needed)
   var startDate = new Date("2025-02-04T00:00:00Z"); // Adjust year/timezone as needed.
   var endDate = new Date("2025-03-11T23:59:59Z");


   // Build optional arguments for the Calendar API request.
   var optionalArgs = {
     timeMin: startDate.toISOString(),
     timeMax: endDate.toISOString(),
     singleEvents: true,  // Expands recurring events into individual instances.
     orderBy: "startTime"
   };


   // Retrieve events using the Calendar API.
   var eventsResponse = Calendar.Events.list(calendarId, optionalArgs);
   if (!eventsResponse.items || eventsResponse.items.length === 0) {
     Logger.log("No events found between " + startDate + " and " + endDate);
     return;
   }


   // Use Script Properties to store the mapping from Participant B's email to folder ID.
   var props = PropertiesService.getScriptProperties();


   // Process each event in the returned list.
   eventsResponse.items.forEach(function(event) {
     try {
       // Verify the event has an organizer.
       if (!event.organizer || !event.organizer.email) {
         Logger.log("Skipping event without an organizer: " + event.summary);
         return;
       }
       var participantAEmail = event.organizer.email;


       // Determine Participant B:
       // Find the first attendee whose email differs from Participant A's.
       if (!event.attendees || event.attendees.length === 0) {
         Logger.log("Skipping event (no attendees): " + event.summary);
         return;
       }
       var participantBEmail = null;
       for (var i = 0; i < event.attendees.length; i++) {
         var attendee = event.attendees[i];
         if (attendee.email && attendee.email !== participantAEmail) {
           participantBEmail = attendee.email;
           break;
         }
       }
       if (!participantBEmail) {
         Logger.log("Skipping event (no valid Participant B found): " + event.summary);
         return;
       }


       // Create a mapping key using Participant B's full email.
       var folderKey = "folder_" + participantBEmail;
       var storedFolderId = props.getProperty(folderKey);
       if (storedFolderId) {
         try {
           // Attempt to get the folder by its stored ID.
           var testFolder = DriveApp.getFolderById(storedFolderId);
           // If found, the folder still exists so skip creating a new folder.
           Logger.log("Folder already exists for Participant B: " + participantBEmail);
           return;
         } catch (error) {
           // If an error occurs (folder not found), remove the stale mapping.
           props.deleteProperty(folderKey);
           props.deleteProperty("participantA_" + participantBEmail);
         }
       }


       // Derive simple names from the emails (using the part before '@').
       var participantAName = participantAEmail.split("@")[0];
       var participantBName = participantBEmail.split("@")[0];


       // Create a folder name without an extra event identifier.
       var folderName = participantAName + " " + participantBName + " Handoff";


       // Create the folder in Google Drive.
       var folder = DriveApp.createFolder(folderName);


       // Share the folder with Participant A (granting edit access).
       folder.addEditor(participantAEmail);


       // Store the mapping keyed by Participant B's full email.
       props.setProperty(folderKey, folder.getId());
       props.setProperty("participantA_" + participantBEmail, participantAEmail);


       Logger.log("Created folder '" + folderName + "' for Participant B: " + participantBEmail);
     } catch (innerError) {
       Logger.log("Error processing event (" + event.summary + "): " + innerError.toString());
     }
   });
 } catch (error) {
   Logger.log("Error in processCalendarEventsForWeek: " + error.toString());
 }
}
