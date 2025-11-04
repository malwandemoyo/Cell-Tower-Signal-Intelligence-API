import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequest,
  ErrorCode,
  ListToolsRequest,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { CellTowerService } from './services/cellTowerService.js';
import { AnalysisService } from './services/analysisService.js';
import { GoogleMapsService } from './services/googleMapsService.js';
import { OpenAIService } from './services/openaiService';

class CellTowerMCPServer {
  private server: Server;
  private cellTowerService: CellTowerService;
  private analysisService: AnalysisService;
  private googleMaps: GoogleMapsService;
  private openAI: OpenAIService;

  constructor() {
    this.server = new Server(
      {
        name: 'cell-tower-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize services
    this.cellTowerService = new CellTowerService();
    this.googleMaps = new GoogleMapsService(process.env.GOOGLE_MAPS_API_KEY!);
    this.openAI = new OpenAIService(process.env.OPENAI_API_KEY!);
    this.analysisService = new AnalysisService(this.googleMaps, this.openAI);

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequest, async () => ({
      tools: [
        {
          name: 'analyze_location',
          description: 'Analyze a location for cell tower placement and business potential',
          inputSchema: {
            type: 'object',
            properties: {
              latitude: { type: 'number', description: 'Latitude coordinate' },
              longitude: { type: 'number', description: 'Longitude coordinate' },
              radius: { type: 'number', description: 'Search radius in meters', default: 5000 }
            },
            required: ['latitude', 'longitude']
          }
        },
        {
          name: 'search_cell_towers',
          description: 'Search cell towers by various criteria',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Search query or location' },
              radioType: { type: 'string', description: 'Filter by radio type (LTE, GSM, etc)' },
              minSignal: { type: 'number', description: 'Minimum signal strength' },
              maxSignal: { type: 'number', description: 'Maximum signal strength' }
            }
          }
        },
        {
          name: 'correct_spelling',
          description: 'Correct spelling errors in search queries',
          inputSchema: {
            type: 'object',
            properties: {
              text: { type: 'string', description: 'Text to correct' }
            },
            required: ['text']
          }
        },
        {
          name: 'analyze_voice_query',
          description: 'Analyze voice queries for intent and location',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Voice query text' }
            },
            required: ['query']
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequest, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'analyze_location':
            return await this.handleAnalyzeLocation(args as any);
          
          case 'search_cell_towers':
            return await this.handleSearchCellTowers(args as any);
          
          case 'correct_spelling':
            return await this.handleCorrectSpelling(args as any);
          
          case 'analyze_voice_query':
            return await this.handleAnalyzeVoiceQuery(args as any);
          
          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        console.error(`Error in tool ${name}:`, error);
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error}`);
      }
    });
  }

  private async handleAnalyzeLocation(args: { latitude: number; longitude: number; radius?: number }) {
    const analysis = await this.analysisService.analyzeLocation(
      args.latitude,
      args.longitude,
      args.radius
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(analysis, null, 2)
        }
      ]
    };
  }

  private async handleSearchCellTowers(args: { query?: string; radioType?: string; minSignal?: number; maxSignal?: number }) {
    let towers = await this.cellTowerService.getAllTowers();

    // Apply filters
    if (args.radioType) {
      towers = towers.filter(tower => tower.radio === args.radioType);
    }

    if (args.minSignal !== undefined) {
      towers = towers.filter(tower => tower.averageSignal >= args.minSignal!);
    }

    if (args.maxSignal !== undefined) {
      towers = towers.filter(tower => tower.averageSignal <= args.maxSignal!);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(towers, null, 2)
        }
      ]
    };
  }

  private async handleCorrectSpelling(args: { text: string }) {
    const corrected = await this.openAI.correctSpelling(args.text);
    
    return {
      content: [
        {
          type: 'text',
          text: corrected
        }
      ]
    };
  }

  private async handleAnalyzeVoiceQuery(args: { query: string }) {
    const analysis = await this.openAI.analyzeVoiceQuery(args.query);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(analysis, null, 2)
        }
      ]
    };
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Server Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Cell Tower MCP server running on stdio');
  }
}

const server = new CellTowerMCPServer();
server.run().catch(console.error);