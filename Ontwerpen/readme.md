# Resources
- Quizzes
- Rooms
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
- quizzes/teams/:teamname/score
- quizzes/rooms/:roomid

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
    - Post a new category
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
    - Parameters: caategoryId - The id of a category to delete
    - returns:
    ```json 
        "_id": Number,
        "category": String
    ```



- **`GET`** api/v1/questions
    - Get a list of all questions
    - Parameters: none
    - returns: 
    ```json 
        "_id": Number,
        "question": String,
        "answer": String,
        "category": String
    ```
- **`GET`** api/v1/questions/:questionId
    - Get specific information of a question
    - Parameters: questionId - Id of a question to get information about
    - returns: 
    ```json 
        "_id": Number,
        "question": String,
        "answer": String,
        "category": String
    ```