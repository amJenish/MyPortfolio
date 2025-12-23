import ReactMarkdown from "react-markdown";

export function MarkdownView({ content }: { content: string }) {
  return (
    <div className="w-full overflow-x-auto"> {/* Force full width and allow horizontal scroll if needed */}
      <div className="prose prose-zinc dark:prose-invert !max-w-none w-full prose-headings:font-heading prose-code:font-mono">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}