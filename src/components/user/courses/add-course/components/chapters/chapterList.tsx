"use client"
import React, { useState, useEffect } from 'react'
import { Chapter } from './chapterForm';
import { DragDropContext, Droppable, Draggable , DropResult } from '@hello-pangea/dnd';
import {cn} from "@/lib/utils"
import { Grip } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LuPencilLine } from "react-icons/lu";

interface ChapterListProps {
  items: Chapter[];
  isFree: boolean;
  onEdit: (chapterslug: string) => void;
  onReorder: (updateData: {id: number, position: number}[]) => void;
}

const ChapterList = ({items, isFree, onEdit, onReorder}: ChapterListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [chapters, setChapters] = useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
    
        const items = Array.from(chapters);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
    
        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);
        const updateChapters = items.slice(startIndex, endIndex + 1);

        setChapters(items);

        const bulkUpdateData = updateChapters.map((chapter) => ({
            id: chapter.id,
            position: items.findIndex(item => item.id === chapter.id)
        }));

        onReorder(bulkUpdateData);
      };

    useEffect(() => {
        setChapters(items);
    }, [items]);

    if(!isMounted) return null;
  return (
    <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="chapters">
            {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                    {chapters.map((chapter, index) => (
                        <Draggable key={chapter.id} draggableId={chapter.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            className={cn(
                              "flex items-center gap-x-2 light:bg-slate-200 dark:bg-zinc-800 light:border-slate-200 dark:border-zinc-800 light:text-slate-700 dark:text-neutral-200 rounded-md mb-1 text-sm",
                              chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
                            )}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={provided.draggableProps.style as React.CSSProperties} // Casting to CSSProperties
                          >
                            <div
                              className={cn(
                                "px-2 py-2 border-r light:border-r-slate-200 dark:border-r-neutral-800 light:hover:bg-slate-300 dark:hover:bg-zinc-700 rounded-l-md transition",
                                chapter.isPublished && "border-r-sky-200 light:hover:bg-sky-200 dark:hover:bg-neutral-800"
                              )}
                            >
                              <Grip className="h-5 w-5" />
                            </div>
                            {chapter.title}
                            <div className="ml-auto pr-2 flex items-center gap-x-2">
                              {chapter.isFree ? <Badge>Free</Badge> : isFree && <Badge>Free</Badge>}
                              <Badge
                                className={cn(
                                  "bg-slate-500",
                                  chapter.isPublished && "bg-sky-700 text-zinc-300"
                                )}
                              >
                                {chapter.isPublished ? "Published" : "Draft"}
                              </Badge>
                              <LuPencilLine
                                className="h-4 w-4 cursor-pointer hover:opacity-70 transition"
                                onClick={() => onEdit(chapter.chapterslug)}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>                      
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </DragDropContext>
  )
}

export default ChapterList