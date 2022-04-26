import mongoose from "mongoose";
import { connection } from "../connect";

// Type to represent the Bedrock model
export type bedrockSchema = {
  version: string;
  datePublish: Date;
  isLatest: true|false;
  win32: {
    x64: string;
    arm64?: string;
  },
  linux: {
    x64: string;
    arm64?: string;
  },
  darwin: {
    x64?: string;
    arm64?: string;
  }
};

// Mongoose Schema
export const Schema = new mongoose.Schema<bedrockSchema>({
  version: {
    type: String,
    required: true,
    unique: true
  },
  datePublish: {
    type: Date,
    required: true
  },
  isLatest: {
    type: Boolean,
    required: true
  },
  win32: {
    x64: {
      type: String,
      required: true
    },
    arm64: {
      type: String
    }
  },
  linux: {
    x64: {
      type: String,
      required: true
    },
    arm64: {
      type: String
    }
  },
  darwin: {
    x64: {
      type: String
    },
    arm64: {
      type: String
    }
  }
});

// Bedrock database
export const bedrock = connection.model<bedrockSchema>("bedrock", Schema);
export default bedrock;