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
            const text = children[0] || '';
            if (text.startsWith('[!INFO]')) {
              return <InfoBox>{text.replace('[!INFO]', '').trim()}</InfoBox>;
            }
            if (text.startsWith('[!WARNING]')) {
              return <WarningBox>{text.replace('[!WARNING]', '').trim()}</WarningBox>;
            }
            if (text.startsWith('[!CAUTION]')) {
              return <CautionBox>{text.replace('[!CAUTION]', '').trim()}</CautionBox>;
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