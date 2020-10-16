# Documentation quizzer

## Resources
- Quizzes
- Teams
- Rounds
- Categories
- Questions
- Answers
- Scores



## Resources uri
- **`GET`** /quizzes
    - Get a list of all ongoing quizzes
    - Parameters: none
    - returns
    ```json 
        "_id": Number,
        "password": String,
        "round": Number,
        "teams": [String]
    ```
- **`POST`** /quizzes
    - Create a new quiz
    - Parameters: none
    - body:
    - returns
    ```json 
        "password": String,
        "round": Number,
        "teams": [String]
    ```
- **`GET`** /quizzes/:quizId
    - Get a list of a specific ongoing quiz
    - Parameters: quizId - The id of a quiz to get specific information about
    - returns
    ```json 
        "_id": Number,
        "password": String,
        "round": Number,
        "teams": [String]
    ```
- **`PUT`** /quizzes/:quizId
    - Edit a quiz 
    - Parameters: quizId - The id of a quiz to edit
    - body
    ```json
        "round": Number,
        "teams": String
    ```
    - return 
    ```json 
        "_id": Number,
        "password": String,
        "round": Number,
        "teams": [String]
    ```

- **`DELETE`** /quizzes/:quizId
    - Delete an ongoing quiz
    - Parameters: quizId - The id of a quiz to delete
    - returns
     ```json 
        "description": "quiz has been deleted"
    ```

- **`GET`** /quizzes/:quizId/teams
    - Get a list of all teams on a specific quiz
    - Parameters: quizId - the id of a quiz to check which teams are in it
    - returns
    ``` 
        teams[]
    ```
- **`GET`** /quizzes/:quizId/teams/:teamId
    - Get a list of one team on a specific quiz
    - Parameters: 
        - quizId - the id of a quiz to check which teams are in it
        - teamId - the id of a team to get specific information about
    - returns
     ```json 
        "_id": Number,
        "name": String,
        "quiz": [Quizzes],
        "score": Number
    ```
- **`PUT`** /quizzes/:quizId/teams
    - Add a team from a quiz on approval
    - Parameters: 
        - quizId - the id of a quiz to check which teams are in it
        - teamId - the id of a team to edit
    - Body:
    ```json
        "teamName": String,
        "quiz": [Quizzes]    
    ```
    - returns
    ```json 
        "message":"get_teams"
    ```
- **`DELETE`** /quizzes/:quizId/teams/:teamId
    - Delete a team from a quiz
    - Parameters
        - quizId - the id of a quiz to check which teams are in it
        - teamId - the id of a team to delete from a quiz
    - returns
    ```json 
        "description": "Team has been removed"
    ```
- **`PUT`** /quizzes/:quizId/teams/:teamId/scores
    - Edit a score from a team in a quiz
    - Parameters
        - quizId - the id of a quiz to check which teams are in it
        - teamId - the id of a team to adjust the score
    - body
    ```json 
        "team": [Teams],
        "score": Number
    ```
    returns
    ```json 
        "team": [Teams],
        "score": Number
    ```

- **`GET`** /quizzes/:quizId/categories
    - Get all chosen categories in a quiz
    - Parameters: quizId - the id of a quiz to check the chosen categories
    - returns
     ```json 
        "_id": Number,
        "categories": [Categories]
    ```
- **`DELETE`** /quizzes/:quizId/categories
    - Delete all chosen categories and the associated questions in a quiz
    - Parameters: quizId - the id of a quiz to delete categories and questions from
    - returns
        ```json
            "message": "next_round"
        ```

- **`GET`** /quizzes/:quizId/categories/questions
    - Get all questions from the chosen categories
    - Parameters: quizId - the id of a quiz to check the chosen categories
    - returns
    ```json
        "_id": Number,
        "question": String,
        "answer": String,
        "category": [Categories]
    ```

- **`GET`** /quizzes/:quizId/questions
    - Get all questions that has already been answered or are being answered
    - Parameters: quizId - the id of a quiz to check the questions
    - returns
    ```json
        "_id": Number,
        "question": String,
        "answers": [{
            "team": [Teams],
            "answer": String
        }]
    ```
- **`GET`** /quizzes/:quizId/questions/:questionId/answers
    - Get all answers to a question
    - Parameters: 
        - quizId - the id of a quiz to check the questions
        - questionId - the id of the question being answered to
    - return
        ```json
        "question": String,
        "answers": [{
            "team": [Teams],
            "answer": String
        }]
        ```


- **`POST`** /quizzes/:quizId/questions/:questionId/answers
    - Post an answer given by a team to the ongoing question
    - Parameters: 
        - quizId - the id of a quiz to check the questions
        - questionId - the id of the question to get all answers
    - body
         ```json
        "answers": [{
            "team": [Teams],
            "answer": String
        }]
         ```
    - returns
        ```json
        "message": "team_answered"
        ```
- **`PUT`** /quizzes/:quizId/questions/:questionId/answers/:answerId
    - Edit an answer that was already given by a team
    - Parameters:
        - quizId - the id of a quiz to check the questions
        - questionId - the id of the question to get all answers
        - answerId - the id of the answer that has been given
    - body
         ```json
        "answers": [{
            "answer": String
        }]
         ```
    - returns
        ```json
        "message": "team_answered"
        ```

- **`GET`** api/v1/categories
    - Get a list of all categories
    - Parameters: none
    - returns: 
    ```json 
        "_id": String
    ```
- **`GET`** api/v1/categories/:categoryId
    - Get specific information of a category
    - Parameters: categoryId - The id of a category to get information about
    - returns:
    ```json 
        "_id": String
    ```
- **`POST`** api/v1/categories
    - Create a new category
    - Parameters: none
    - body: 
    ```json 
        "_id": String
    ```
    - returns:
    ```json 
       "_id": String
    ```
- **`PUT`** api/v1/categories/:categoryId
    - Edit a specific category name
    - Parameters: categoryId - The id of a category to edit
    - body:
    ```json 
        "_id": String
    ```
    - returns
    ```json 
      "_id": String
    ```
- **`DELETE`** api/v1/categories/:categoryId
    - Delete a category
    - Parameters: categoryId - The id of a category to delete
    - returns:
    ```json 
        "description": "category has been deleted"
    ```

- **`GET`** api/v1/questions
    - Get a list of all questions
    - Parameters: none
    - returns: 
    ```json 
        "_id": Number,
        "question": String,
        "answer": String,
        "category": [Categories]
    ```
- **`GET`** api/v1/questions/:questionId
    - Get specific information of a question
    - Parameters: questionId - Id of a question to get information about
    - returns: 
    ```json 
        "_id": Number,
        "question": String,
        "answer": String,
        "category": [Categories]
    ```
## Websocket messages
- **`WS`** "teams_ready"
    - To inform a specific team that the quizmaster has accepted a team. A new waiting screen will be shown after this message is received.
- **`WS`** "quizmaster_ready"
    - To inform all teams that the quizmaster is ready with choosing a new question. A new screen will be shown to the teams app.
- **`WS`** "team_answered"
    - To inform the quizmaster app that a team submitted a answer to the current question
- **`WS`** "next_question"
    - A websocket message sent from the quizmaster to other teams to inform about a new question.
- **`WS`** "next_round"
    - To inform all teams that a new round has started.
- **`WS`** "question_choice"
    - To inform the teams that the quizmaster currently isn't ready to start the quiz. The quizmaster first has to choose a new question. 
- **`WS`** "new_points"
    - To inform the scoreboard new scores are assigned to a team. With this message the scoreboard can update the current scores.
- **`WS`** "question_approved"
    - This websocket message will be sent from the quizmaster app to a specific team that the given answer is approved.
- **`WS`** "question_rejected"
    - This websocket message will be sent from the quizmaster app to a specific team that the given answer is rejected.
- **`WS`** "exit_game"
    - This message will be sent to all teams that the game is finished.
- **`WS`** "new_game"
    - A message sent to the scoreboard that a new game has started.
- **`WS`** "get_teams"
    - To inform the quizmaster app which teams have signed in and are waiting for approval.
- **`WS`** "question_open"
    - A message will be sent to all teams to inform that a new question can be answered.
- **`WS`** "question_closed"
    - A message will be sent to all teams to inform that the current question is closed. Teams can't change their answers anymore after this message.

## Routing and middleware
- /quiz
    - The quizmaster can start a new quiz on this page.
- /quiz/approve-teams
    - The quizmaster starts a new quiz night and starts approving teams that can participate
- /quiz/select-categories
    - The quizmaster selects the categories that they can choose from after accepting atleast 2 teams
- /quiz/questions
    - The quizmaster selects a question from the chosen categories on this page. They also have the option to refresh for new questions from the chosen categories.
- /quiz/answers
    - The quizmaster sees the answers that the teams have given in this page. The teams have the option to edit their answer provided the quizmaster didn't close the question yet
- /quiz/approve-answers
    - The quizmaster sees the question and the correct answer. They also approve or reject the answers given by the teams
- /quizzes/:quizid
    - The quiz that the user enters when the room code is correct and the quiz room is not full yet.
- body-parser
    - All incoming data can be parsed with this middleware
- cors
    - Enables CORS requests between the server and the client
- express-session
    - Enables Express to handle sessions
- Websocket
    - Near Real time data exchange between the server and client
