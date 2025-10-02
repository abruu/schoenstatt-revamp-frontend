import React from 'react';
import { RichContentRenderer } from '@/components/common/rich-content-renderer';
import { type BlocksContent } from '@strapi/blocks-react-renderer';

// Sample data from the user's request
const sampleContent: BlocksContent = [
  {
    "type": "paragraph",
    "children": [
      {
        "bold": true,
        "text": "We are thrilled to announce the grand opening of our brand new, state-of-the-art facility at Kuttur, Thrissur. This milestone represents a significant step forward in our mission to provide world-class German language education in Kerala.",
        "type": "text"
      }
    ]
  },
  {
    "type": "paragraph",
    "children": [
      {
        "text": "",
        "type": "text"
      }
    ]
  },
  {
    "type": "paragraph",
    "children": [
      {
        "text": "",
        "type": "text"
      }
    ]
  },
  {
    "type": "list",
    "format": "ordered",
    "children": [
      {
        "type": "list-item",
        "children": [
          {
            "text": "First ordered list item",
            "type": "text"
          }
        ]
      },
      {
        "type": "list-item",
        "children": [
          {
            "text": "Second ordered list item",
            "type": "text"
          }
        ]
      }
    ]
  },
  {
    "type": "paragraph",
    "children": [
      {
        "text": "",
        "type": "text"
      }
    ]
  },
  {
    "type": "list",
    "format": "unordered",
    "children": [
      {
        "type": "list-item",
        "children": [
          {
            "text": "Smart classrooms equipped with interactive whiteboards and audio-visual systems",
            "type": "text"
          }
        ]
      },
      {
        "type": "list-item",
        "children": [
          {
            "text": "Modern library with extensive German language resources",
            "type": "text"
          }
        ]
      },
      {
        "type": "list-item",
        "children": [
          {
            "text": "Comfortable student lounge areas",
            "type": "text"
          }
        ]
      },
      {
        "type": "list-item",
        "children": [
          {
            "text": "Advanced language lab facilities",
            "type": "text"
          }
        ]
      }
    ]
  },
  {
    "type": "heading",
    "level": 1,
    "children": [
      {
        "text": "Welcome to Our New Facility\n\n",
        "type": "text"
      },
      {
        "bold": true,
        "text": "Bold text example\n\n",
        "type": "text"
      },
      {
        "bold": true,
        "text": "Bold and italic\n\n\n",
        "type": "text",
        "italic": true
      },
      {
        "bold": true,
        "text": "Bold, italic, and underlined\n\n\n",
        "type": "text",
        "italic": true,
        "underline": true
      },
      {
        "bold": true,
        "text": "All formatting combined\n\n",
        "type": "text",
        "italic": true,
        "underline": true,
        "strikethrough": true
      },
      {
        "bold": true,
        "code": true,
        "text": "Code with all formatting\n\n\n",
        "type": "text",
        "italic": true,
        "underline": true,
        "strikethrough": true
      },
      {
        "url": "https://example.com",
        "type": "link",
        "children": [
          {
            "bold": true,
            "code": true,
            "text": "Visit our website",
            "type": "text",
            "italic": true,
            "underline": true,
            "strikethrough": true
          }
        ]
      },
      {
        "bold": true,
        "text": "\n\n\n",
        "type": "text",
        "italic": true,
        "underline": true,
        "strikethrough": true
      }
    ]
  }
];

export function RichContentTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Rich Content Renderer Test
          </h1>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <RichContentRenderer content={sampleContent} />
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              This component demonstrates the RichContentRenderer with various formatting options
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
