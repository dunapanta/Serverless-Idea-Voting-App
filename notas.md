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
## Idea Voting App Clase 9 List Boards
- Add get Boards
```
import { APIGatewayProxyEvent } from 'aws-lambda';

import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { BoardRecord } from 'src/types/dynamo';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const tableName = process.env.singleTable;

    const boards = await Dynamo.query<BoardRecord>({
      tableName,
      index: 'index1',
      pkKey: 'pk',
      pkValue: 'board',
      limit: 10,
    });

    const responseData = boards
      .map(({ pk, sk, ...rest }) => rest)
      .filter((board) => board.isPublic);

    return formatJSONResponse({ body: responseData });
  } catch (error) {
    return formatJSONResponse({ statusCode: 500, body: error.message });
  }
};

```

## Idea Voting App Clase 11 Create Idea
```
import { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuid } from 'uuid';

import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { CreateIdeaBody } from 'src/types/apiTypes';
import { IdeaRecord } from 'src/types/dynamo';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const body = JSON.parse(event.body!);
    const tableName = process.env.singleTable;

    const validationError = validateBody(body);
    if (validationError) {
      return validationError;
    }

    const { title, description, boardId } = body as CreateIdeaBody;

    const data: IdeaRecord = {
      id: uuid(),
      pk: `idea-${boardId}`,
      sk: Date.now().toString(),

      boardId,
      ideaTitle: title,
      description,
      date: Date.now(),
    };

    await Dynamo.write({ data, tableName });

    return formatJSONResponse({ body: { message: 'Idea Created', id: data.id } });
  } catch (error) {
    return formatJSONResponse({ statusCode: 500, body: error.message });
  }
};

const validateBody = (body: Record<string, any>) => {
  const { title, boardId } = body;

  if (!title || !boardId) {
    return formatJSONResponse({
      statusCode: 400,
      body: '"title and "boardId are required',
    });
  }
  return;
};

```
