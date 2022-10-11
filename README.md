
# Task Manager Backend

Task manager backend


## API Reference

You can see the documentation of the api in the following link [API](https://harmonious-tapioca-0781c4.netlify.app)
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URI`: Url mongo database, in this url write name collection 'TaskManager'

`JWT_SECRET`: Word to unsign a JWT

`FRONTED_URL`: URL fronted

#### Node mailer


These credentials can be those of the mailtrap or credentials of app for example gmail

`NODEEMAIL_USER`: Email user gmail or user mailtrap

`NODEEMAIL_PASS`: Password user gmail or mailtrap

`NODEEMAIL_HOST`: Host user gmail or mailtrap

`NODEEMAIL_PORT`: Default port 465
## Feedback

* In src/index.js line 23, you can add others environment variables this in order to be able to add more domains to and not be blocked by cors.
* If you change something in the api, try to document it and re-generate the json doc with "npm run docs"

## Authors

- [@camm852](https://www.github.com/camm852)


## 🔗 Links
[![FRONTEND](https://img.shields.io/badge/Frontend-Github-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://github.com/camm852/TaskManager-React)

