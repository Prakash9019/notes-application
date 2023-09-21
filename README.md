# Creating a Todo App

## Available Scripts

In the project directory, you can run:

### `npm run both`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

Runs the server at the backend on [http://localhost:5000](http://localhost:5000) 

The page will reload when you make changes.\
You may also see any lint errors in the console.


## Project Overview

Hello there!

I'm excited to present to you my Todo App project. This web application is designed to help users manage their tasks and stay organized. It allows users to create, update, and delete tasks, as well as mark them as completed. The app is built using JavaScript, HTML, and CSS, and it leverages the power of the browser's local storage to store the task data.

## Features
**User Registration** is completed he/she is directed to the page where there can add the notes.
##Following are the options we can perform on:
1. **Task Creation**: Users can easily create new tasks by entering a title and a description. Once created, the task is displayed in the task list.
2. **Task Update**: Users can edit existing tasks to modify the title, description, or other details.
3. **Task Deletion**: Users can delete tasks that are no longer needed. This action removes the task from the task list.
4. **Task Completion**: Users can mark tasks as completed, providing a visual indication of their progress.
5. **Persistent Data**: The app utilizes the browser's local storage to store the task data. This means that even if the user refreshes the page or closes the browser, their tasks will be saved and available upon returning to the app.
**After completion**  of the work there can logout from the application,

## Code Explanation

1. Nodejs and expressjs is used for running the server and mongodb to send and retrieve the data.
2. I used **/login**,**/register**,**/addnote**,**/updatenote**,**/deletenote** router to login,register the user authentication and bcrypt to bcrypt the password for security purpose and add,update,delete are used to add,update,delete notes from the application.

