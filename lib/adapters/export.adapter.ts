/**
 * Export adapter interface
 * Provides different export formats for prompts
 */

export interface ExportData {
  prompts: any[];
  collections?: any[];
  metadata?: Record<string, any>;
}

export interface IExportAdapter {
  export(data: ExportData): Promise<string>;
  getContentType(): string;
  getFileExtension(): string;
}

/**
 * JSON Export Adapter
 */
export class JsonExportAdapter implements IExportAdapter {
  async export(data: ExportData): Promise<string> {
    return JSON.stringify(data, null, 2);
  }

  getContentType(): string {
    return "application/json";
  }

  getFileExtension(): string {
    return ".json";
  }
}

/**
 * CSV Export Adapter
 */
export class CsvExportAdapter implements IExportAdapter {
  async export(data: ExportData): Promise<string> {
    const { prompts } = data;
    if (prompts.length === 0) {
      return "";
    }

    // CSV headers
    const headers = [
      "ID",
      "Title",
      "Description",
      "Main Prompt",
      "Negative Prompt",
      "Tags",
      "Length (seconds)",
      "Style Keywords",
      "Created At",
    ];

    // CSV rows
    const rows = prompts.map((prompt) => [
      prompt.id,
      this.escapeCsv(prompt.title),
      this.escapeCsv(prompt.description),
      this.escapeCsv(prompt.mainPrompt),
      this.escapeCsv(prompt.negativePrompt),
      this.escapeCsv(JSON.stringify(prompt.tags)),
      prompt.lengthSeconds,
      this.escapeCsv(JSON.stringify(prompt.styleKeywords)),
      prompt.createdAt,
    ]);

    const csvLines = [headers, ...rows].map((row) => row.join(","));
    return csvLines.join("\n");
  }

  getContentType(): string {
    return "text/csv";
  }

  getFileExtension(): string {
    return ".csv";
  }

  private escapeCsv(value: string): string {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}

/**
 * Markdown Export Adapter
 */
export class MarkdownExportAdapter implements IExportAdapter {
  async export(data: ExportData): Promise<string> {
    const { prompts, metadata } = data;
    let markdown = "# Sora2 Prompt Library Export\n\n";

    if (metadata) {
      markdown += `Exported at: ${new Date().toISOString()}\n\n`;
    }

    markdown += `Total prompts: ${prompts.length}\n\n`;
    markdown += "---\n\n";

    prompts.forEach((prompt, index) => {
      markdown += `## ${index + 1}. ${prompt.title}\n\n`;
      markdown += `**Description:** ${prompt.description}\n\n`;
      markdown += `**Main Prompt:**\n\`\`\`\n${prompt.mainPrompt}\n\`\`\`\n\n`;

      if (prompt.negativePrompt) {
        markdown += `**Negative Prompt:**\n\`\`\`\n${prompt.negativePrompt}\n\`\`\`\n\n`;
      }

      if (prompt.tags && prompt.tags.length > 0) {
        markdown += `**Tags:** ${prompt.tags.join(", ")}\n\n`;
      }

      if (prompt.styleKeywords && prompt.styleKeywords.length > 0) {
        markdown += `**Style Keywords:** ${prompt.styleKeywords.join(", ")}\n\n`;
      }

      markdown += `**Length:** ${prompt.lengthSeconds} seconds\n\n`;
      markdown += `**Created:** ${new Date(prompt.createdAt).toLocaleDateString()}\n\n`;
      markdown += "---\n\n";
    });

    return markdown;
  }

  getContentType(): string {
    return "text/markdown";
  }

  getFileExtension(): string {
    return ".md";
  }
}

// Export adapter registry
export const exportAdapters = {
  json: new JsonExportAdapter(),
  csv: new CsvExportAdapter(),
  markdown: new MarkdownExportAdapter(),
} as const;

export type ExportFormat = keyof typeof exportAdapters;
