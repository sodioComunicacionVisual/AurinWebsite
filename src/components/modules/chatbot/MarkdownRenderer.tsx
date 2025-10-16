import React from 'react'
import ReactMarkdown from 'react-markdown'

interface MarkdownRendererProps {
  content: string
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p>{children}</p>,
          strong: ({ children }) => <strong>{children}</strong>,
          em: ({ children }) => <em>{children}</em>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          ul: ({ children }) => <ul>{children}</ul>,
          ol: ({ children }) => <ol>{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          code: ({ children, className }) => {
            const isInline = !className
            return isInline ? (
              <code>{children}</code>
            ) : (
              <pre><code>{children}</code></pre>
            )
          },
          h1: ({ children }) => <h1>{children}</h1>,
          h2: ({ children }) => <h2>{children}</h2>,
          h3: ({ children }) => <h3>{children}</h3>,
          blockquote: ({ children }) => <blockquote>{children}</blockquote>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
