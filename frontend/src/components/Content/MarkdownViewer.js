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
          blockquote: ({ node, children, ...props }) => {
            // Convert children to a flat array so we can inspect each paragraph easily
            const elements = React.Children.toArray(children);
          
            // If there's at least one child, and it's a valid React element
            if (elements.length > 0 && React.isValidElement(elements[0])) {
              // Try to extract the text from the first child (paragraph)
              const firstChildText = elements[0].props.children?.[0];
          
              if (typeof firstChildText === 'string') {
                // Check if the first paragraph is exactly one of the markers
                switch (firstChildText.trim()) {
                  case '[!INFO]':
                    return <InfoBox>{elements.slice(1)}</InfoBox>;
          
                  case '[!WARNING]':
                    return <WarningBox>{elements.slice(1)}</WarningBox>;
          
                  case '[!CAUTION]':
                    return <CautionBox>{elements.slice(1)}</CautionBox>;
          
                  case '[!NOTE]':
                    return <NoteBox>{elements.slice(1)}</NoteBox>;
          
                  default:
                    break;
                }
              }
            }
          
            // If no match, just render a normal blockquote
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