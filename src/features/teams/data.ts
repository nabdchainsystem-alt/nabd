import { TeamMember, TeamRole, TeamStatus } from './types';

export const MOCK_MEMBERS: TeamMember[] = [
    {
        id: '1',
        name: 'Mohamed Ali',
        email: 'mohamed.ali@example.com',
        role: TeamRole.ADMIN,
        status: TeamStatus.ACTIVE,
        initials: 'MA',
        department: 'Management',
        lastActive: 'Just now',
        location: 'Cairo, EG',
        color: 'bg-purple-500',
        showUserIcon: true
    }
];
