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
          p({ node, children, ...props }) {
            // Check if the paragraph starts with [!INFO]
            if (children[0] && children[0].startsWith('[!INFO]')) {
              // Remove the [@INFO] tag and render the rest inside InfoBox
              const infoContent = children[0].replace('[!INFO]', '').trim();
              return <InfoBox>{infoContent}</InfoBox>;
            }
            return <p {...props}>{children}</p>;
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
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownViewer;