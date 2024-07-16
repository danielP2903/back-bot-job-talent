export interface QuestionData {
  [key: string]: string[] | MessageContent | MessageInfo | string;
}

interface MessageContent {
  id: string;
  role: string;
  content: TextContent[];
}

interface TextContent {
  type: string;
  text: {
    value: string;
  };
}

interface MessageInfo {
  threadId: string;
  messageId: string;
}
