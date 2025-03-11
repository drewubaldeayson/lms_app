import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Box } from '@mui/material';
import InfoBox from './InfoBox';

const MarkdownViewer = ({ content }) => {
  return (
    <Box sx={{ p: 2 }}>
      <ReactMarkdown
        components={{
          blockquote({ node, children, ...props }) {
            // Convert to an array so we can easily inspect each paragraph
            const elements = React.Children.toArray(children);
  
            // If we have at least one paragraph, check its text
            if (elements.length > 0 && React.isValidElement(elements[0])) {
              const firstChildText = elements[0].props.children?.[0];
              if (typeof firstChildText === 'string') {
                // Check if the line is exactly "[!INFO]"
                if (firstChildText.trim() === '[!INFO]') {
                  // Render all paragraphs except the first one inside an InfoBox
                  return <InfoBox>{elements.slice(1)}</InfoBox>;
                }
                // You can add more checks for [!WARNING], etc.
              }
            }
  
            // If none of the custom markers matched, just render a normal blockquote
            return <blockquote {...props}>{children}</blockquote>;
          },
        
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownViewer;