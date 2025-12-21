import React from 'react';
import { BoardView } from '../features/board/BoardView';
import { Board } from '../types';

const INITIAL_BOARD: Board = {
    id: 'placeholder-board',
    name: 'Placeholder',
    columns: [
        { id: 'c1', title: 'Item', type: 'text' },
        { id: 'c2', title: 'Status', type: 'status' }
    ],
    tasks: [],
    availableViews: ['table'],
    defaultView: 'table'
};

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
    const [board, setBoard] = React.useState<Board>({ ...INITIAL_BOARD, name: title, id: title.toLowerCase().replace(/\s/g, '-') });

    const handleUpdateBoard = (id: string, updates: Partial<Board>) => {
        setBoard(prev => ({ ...prev, ...updates }));
    };

    return (
        <BoardView
            board={board}
            onUpdateBoard={handleUpdateBoard}
        />
    );
};

export default PlaceholderPage;
