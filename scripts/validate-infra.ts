import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
const template = parse(readFileSync('infra/template.yaml','utf8'));
const resources = template.Resources;
if (template.Transform !== 'AWS::Serverless-2016-10-31') throw new Error('Falta transformación SAM.');
for (const bucket of ['FrontendBucket','ContentBucket']) {
 const block = resources[bucket].Properties.PublicAccessBlockConfiguration;
 if (!Object.values(block).every((value) => value === true)) throw new Error('Bucket público.');
}
if (resources.ProgressTable.DeletionPolicy !== 'Retain') throw new Error('Los datos deben conservarse al retirar el stack.');
if (resources.UserPoolClient.Properties.GenerateSecret !== false) throw new Error('No usar client secret en SPA.');
if (!resources.LearningApi.Properties.Auth.DefaultAuthorizer) throw new Error('API sin authorizer.');
for (const event of Object.values(resources.ApiFunction.Properties.Events) as {Properties: {Auth: {AuthorizationScopes: string[]}}}[]) {
 if (!event.Properties.Auth.AuthorizationScopes.length) throw new Error('Ruta sin scopes.');
}
if (resources.ApiFunction.Properties.CodeUri !== '../apps/api/dist/') throw new Error('Lambda debe usar solo el bundle de producción.');
console.log('Comprobación estructural local aprobada. No sustituye sam validate --lint ni change set AWS.');
