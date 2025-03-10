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
            const text = children[0]?.props?.children || '';
            if (typeof text === 'string') {
              if (text.startsWith('[!INFO]')) {
                return <InfoBox>{children.slice(1)}</InfoBox>;
              }
              if (text.startsWith('[!WARNING]')) {
                return <WarningBox>{children.slice(1)}</WarningBox>;
              }
              if (text.startsWith('[!CAUTION]')) {
                return <CautionBox>{children.slice(1)}</CautionBox>;
              }
              if (text.startsWith('[!NOTE]')) {
                return <NoteBox>{children.slice(1)}</NoteBox>;
              }
            }
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