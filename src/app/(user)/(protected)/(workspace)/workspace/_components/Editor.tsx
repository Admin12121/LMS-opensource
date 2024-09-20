"use client"
import React, { useEffect, useRef, useState } from 'react'
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
function Editor({ setLocalChanges, Loading, documentData, setDocumentData }: { setLocalChanges: (data: boolean) => void, Loading: boolean, documentData: any, setDocumentData: (data: any) => void }) {

    const ref=useRef<EditorJS>();
    const [document,setDocument]=useState(rawDocument);

    useEffect(()=>{
      documentData&&initEditor();
    },[documentData])
    
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
                  image: SimpleImage,
                  quote: Quote,
                  table: Table,
                  warning: Warning,
            },
            autofocus: true,
            holder: 'editorjs',
            data:  documentData ? JSON.parse(documentData) : document ,
            
            onChange: () => {
              if (ref.current) {
                ref.current.save().then((outputData) => {
                  setDocumentData(JSON.stringify(outputData));
                  setLocalChanges(true); // Mark local changes
                  console.log(outputData)
                }).catch((error) => {
                  console.log('Saving failed: ', error)
                });
              }
            }           
          });
          ref.current=editor;
    }

  return (
    <div>
        <div id='editorjs' className='ml-20'></div>
    </div>
  )
}

export default Editor