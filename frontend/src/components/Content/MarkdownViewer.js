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
          blockquote: ({ children }) => {
            const firstLine = children[0]?.props?.children?.[0] || '';
      
            if (typeof firstLine === 'string') {
              if (firstLine.startsWith('[!INFO]')) {
                return <InfoBox>{children.slice(1).map(child => <React.Fragment>{child}</React.Fragment>)}</InfoBox>;
              }
              if (firstLine.startsWith('[!WARNING]')) {
                return <WarningBox>{children.slice(1).map(child => <React.Fragment>{child}</React.Fragment>)}</WarningBox>;
              }
              if (firstLine.startsWith('[!CAUTION]')) {
                return <CautionBox>{children.slice(1).map(child => <React.Fragment>{child}</React.Fragment>)}</CautionBox>;
              }
              if (firstLine.startsWith('[!NOTE]')) {
                return <NoteBox>{children.slice(1).map(child => <React.Fragment>{child}</React.Fragment>)}</NoteBox>;
              }
            }
      
            return <blockquote>{children}</blockquote>;
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