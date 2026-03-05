import { Project } from "../interfaces"

export const CosmicQuest: Project = {
  id: "4",
  title: "Cosmic Quest: Educational Math Game",
  description: "CosmicQuest is a space-themed educational game designed to teach addition, subtraction, multiplication, and division at an elementary school level. Students can create their own profiles & save their information as they progress through planets, learning the different subjects, and accruing a fuel score (this game's scoring metric) along the way.",
  githubUrl: "https://github.com/amJenish/Cosmic-Quest",
  tags: ["Java","Java Swing"],
  featured: false,
  content: `
  # CosmicQuest

## Description

CosmicQuest is a space-themed educational game designed to teach addition, subtraction, multiplication, and division at an elementary school level.

Students can create their own profiles, which will save their information as they progress through planets, learning the different subjects, and accruing a fuel score (this game's scoring metric) along the way. This score is displayed on a leaderboard, which will be accessible by all students within the classroom. Additionally, the game has built-in tutorials and a settings menu to allow for greater ease of use.

Teachers will be able to add/remove students from their class and will be able to view the progress of individual students.

Dev mode allows for debuggers to skip to any level and manually change their fuel score.

## Required Libraries and third-party tools

### To Run:
- Java SE - version 19 or above
    - Java Libraries:
        - Java.swing
        - Java.awt
        - Java.io
        - Java.util
        - Java.sound
- Windows 10

### To Build:
- Above tools
- A modern IDE that supports Java (e.g., Eclipse 4.26.0)

## Building the source code

1. Create a new project in your IDE of choice.
2. Download all the Java files alongside the avatars, images, and sounds folders.
3. Copy/move all the Java image files and folders into the src folder.
4. Run the class MainMenuScreen to generate the necessary text files in src (do not move these).
5. To rerun the program, rerun MainMenuScreen.

## User Guide

### Students:
- When first opening the program, the user will see a main menu with various buttons. These buttons are labeled and will take the user to different screens, which will have escape buttons to navigate back.
- Clicking on learn and leaderboard will take the user to the tutorial and class leaderboard respectively.
- Clicking on load will prompt the user to log in using a username and password. Alternatively, clicking new will prompt the user to create a new account.
- Once logged in, the user can then edit their settings using the settings menu, where they can toggle sound and change their profile avatar.
- To play the game, the user can click the play button where they will see their avatar, level map, and fuel score. They can then play any unlocked level where they will answer incoming questions of a certain type (determined by level) to gain score, unlocking the next level if they achieve a certain score threshold.
- The user can logout to return to the main menu and can quit the application from the main menu.

### Teachers:
- Instead of having access to settings and play, teachers have the ability to manage their class by adding/removing students, as well as the ability to view the stats of individual students. Creating a teacher account also generates a class code which will then be associated with the teacher and any student they add to their class.
To create a Teacher account:
1. Run the Jar file
2. Click on new
3. Enter a username and password
4. Select the teacher button 
5. Click on the checkmark
6. Login with your teacher account

### Devs:
- In dev mode, the user has access to everything the students would in addition to the ability to override their game progress, skipping to any level, and editing their fuel count. To access this mode, the user must log in with the username cs2212 and the password ducks2212.
  `
}