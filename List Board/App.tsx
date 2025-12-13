import React, { useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { GroupContainer } from './components/GroupContainer';
import { TaskRow } from './components/TaskRow';
import { GroupData, Status, TaskItem, ColumnWidths } from './types';

const App: React.FC = () => {
  const [groups, setGroups] = useState<GroupData[]>([
    {
      id: 'g1',
      title: 'Group Title',
      color: '#579bfc', // Monday blue
      items: [
        {
          id: '1',
          name: 'need to define',
          person: null,
          status: Status.WORKING_ON_IT,
          date: '',
          selected: false
        },
        {
          id: '2',
          name: 'max 1',
          person: null,
          status: Status.WORKING_ON_IT,
          date: '',
          selected: false
        }
      ]
    }
  ]);

  const [colWidths, setColWidths] = useState<ColumnWidths>({
    person: 100,
    status: 150,
    date: 130
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<TaskItem | null>(null);
  const [activeGroupColor, setActiveGroupColor] = useState<string>('#ccc');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findGroup = (id: string): GroupData | undefined => {
    return groups.find(g => g.items.find(i => i.id === id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = active.id as string;
    setActiveId(id);
    
    const group = findGroup(id);
    if (group) {
      const item = group.items.find(i => i.id === id);
      if (item) {
        setActiveItem(item);
        setActiveGroupColor(group.color);
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const overId = over?.id;

    if (!overId || active.id === overId) return;

    const activeContainer = findGroup(active.id as string);
    const overContainer = findGroup(overId as string); 
    
    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setGroups((prev) => {
      const activeGroupIndex = prev.findIndex(g => g.id === activeContainer.id);
      const overGroupIndex = prev.findIndex(g => g.id === overContainer.id);
      
      const newGroups = [...prev];
      const activeItems = [...newGroups[activeGroupIndex].items];
      const overItems = [...newGroups[overGroupIndex].items];
      
      const activeIndex = activeItems.findIndex(i => i.id === active.id);
      const overIndex = overItems.findIndex(i => i.id === overId);

      let newIndex;
      if (overIndex >= 0) {
        newIndex = overIndex + (active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height ? 1 : 0);
      } else {
        newIndex = overItems.length + 1;
      }

      const [movedItem] = activeItems.splice(activeIndex, 1);
      overItems.splice(newIndex, 0, movedItem);

      newGroups[activeGroupIndex] = { ...newGroups[activeGroupIndex], items: activeItems };
      newGroups[overGroupIndex] = { ...newGroups[overGroupIndex], items: overItems };

      return newGroups;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeContainer = findGroup(active.id as string);
    const overContainer = over ? findGroup(over.id as string) : null;

    if (
      activeContainer &&
      overContainer &&
      activeContainer === overContainer
    ) {
      const activeIndex = activeContainer.items.findIndex((i) => i.id === active.id);
      const overIndex = activeContainer.items.findIndex((i) => i.id === over?.id);

      if (activeIndex !== overIndex) {
        setGroups((prev) => {
            const groupIndex = prev.findIndex(g => g.id === activeContainer.id);
            const newGroups = [...prev];
            newGroups[groupIndex] = {
                ...newGroups[groupIndex],
                items: arrayMove(newGroups[groupIndex].items, activeIndex, overIndex)
            };
            return newGroups;
        });
      }
    }

    setActiveId(null);
    setActiveItem(null);
  };

  const handleGroupUpdate = (updatedGroup: GroupData) => {
    setGroups(groups.map(g => g.id === updatedGroup.id ? updatedGroup : g));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen w-full bg-white text-gray-800 font-sans overflow-hidden">
        {/* Main Content */}
        <div className="flex-grow flex flex-col h-full overflow-hidden relative">
          
          {/* Scrollable Content */}
          <div className="flex-grow overflow-y-auto p-8 bg-white">
             {groups.map(group => (
                <GroupContainer 
                    key={group.id} 
                    group={group} 
                    colWidths={colWidths}
                    onColResize={setColWidths}
                    onGroupUpdate={handleGroupUpdate}
                />
             ))}
             
             <button 
               className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors mt-4"
               onClick={() => {
                  const newGroup: GroupData = {
                    id: Math.random().toString(),
                    title: 'New Group',
                    color: '#00c875', // Green
                    items: []
                  };
                  setGroups([...groups, newGroup]);
               }}
             >
                <div className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center">+</div>
                Add new group
             </button>
          </div>
        </div>
        
        {/* Drag Overlay */}
        <DragOverlay>
            {activeItem ? (
                <TaskRow 
                    item={activeItem} 
                    groupColor={activeGroupColor} 
                    colWidths={colWidths}
                    onUpdate={() => {}} 
                    onDelete={() => {}} 
                    isOverlay
                />
            ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default App;