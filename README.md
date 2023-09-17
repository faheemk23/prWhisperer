# pr-whisperer

> A GitHub App built with [Probot](https://github.com/probot/probot), deployed on Render, that gives the output of the code to users upon creating pull requests.

## How to install

- Go to [Github App Link](https://GitHub.com/apps/pr-whisperer)
- Click on install and select the repositories that you want to use the app in.


https://github.com/faheemk23/prWhisperer/assets/121616994/dd5d8b83-4c7c-4e53-8b84-f2c94ae60ed7


## How to use

- While creating pull requests
         
  ```Include "/execute" in any one of your commit messages.```
  

https://github.com/faheemk23/prWhisperer/assets/121616994/b0f93148-859a-4a9b-b81c-db33b5e851b1


- While commenting on pull requests
  
  ```In the pull request comment "/execute"```


https://github.com/faheemk23/prWhisperer/assets/121616994/3d21855e-98f1-4c39-9663-8940586b7183

## Summary Report

- ### Approach Taken :
  
  1. Using the meadium article given, first set up a basic app (using probot) in localhost and then deployed it on Render.
  2. Read the documenation for Github webhook events and figured out which events I had to capture ( like "pull_request.opened", "issue_comment.created").
  3. Read the documentation for various Github apis like to get the commit messages on a pull request, get the files, posting a comment etc.
  4. Isolated the final code in the pr files and used the PISTON API to get the output.
  5. Based on the commit messages or comments having the keyword "/execute" conditionally posted a comment with the output. 

- ### Challenges Faced :

  1. **Challenge** : While deploying faced a Error : "SecretOrPrivateKey must be an assymmertric key when using RS256" , **Solution** : Using the error message isolated the error in node modules and figured out that it was because of the Private key not going properly in Environment variables so created a secret .env file on the deployement and it resolved.
  2.  **Challenge** : Integrating ESModule ( for PISTON API) into commonJS module ( node ), **Solution** : Used dynamic import() syntax.
  3.  **Challenge** : Figuring out what kind of event is trigged for commenting on pull requests ( I thought it would be related pull_request only.), **Solution** : used app.onAny and the context object action and payload to figure out it was "issue_create_comment"
  4.  **Challenges** : Code extrated using Diff was giving error in PISTON API as there were extra characters from github like @@ , + , - , **Solution** : created a function to extract only the Javascript code which can be executed by the API.
  5.  **Challenge** : Couldn't use LLM API ( OpenAI ) as they needed paid subscription.
 
 - ###  Suggestions for improvement :

   1. Supporting multiples programming languages instead of just Javascript.
   2. Code explaination in addition with output using other code-based LLMs ( Large Language Models ).

## Contributing

If you have suggestions for how pr-whisperer could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2023 Faheem Khan
