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
function Editor({onSaveTrigger,fileId,fileData}:{onSaveTrigger?:any,fileId:any,fileData:FILE}) {
    const ref=useRef<EditorJS>();
    const [document,setDocument]=useState(rawDocument);
    const [isEditorReady,setIsEditorReady]=useState(true);

    useEffect(()=>{
        if(isEditorReady && document){
            initEditor();
            setIsEditorReady(false);
        }
    },[document])


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
                  paragraph: Paragraph,
                  warning: Warning,
            },
           
            holder: 'editorjs',
            data: document
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