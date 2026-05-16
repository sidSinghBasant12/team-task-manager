'use client';
import React, { useState, useEffect } from 'react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Plus, Clock, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

// --- Types ---
type Task = { id: string; title: string; priority: string; status: string; dueDate?: string };
type Column = { id: string; title: string; tasks: Task[] };

// --- Sortable Item Component ---
function SortableTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`p-4 mb-3 rounded-xl bg-white/[0.05] border border-white/10 hover:border-indigo-500/50 transition-colors cursor-grab active:cursor-grabbing backdrop-blur-sm ${isDragging ? 'shadow-2xl shadow-indigo-500/20' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${
          task.priority === 'HIGH' || task.priority === 'URGENT' ? 'bg-red-500/20 text-red-400' :
          task.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
          'bg-emerald-500/20 text-emerald-400'
        }`}>
          {task.priority}
        </span>
        <button className="text-gray-500 hover:text-white transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>
      <h4 className="text-sm font-medium text-white mb-3">{task.title}</h4>
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10 text-gray-400 text-xs">
        <div className="flex -space-x-1.5">
          <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-[#1A1A1A] flex items-center justify-center text-[8px] font-bold">U</div>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={12} />
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
        </div>
      </div>
    </div>
  );
}

// --- Main Board Component ---
export default function KanbanBoard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [columns, setColumns] = useState<Column[]>([
    { id: 'TODO', title: 'To Do', tasks: [] },
    { id: 'IN_PROGRESS', title: 'In Progress', tasks: [] },
    { id: 'TESTING', title: 'Testing', tasks: [] },
    { id: 'COMPLETED', title: 'Done', tasks: [] },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      const allTasks = response.data;
      
      const newCols = columns.map(col => ({
        ...col,
        tasks: allTasks.filter((t: any) => t.status === col.id)
      }));
      setColumns(newCols);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Find which column it dropped into
    let targetColId = '';
    if (['TODO', 'IN_PROGRESS', 'TESTING', 'COMPLETED'].includes(overId)) {
      targetColId = overId;
    } else {
      // It dropped over another task, find that task's column
      columns.forEach(col => {
        if (col.tasks.some(t => t.id === overId)) targetColId = col.id;
      });
    }

    if (!targetColId) return;

    // Update locally first for snappy UI
    const sourceCol = columns.find(col => col.tasks.some(t => t.id === taskId))!;
    if (sourceCol.id === targetColId) {
      // Reorder in same column
      const oldIndex = sourceCol.tasks.findIndex(t => t.id === taskId);
      const newIndex = columns.find(col => col.id === targetColId)!.tasks.findIndex(t => t.id === overId);
      if (oldIndex !== newIndex) {
        const newTasks = arrayMove(sourceCol.tasks, oldIndex, newIndex);
        setColumns(columns.map(col => col.id === sourceCol.id ? { ...col, tasks: newTasks } : col));
      }
    } else {
      // Move to different column
      const task = sourceCol.tasks.find(t => t.id === taskId)!;
      setColumns(columns.map(col => {
        if (col.id === sourceCol.id) return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
        if (col.id === targetColId) return { ...col, tasks: [...col.tasks, { ...task, status: targetColId }] };
        return col;
      }));

      // Update backend
      try {
        await api.patch(`/tasks/${taskId}/status`, { status: targetColId });
      } catch (err) {
        console.error('Failed to update task status', err);
        fetchTasks(); // Revert on failure
      }
    }
  };

  return (
    <div className="p-8 h-full flex flex-col font-sans bg-[#0A0A0A]">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Kanban Board
          </h1>
          <p className="text-gray-400 mt-1">
            {user?.role === 'ADMIN' ? 'Manage team workflow.' : 'Your assigned tasks workflow.'}
          </p>
        </div>
        {user?.role === 'ADMIN' && (
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all font-medium text-sm flex items-center gap-2">
            <Plus size={18} /> Add Task
          </button>
        )}
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-500 gap-2">
            <Loader2 className="animate-spin" /> Loading Board...
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="flex gap-6 h-full items-start">
              {columns.map(col => (
                <div key={col.id} className="w-80 shrink-0 flex flex-col h-[calc(100vh-180px)] bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.01]">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      {col.title}
                      <span className="bg-white/10 text-gray-300 text-xs px-2 py-0.5 rounded-full">{col.tasks.length}</span>
                    </h3>
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                  
                  <div className="p-3 flex-1 overflow-y-auto" id={col.id}>
                    <SortableContext items={col.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                      {col.tasks.map(task => (
                        <SortableTask key={task.id} task={task} />
                      ))}
                    </SortableContext>
                  </div>
                </div>
              ))}
            </div>
          </DndContext>
        )}
      </div>
    </div>
  );
}
