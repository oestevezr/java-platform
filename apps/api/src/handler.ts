import { createApplication } from './application';
import { DynamoProgressRepository } from './dynamo-repository';
export const handler = createApplication(new DynamoProgressRepository());
