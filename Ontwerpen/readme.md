# Resources
- Quizzes
- Teams
- Rounds
- Categories
- Questions
- Answers
- Scores



# Resources links
- api/v1/
    - **`GET`** categories
    - **`GET`** questions/
        - **`GET`**, **`PUT`**, **`DELETE`** :questionID

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
- **`POST`** api/v1/quizzes
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
    ```json 
        "_id": Number,
        "name": String,
        "quiz": [Quizzes],
        "score": Number
    ```
     **`GET`** /quizzes/:quizId/teams/:teamId
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
- **`PUT`** /quizzes/:quizId/teams/:teamId
    - Add a team from a quiz on approval
    - Parameters: 
        - quizId - the id of a quiz to check which teams are in it
        - teamId - the id of a team to edit
    - Body:
    ```json 
        "quiz": [Quizzes]    ```
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
        "_id": Number,
        "category": String
    ```
- **`GET`** api/v1/categories/:categoryId
    - Get specific information of a category
    - Parameters: categoryId - The id of a category to get information about
    - returns:
    ```json 
        "_id": Number,
        "category": String
    ```
- **`POST`** api/v1/categories
    - Create a new category
    - Parameters: none
    - body: 
    ```json 
        "category": String
    ```
    - returns:
    ```json 
        "_id": Number,
        "category": String
    ```
- **`PUT`** api/v1/categories/:categoryId
    - Edit a specific category name
    - Parameters: categoryId - The id of a category to edit
    - body:
    ```json 
        "category": String
    ```
    - returns
    ```json 
        "_id": Number,
        "category": String
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