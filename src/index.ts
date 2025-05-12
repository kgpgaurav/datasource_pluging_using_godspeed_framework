import { GSContext, GSDataSource, GSStatus, PlainObject } from "@godspeedsystems/core";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// Define proper types for configuration
interface ModelConfig {
  name?: string;
  options?: Record<string, any>;
}

interface GeminiConfig {
  api_key: string;
  models?: Record<string, ModelConfig>;
}

export default class DataSource extends GSDataSource {
  public client: any;
  private models: Record<string, GenerativeModel> = {};
  // Remove the protected config declaration as it's already defined in the base class

  protected async initClient(): Promise<object> {
    try {
      const apiKey = this.config.api_key as string;
      if (!apiKey) {
        throw new Error("Gemini API key is not provided in configuration");
      }

      // Initialize the Gemini client
      this.client = new GoogleGenerativeAI(apiKey);
      
      // Pre-initialize models defined in config
      if (this.config.models) {
        // Use type assertion for the entire config.models object
        const modelsConfig = this.config.models as Record<string, ModelConfig>;
        for (const [modelName, modelConfig] of Object.entries(modelsConfig)) {
          this.models[modelName] = this.client.getGenerativeModel({
            model: modelConfig.name || "gemini-2.0-flash-001",
            ...modelConfig.options
          });
        }
      }

      return this.client;
    } catch (error) {
      console.error("Failed to initialize Gemini client:", error);
      throw error;
    }
  }

  async execute(ctx: GSContext, args: PlainObject): Promise<any> {
    try {
      const { operation, model: modelName, prompt, options = {} } = args;
      
      // Get the model - either from pre-initialized models or create a new one
      let model = this.models[modelName];
      if (!model) {
        model = this.client.getGenerativeModel({
          model: modelName || "gemini-2.0-flash-001",
          ...options
        });
      }

      // Handle different operations
      switch (operation) {
        case "generateContent": {
          const response = await model.generateContent(prompt);
          return response.response.text();
        }
        case "streamGenerateContent": {
          // For streaming, we return a promise that resolves to the full text
          const responseStream = await model.generateContentStream(prompt);
          let fullText = "";
          
          // Using the correct approach for streaming based on the Gemini API documentation
          for await (const chunk of responseStream.stream) {
            fullText += chunk.text();
          }
          return fullText;
        }
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error executing Gemini operation: ${error.message}`);
      } else {
        console.error("Error executing Gemini operation:", error);
      }
      throw error;
    }
  }
}

const SourceType = 'DS';
const Type = "gemini"; // this is the loader file of the plugin
const CONFIG_FILE_NAME = "gemini"; // datasource name
const DEFAULT_CONFIG = {
  models: {
    default: {
      name: "gemini-2.0-flash",
      options: {}
    }
  }
};

export {
  DataSource,
  SourceType,
  Type,
  CONFIG_FILE_NAME,
  DEFAULT_CONFIG
};
