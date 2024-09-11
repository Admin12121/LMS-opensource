"use client"
import React, { useEffect, useRef, useState } from 'react'
import * as Y from 'yjs';
import EditorJS  from '@editorjs/editorjs';
// @ts-ignore
import Header from '@editorjs/header';
// @ts-ignore
import List from "@editorjs/list";
// @ts-ignore
import Checklist from '@editorjs/checklist'
// @ts-ignore
import Paragraph from '@editorjs/paragraph';
// @ts-ignore
import Warning from '@editorjs/warning';
// @ts-ignore
import LinkTool from '@editorjs/link';
// @ts-ignore
import RawTool from '@editorjs/raw';
// @ts-ignore
import SimpleImage from "@editorjs/simple-image";
// @ts-ignore
import Embed from '@editorjs/embed';
// @ts-ignore
import Quote from '@editorjs/quote';
// @ts-ignore
import Table from '@editorjs/table'
import { toast } from 'sonner';
import { FILE } from '@/schemas';

const rawDocument={
    "time" : 1550476186479,
    "blocks" : [{
        data:{
            text:'Document Name',
            level:2
        },
        id:"123",
        type:'header'
    },
    {
        data:{
            level:4
        },
        id:"1234",
        type:'header'
    }],
    "version" : "2.8.1"
}
function Editor({  fileData, Loading, documentData, setDocumentData, ydoc, provider }: { ydoc: Y.Doc, provider: any, Loading: boolean, fileData: FILE,  documentData: any, setDocumentData: (data: any) => void }) {

    const ref=useRef<EditorJS>();
    const [document,setDocument]=useState(rawDocument);

    useEffect(()=>{
      fileData&&initEditor();
    },[fileData])
    
    const initEditor=()=>{
        const editor = new EditorJS({
            tools:{
                header: {
                  // @ts-ignore
                  class: Header,
                  shortcut: 'CMD+SHIFT+H',
                    config:{
                        placeholder:'Enter a Header'
                    }
                  },
                  list: {
                    // @ts-ignore
                    class: List,
                    inlineToolbar: true,
                    config: {
                      defaultStyle: 'unordered'
                    }
                  },
                  checklist: {
                    class: Checklist,
                    inlineToolbar: true,
                  },
                  linkTool: {
                    class: LinkTool,
                    config: {
                      endpoint: 'http://localhost:8008/fetchUrl', // Your backend endpoint for url data fetching,
                    }
                  },                  
                  paragraph: Paragraph,
                  raw: RawTool,
                  embed: Embed,
                  image: {
                    class: SimpleImage,
                    inlineToolbar: true
                  },
                  quote: Quote,
                  table: Table,
                  warning: Warning,
            },
           
            holder: 'editorjs',
            data: fileData?.document?JSON.parse(fileData?.document):document ,
            onChange: () => {
              if (ref.current) {
                ref.current.save().then((outputData) => {
                  setDocumentData(outputData);
                }).catch((error) => {
                  console.log('Saving failed: ', error)
                });
              }
            }            
          });
          ref.current=editor;
          const yText = ydoc.getText('editor');
          yText.observe(event => {
            const content = yText.toString();
            editor.render(JSON.parse(content));
          });

          editor.isReady.then(() => {
            editor.save().then((outputData) => {
              yText.insert(0, JSON.stringify(outputData));
            });
          });

          provider.on('status', (event:any) => {
            console.log(event.status); // logs "connected" or "disconnected"
          });          
    }

  return (
    <div>
        <div id='editorjs' className='ml-20'></div>
    </div>
  )
}

export default Editor