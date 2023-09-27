"use client"

import { FC, useCallback, useRef } from "react";
import TextareaAutosize from 'react-textarea-autosize'
import { useForm } from 'react-hook-form'
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { zodResolver } from '@hookform/resolvers/zod'
import type EditorJS from "@editorjs/editorjs";

interface EditorProps {
  subpedditId: string
}

const Editor: FC<EditorProps> = ({ subpedditId }) => {
  //PostValidator == schema
  const { 
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subpedditId,
      title: '',
      content: null,
    }
  })

  const ref = useRef<EditorJS>()

  const initializeEditor = useCallback( async () => {
    const EditorJS = ( await import('@editorjs/editorjs')).default
    const Header = ( await import('@editorjs/header')).default
    const Embed = ( await import('@editorjs/embed')).default
    const Table = ( await import ('@editorjs/table')).default
    const List = ( await import ('@editorjs/list')).default
    const Code = ( await import ('@editorjs/code')).default
    const LinkTool = ( await import ('@editorjs/link')).default
    const InlineCode = ( await import ('@editorjs/inline-code')).default
    const ImageTool = ( await import ('@editorjs/image')).default

    //Editor is not currently initialized
    if (!ref.current){
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          ref.current = editor
        },
        placeholder: 'Type here to write your post...',
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          LinkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/link'
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File){
                  
                }
              }
            }
          }
        },
      })
    }
  }, [])
  
  return (
    <div className="w-full p-4 bg-zing-50 rounded-lg border border-zinc-200">
      <form
        id="subpeddit-post-form"
        className="w-fit"
        onSubmit={() => {}}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize placeholder="Title" className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none" />
        </div>
      </form>
    </div>
  );
};

export default Editor;
