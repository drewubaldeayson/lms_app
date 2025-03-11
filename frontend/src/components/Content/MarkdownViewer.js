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
            const textContent = children
                .map(child => typeof child === 'string' ? child : child?.props?.children?.join(''))
                .join('')
                .trim();
        
            if (textContent.startsWith('[!INFO]')) {
                return <InfoBox>{textContent.replace('[!INFO]', '').trim()}</InfoBox>;
            }
            if (textContent.startsWith('[!WARNING]')) {
                return <WarningBox>{textContent.replace('[!WARNING]', '').trim()}</WarningBox>;
            }
            if (textContent.startsWith('[!CAUTION]')) {
                return <CautionBox>{textContent.replace('[!CAUTION]', '').trim()}</CautionBox>;
            }
            if (textContent.startsWith('[!NOTE]')) {
                return <NoteBox>{textContent.replace('[!NOTE]', '').trim()}</NoteBox>;
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