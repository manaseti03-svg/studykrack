'use client';

import { useState } from 'react';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

type Task = {
  id: string;
  title: string;
  category: string;
  completed: boolean;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      category,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTitle('');
    setCategory('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Task Management</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Task</h2>
        <form onSubmit={addTask} className="flex gap-4">
          <input 
            type="text" 
            placeholder="Task Title" 
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Category (e.g. Math, Coding)" 
            className="w-48 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
          <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No tasks added yet. Start by adding one above!</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {tasks.map(task => (
              <li key={task.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition">
                <button onClick={() => toggleTask(task.id)} className={`text-${task.completed ? 'emerald-500' : 'slate-300'} hover:text-emerald-600`}>
                  {task.completed ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </button>
                <div className="flex-1">
                  <p className={`font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</p>
                  {task.category && <span className="text-xs font-semibold px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md mt-1 inline-block">{task.category}</span>}
                </div>
                <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-red-500 transition p-2">
                  <Trash2 className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
