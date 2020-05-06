# Code Runner API
Code Runner API is a GraphQL API which allows you to make call to execute code.

Code Runner API is open source, so you can contribute and use it for free.

You can test it here : LIEN

## Usage

Code Runner API is a GraphQL API, here is a simple query :
```graphql
{
    run(
        code: "console.log('hello')"
        lang: js
    )
}
```

## Install
`git clone LIEN`

## Build

### Docker
`docker build .`

### Classical
`npm run build`

## Run

### Docker
`docker run -d -p 4266:4266 the-image-you-created`

### Classical
`npm run start`
