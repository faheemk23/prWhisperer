# pr-whisperer

> A GitHub App built with [Probot](https://github.com/probot/probot) that A Github App that gives the output of the code to users upon creating pull requests.

## How to install

- Go to [Github App Link](https://GitHub.com/apps/pr-whisperer)
- Click on install and select the repositories that you want to use the app in.

## How to use

- While creating pull requests
         
  ```Include "/execute" in any one of your commit messages.```
  
- While commenting on pull requests
  
  ```In the pull request comment "/execute"```

add video

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t pr-whisperer .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> pr-whisperer
```

## Contributing

If you have suggestions for how pr-whisperer could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2023 Faheem Khan
