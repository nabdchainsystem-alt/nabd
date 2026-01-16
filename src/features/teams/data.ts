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
        color: 'bg-purple-500'
    },
    {
        id: '2',
        name: 'Hasan Ali',
        email: 'hasan.ali@example.com',
        role: TeamRole.MEMBER,
        status: TeamStatus.ACTIVE,
        initials: 'HA',
        department: 'Engineering',
        lastActive: '5 mins ago',
        location: 'Dubai, UAE',
        color: 'bg-blue-500'
    },
    {
        id: '3',
        name: 'Mohamed Elkhateb',
        email: 'mohamed.elkhateb@example.com',
        role: TeamRole.MEMBER,
        status: TeamStatus.ACTIVE,
        initials: 'ME',
        department: 'Product',
        lastActive: '1 hour ago',
        location: 'Cairo, EG',
        color: 'bg-green-500'
    },
    {
        id: '4',
        name: 'Mohamed Fathy',
        email: 'mohamed.fathy@example.com',
        role: TeamRole.MEMBER,
        status: TeamStatus.AWAY,
        initials: 'MF',
        department: 'Operations',
        lastActive: '2 days ago',
        location: 'Riyadh, SA',
        color: 'bg-yellow-500'
    },
    {
        id: '5',
        name: 'Magdy',
        email: 'magdy@example.com',
        role: TeamRole.MEMBER,
        status: TeamStatus.ACTIVE,
        initials: 'MG',
        department: 'Sales',
        lastActive: '30 mins ago',
        location: 'Alexandria, EG',
        color: 'bg-pink-500'
    },
    {
        id: '6',
        name: 'Mustafa Selim',
        email: 'mustafa.selim@example.com',
        role: TeamRole.GUEST,
        status: TeamStatus.INVITED,
        initials: 'MS',
        department: 'Marketing',
        lastActive: '-',
        location: 'Remote',
        color: 'bg-indigo-500'
    },
    {
        id: '7',
        name: 'Adel Swaeyh',
        email: 'adel.swaeyh@example.com',
        role: TeamRole.MEMBER,
        status: TeamStatus.ACTIVE,
        initials: 'AS',
        department: 'IT',
        lastActive: '10 mins ago',
        location: 'Cairo, EG',
        color: 'bg-orange-500'
    }
];
