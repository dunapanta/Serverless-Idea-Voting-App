import { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuid } from 'uuid';

import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { CreateBoardBody } from 'src/types/apiTypes';
import { BoardRecord } from 'src/types/dynamo';
import { getUserId } from '@libs/APIGateway';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const body = JSON.parse(event.body!);
    const tableName = process.env.singleTable;

    const validationError = validateBody(body);
    if (validationError) {
      return validationError;
    }

    const { name, description, isPublic = false } = body as CreateBoardBody;

    const data: BoardRecord = {
      id: uuid(),
      pk: 'board',
      sk: Date.now().toString(),

      ownerId: getUserId(event),
      boardName: name,
      description: description,
      isPublic: isPublic,
      date: Date.now(),
    };

    await Dynamo.write({ data, tableName });

    return formatJSONResponse({ body: { message: 'Board Created', id: data.id } });
  } catch (error) {
    return formatJSONResponse({ statusCode: 500, body: error.message });
  }
};

const validateBody = (body: Record<string, any>) => {
  if (!body.name) {
    return formatJSONResponse({ statusCode: 400, body: 'Name is required' });
  }
  return;
};
