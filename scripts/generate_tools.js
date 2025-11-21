import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerPath = path.join(__dirname, '../swagger (1).yaml');
const outputPath = path.join(__dirname, '../src/generated-tools.ts');

const swagger = yaml.load(fs.readFileSync(swaggerPath, 'utf8'));

const definitions = swagger.definitions || {};

function resolveRef(ref) {
    if (!ref.startsWith('#/definitions/')) return { type: 'object' };
    const name = ref.split('/').pop();
    return definitions[name];
}

function resolveSchema(schema, visited = new Set()) {
    if (!schema) return { type: 'any' };
    
    if (schema.$ref) {
        if (visited.has(schema.$ref)) return { type: 'object' };
        visited.add(schema.$ref);
        const resolved = resolveRef(schema.$ref);
        return resolveSchema(resolved, visited);
    }

    if (schema.type === 'array') {
        return {
            type: 'array',
            items: resolveSchema(schema.items, new Set(visited))
        };
    }

    if (schema.type === 'object' || schema.properties) {
        const props = {};
        const required = schema.required || [];
        for (const key in schema.properties) {
            props[key] = resolveSchema(schema.properties[key], new Set(visited));
        }
        return {
            type: 'object',
            properties: props,
            required: required
        };
    }

    return {
        type: schema.type || 'string',
        description: schema.description,
        enum: schema.enum
    };
}

const tools = [];
const handlers = [];

for (const pathKey in swagger.paths) {
    const pathItem = swagger.paths[pathKey];
    for (const method in pathItem) {
        if (['parameters', '$ref'].includes(method)) continue;

        const operation = pathItem[method];
        const operationId = operation.operationId;
        const toolName = operationId.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        
        const description = operation.description || operation.summary || "No description";
        
        const toolParams = {
            type: "object",
            properties: {},
            required: []
        };

        const params = operation.parameters || [];
        const queryParams = [];
        const pathParams = [];
        let bodySchema = null;

        params.forEach(param => {
            if (param.in === 'path') {
                toolParams.properties[param.name] = resolveSchema(param);
                toolParams.required.push(param.name);
                pathParams.push(param.name);
            } else if (param.in === 'query') {
                toolParams.properties[param.name] = resolveSchema(param);
                if (param.required) toolParams.required.push(param.name);
                queryParams.push(param.name);
            } else if (param.in === 'body') {
                const schema = resolveSchema(param.schema);
                if (schema.type === 'object' && schema.properties) {
                    bodySchema = schema;
                    for (const propName in schema.properties) {
                        if (!toolParams.properties[propName]) {
                            toolParams.properties[propName] = schema.properties[propName];
                            if (schema.required && schema.required.includes(propName)) {
                                toolParams.required.push(propName);
                            }
                        }
                    }
                } else {
                    toolParams.properties['body'] = schema;
                    toolParams.required.push('body');
                }
            }
        });

        tools.push({
            name: toolName,
            description: description.substring(0, 1024),
            inputSchema: toolParams
        });

        // Construct Handler
        let urlExpr = "`" + "${BASE_URL}" + pathKey.replace(/\{/g, "${args.") + "`";
        
        let queryBlock = "";
        queryParams.forEach(p => {
             queryBlock += `if (args['${p}'] !== undefined) params['${p}'] = args['${p}'];\n`;
        });

        let bodyBlock = "";
        if (bodySchema) {
            Object.keys(bodySchema.properties).forEach(p => {
                bodyBlock += `if (args['${p}'] !== undefined) data['${p}'] = args['${p}'];\n`;
            });
        } else if (params.some(p => p.in === 'body')) {
            bodyBlock += `if (args.body !== undefined) Object.assign(data, args.body);\n`;
        }

        const handlerCode = `
        case "${toolName}": {
            const url = ${urlExpr};
            const params: any = {};
            const data: any = {};
            
            ${queryBlock}
            ${bodyBlock}
            
            const response = await axios({
                method: "${method}",
                url: url,
                headers: getAuthHeaders(),
                params: params,
                data: data
            });
            return {
                content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
            };
        }`;
        
        handlers.push(handlerCode);
    }
}

const fileContent = `
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const BASE_URL = "https://api.cloud.scenario.com/v1";

function getAuthHeaders() {
    const key = process.env.SCENARIO_API_KEY;
    const secret = process.env.SCENARIO_API_SECRET;
    if (!key || !secret) {
        throw new Error("Missing SCENARIO_API_KEY or SCENARIO_API_SECRET");
    }
    const authString = Buffer.from(\`\${key}:\${secret}\`).toString('base64');
    return {
        "Authorization": \`Basic \${authString}\`,
        "Content-Type": "application/json"
    };
}

export const tools: Tool[] = ${JSON.stringify(tools, null, 4)};

export async function handleToolCall(name: string, args: any) {
    switch (name) {
        ${handlers.join('\n')}
        default:
            throw new Error(\`Unknown tool: \${name}\`);
    }
}
`;

fs.writeFileSync(outputPath, fileContent);
console.log(`Generated ${tools.length} tools.`);