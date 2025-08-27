import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bold, 
  Italic, 
  List, 
  Quote, 
  Eye, 
  EyeOff,
  Save,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSave?: (content: string) => void;
  isReadOnly?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your thoughts...",
  onSave,
  isReadOnly = false
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (prefix: string, suffix: string = '', placeholder: string = '') => {
    if (!textareaRef.current || isReadOnly) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newText = value.substring(0, start) + 
                   prefix + textToInsert + suffix + 
                   value.substring(end);
    
    onChange(newText);
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(value);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const customComponents = {
    p: ({ children }: any) => (
      <p className="mb-4 leading-relaxed font-elegant text-enhanced">{children}</p>
    ),
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-accent font-bold text-gradient-romantic-3d mb-6">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-elegant font-bold text-title-3d mb-4">{children}</h2>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-6 py-4 my-6 bg-gradient-glass rounded-r-xl italic">
        {children}
      </blockquote>
    ),
    strong: ({ children }: any) => (
      <strong className="font-bold text-primary">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-secondary">{children}</em>
    )
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {!isReadOnly && (
        <div className="glass-romantic-3d p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('**', '**', 'bold text')}
                className="p-2 rounded-lg"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('*', '*', 'italic text')}
                className="p-2 rounded-lg"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('> ', '', 'quote text')}
                className="p-2 rounded-lg"
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('- ', '', 'list item')}
                className="p-2 rounded-lg"
                title="List"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown('❤️')}
                className="p-2 rounded-lg"
                title="Heart"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="rounded-lg"
              >
                {isPreviewMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
              
              {onSave && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-romantic-3d"
                >
                  {isSaving ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Editor/Preview Area */}
      <div className="card-romantic-3d overflow-hidden">
        <AnimatePresence mode="wait">
          {isPreviewMode ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 min-h-[400px]"
            >
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown components={customComponents}>
                  {value || "*Preview will appear here when you start writing...*"}
                </ReactMarkdown>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="min-h-[400px] border-0 resize-none focus:ring-0 font-elegant text-lg leading-relaxed p-6 bg-transparent"
                disabled={isReadOnly}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};