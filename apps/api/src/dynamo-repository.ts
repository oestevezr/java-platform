import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { BatchGetCommand, DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { adminDirectorySchema, candidateProgressSchema, emptyProgress, type StudyPlan } from '@netec/contracts';
import { HttpError } from './auth';
import { keys, type ProgressRepository } from './repository';

export class DynamoProgressRepository implements ProgressRepository {
 private client = DynamoDBDocumentClient.from(new DynamoDBClient({}), { marshallOptions: { removeUndefinedValues: true } });
 private get table() { const name = process.env.PROGRESS_TABLE; if (!name) throw new Error('PROGRESS_TABLE is required.'); return name; }
 async getProgress(sub: string) {
  const result = await this.client.send(new BatchGetCommand({ RequestItems: {
   [this.table]: { Keys: [keys.profile(sub), keys.plan(sub), keys.progress(sub)], ConsistentRead: true }
  }}));
  if (Object.keys(result.UnprocessedKeys ?? {}).length) throw new HttpError(503, 'Guardado ocupado; vuelve a intentarlo.');
  const items = result.Responses?.[this.table] ?? [];
  const profile = items.find((item) => item.SK === 'PROFILE');
  const plan = items.find((item) => item.SK === 'PLAN');
  const summary = items.find((item) => item.SK === 'SUMMARY');
  const defaults = emptyProgress(sub);
  return candidateProgressSchema.parse({
   userId: sub, displayName: profile?.displayName ?? defaults.displayName,
   completedAttempts: summary?.completedAttempts ?? 0, answeredQuestions: summary?.answeredQuestions ?? 0,
   averageScore: summary?.averageScore ?? null, objectives: summary?.objectives ?? [],
   plan: plan?.data ?? defaults.plan
  });
 }
 async savePlan(sub: string, plan: StudyPlan) {
  const next = { ...plan, revision: plan.revision + 1 };
  try {
   await this.client.send(new PutCommand({
    TableName: this.table, Item: { ...keys.plan(sub), data: next },
    ConditionExpression: plan.revision === 0 ? 'attribute_not_exists(PK)' : '#data.#revision = :expected',
    ...(plan.revision === 0 ? {} : { ExpressionAttributeNames: { '#data': 'data', '#revision': 'revision' }, ExpressionAttributeValues: { ':expected': plan.revision } })
   }));
  } catch (error) {
   if (error instanceof Error && error.name === 'ConditionalCheckFailedException') throw new HttpError(409, 'El plan cambió en otro dispositivo. Recarga antes de guardar.');
   throw error;
  }
  return next;
 }
 async listCandidates(cursor?: string) {
  let start: Record<string, string> | undefined;
  if (cursor) {
   if (cursor.length > 2048) throw new HttpError(400, 'Cursor inválido.');
   try {
    const value = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
    if (typeof value.PK !== 'string' || !value.PK.startsWith('USER#') || value.SK !== 'PROFILE' ||
        value.GSI1PK !== 'CANDIDATES' || typeof value.GSI1SK !== 'string') throw new Error('Invalid cursor');
    start = { PK: value.PK, SK: value.SK, GSI1PK: value.GSI1PK, GSI1SK: value.GSI1SK };
   } catch { throw new HttpError(400, 'Cursor inválido.'); }
  }
  const result = await this.client.send(new QueryCommand({
   TableName: this.table, IndexName: 'CandidateDirectory', KeyConditionExpression: 'GSI1PK = :directory',
   ExpressionAttributeValues: { ':directory': 'CANDIDATES' }, Limit: 25, ExclusiveStartKey: start
  }));
  return adminDirectorySchema.parse({
   items: (result.Items ?? []).map((item) => ({
    userId: String(item.PK).slice(5), displayName: item.displayName ?? 'Candidato',
    lastActivityAt: item.lastActivityAt ?? null, completedAttempts: item.completedAttempts ?? 0,
    averageScore: item.averageScore ?? null,
    internalInsights: item.internalInsights ?? { reviewRequired: false, administrativeNote: '' }
   })),
   nextCursor: result.LastEvaluatedKey ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64url') : null
  });
 }
}
