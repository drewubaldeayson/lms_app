import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import InfoBox from './InfoBox';

const CustomTable = ({ children }) => {
  return (
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Table sx={{ 
        minWidth: 650, 
        border: '1px solid rgba(224, 224, 224, 1)' 
      }}>
        {children}
      </Table>
    </TableContainer>
  );
};

const CustomTableHead = ({ children }) => (
  <TableHead sx={{ 
    backgroundColor: '#f5f5f5',
    '& th': {
      fontWeight: 'bold',
      borderBottom: '2px solid rgba(224, 224, 224, 1)'
    }
  }}>
    <TableRow>{children}</TableRow>
  </TableHead>
);

const CustomTableBody = ({ children }) => (
  <TableBody>
    {children}
  </TableBody>
);

const CustomTableRow = ({ children }) => (
  <TableRow sx={{ 
    '&:nth-of-type(even)': { 
      backgroundColor: 'rgba(0, 0, 0, 0.04)' 
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)'
    }
  }}>
    {children}
  </TableRow>
);

const CustomTableCell = ({ isHeader, children }) => (
  <TableCell 
    sx={{ 
      borderRight: '1px solid rgba(224, 224, 224, 1)',
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
      padding: '12px',
      ...(isHeader ? { fontWeight: 'bold' } : {})
    }}
  >
    {children}
  </TableCell>
);

const MarkdownViewer = ({ content }) => {
  return (
    <Box sx={{ p: 2 }}>
      <ReactMarkdown
        components={{
          table: CustomTable,
          thead: CustomTableHead,
          tbody: CustomTableBody,
          tr: CustomTableRow,
          th: ({ node, ...props }) => <CustomTableCell isHeader={true} {...props} />,
          td: CustomTableCell,

          blockquote: ({ node, children, ...props }) => {
            console.log("BLOCKQUOTE: ", children);
            // Helper function to extract text from children recursively
            const extractText = (child) => {
              if (typeof child === 'string') {
                return child;
              } else if (React.isValidElement(child)) {
                return React.Children.toArray(child.props.children).map(extractText).join('');
              }
              return '';
            };
    
            const textContent = children.map(extractText).join('').trim();

            const markers = {
              '[!INFO]': InfoBox,
              '[!WARNING]': WarningBox,
              '[!CAUTION]': CautionBox,
              '[!NOTE]': NoteBox,
            };

    
            for (const [marker, Component] of Object.entries(markers)) {
              if (textContent.startsWith(marker)) {
                // Pass the original children to preserve markdown syntax
                const contentWithoutMarker = textContent.slice(marker.length).trim();
                return (
                  <Component>
                    <ReactMarkdown
                    components={{ 
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
                      img: ImageComponent,
                      h1: ({ node, ...props }) => (
                        <h1
                          id={props.children.toString().toLowerCase().replace(/[^\w]+/g, '-')}
                          style={{
                            scrollMarginTop: '80px', // Add scroll margin for smooth scrolling
                            transition: 'background-color 0.3s ease' // Add transition for highlight effect
                          }}
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2
                          id={props.children.toString().toLowerCase().replace(/[^\w]+/g, '-')}
                          style={{
                            scrollMarginTop: '80px',
                            transition: 'background-color 0.3s ease'
                          }}
                          {...props}
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3
                          id={props.children.toString().toLowerCase().replace(/[^\w]+/g, '-')}
                          style={{
                            scrollMarginTop: '80px',
                            transition: 'background-color 0.3s ease'
                          }}
                          {...props}
                        />
                      ),
                    
                    }}>{contentWithoutMarker }</ReactMarkdown>
                  </Component>
                );
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