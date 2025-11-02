import React from 'react';
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import Link from 'next/link';

interface RichContentRendererProps {
  content: BlocksContent;
  className?: string;
}

export function RichContentRenderer({ content, className = "" }: RichContentRendererProps) {
  return (
    <div className={`prose prose-invert prose-lg max-w-none ${className}`}>
      <BlocksRenderer
        content={content}
        blocks={{
          // Paragraph styling
          paragraph: ({ children }) => (
            <p className="text-gray-300 leading-relaxed mb-6 text-base lg:text-lg">
              {children}
            </p>
          ),
          
          // Heading styles
          heading: ({ children, level }) => {
            const baseClasses = "font-bold text-white mb-4 mt-8";
            switch (level) {
              case 1:
                return (
                  <h1 className={`${baseClasses} text-3xl lg:text-4xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent`}>
                    {children}
                  </h1>
                );
              case 2:
                return (
                  <h2 className={`${baseClasses} text-2xl lg:text-3xl`}>
                    {children}
                  </h2>
                );
              case 3:
                return (
                  <h3 className={`${baseClasses} text-xl lg:text-2xl`}>
                    {children}
                  </h3>
                );
              case 4:
                return (
                  <h4 className={`${baseClasses} text-lg lg:text-xl`}>
                    {children}
                  </h4>
                );
              case 5:
                return (
                  <h5 className={`${baseClasses} text-base lg:text-lg`}>
                    {children}
                  </h5>
                );
              case 6:
                return (
                  <h6 className={`${baseClasses} text-sm lg:text-base`}>
                    {children}
                  </h6>
                );
              default:
                return (
                  <h1 className={`${baseClasses} text-3xl lg:text-4xl`}>
                    {children}
                  </h1>
                );
            }
          },
          
          // Lists
          list: ({ children, format }) => {
            const listClasses = "mb-6 space-y-2 text-gray-300";
            if (format === 'ordered') {
              return (
                <ol className={`${listClasses} list-decimal list-inside pl-4`}>
                  {children}
                </ol>
              );
            }
            return (
              <ul className={`${listClasses} list-disc list-inside pl-4`}>
                {children}
              </ul>
            );
          },
          
          // List items
          'list-item': ({ children }) => (
            <li className="text-gray-300 leading-relaxed mb-2 pl-2">
              {children}
            </li>
          ),
          
          // Links
          link: ({ children, url }) => (
            <Link 
              href={url} 
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors duration-200"
              target={url.startsWith('http') ? '_blank' : '_self'}
              rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </Link>
          ),
          
          // Quote/Blockquote
          quote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-400 pl-6 py-4 my-6 bg-white/5 rounded-r-lg italic text-gray-300">
              {children}
            </blockquote>
          ),
          
          // Code blocks
          code: ({ children }) => (
            <pre className="bg-black/50 border border-white/10 rounded-lg p-4 my-6 overflow-x-auto">
              <code className="text-green-400 text-sm font-mono">
                {children}
              </code>
            </pre>
          ),
        }}
        modifiers={{
          // Text formatting modifiers
          bold: ({ children }) => (
            <strong className="font-bold text-white">
              {children}
            </strong>
          ),
          
          italic: ({ children }) => (
            <em className="italic">
              {children}
            </em>
          ),
          
          underline: ({ children }) => (
            <span className="underline underline-offset-2">
              {children}
            </span>
          ),
          
          strikethrough: ({ children }) => (
            <span className="line-through">
              {children}
            </span>
          ),
          
          code: ({ children }) => (
            <code className="bg-black/30 border border-white/20 rounded px-2 py-1 text-sm font-mono text-green-400">
              {children}
            </code>
          ),
        }}
      />
    </div>
  );
}
