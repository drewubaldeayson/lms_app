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
            let firstText = '';
            if (children && children.length > 0) {
              const firstChild = children[0];
              if (firstChild && firstChild.props && firstChild.props.children) {
                const childContent = firstChild.props.children;
                if (Array.isArray(childContent)) {
                firstText = childContent.join('');
                } else {
                firstText = childContent;
                }
              }
            }

            const trimmed = firstText.trim();
            if (trimmed.startsWith('[!INFO]')) {
              return <InfoBox>{children.slice(1)}</InfoBox>;
            }
            if (trimmed.startsWith('[!WARNING]')) {
              return <WarningBox>{children.slice(1)}</WarningBox>;
            }
            if (trimmed.startsWith('[!CAUTION]')) {
              return <CautionBox>{children.slice(1)}</CautionBox>;
            }
            if (trimmed.startsWith('[!NOTE]')) {
              return <NoteBox>{children.slice(1)}</NoteBox>;
            }
            // Otherwise, render a normal blockquote.
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