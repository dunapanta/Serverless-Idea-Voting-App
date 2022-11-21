## Idea Voting App Clase 7 Create Board - endpoint and code

- En `functions.ts` definimos las funciones con `http` porque ahora se utiliza coginito

## Idea Voting App Clase 8 Create Board - endpoint and code 2

- Create subscriber of the authorizer (User Id of Cogniito)

```
import { APIGatewayProxyEvent } from 'aws-lambda';

export const getUserId = (event: APIGatewayProxyEvent) => {
  return event.requestContext?.authorizer?.claims?.sub;
};
```
