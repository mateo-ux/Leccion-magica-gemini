export const mockData = {
    stats: [
        { label: 'Docentes Impactados', value: 500000, symbol: '+' },
        { label: 'Estudiantes Beneficiados', value: 2500000, symbol: '+' },
        { label: 'Departamentos', value: 32, symbol: '/32' },
    ],
    features: [
        {
            title: 'Planeación Inteligente',
            description: 'Ahorra hasta 10 horas semanales automatizando la creación de planes de clase alineados con el MEN.'
        },
        {
            title: 'Tutoría Personalizada',
            description: 'Ofrece a cada estudiante un tutor IA 24/7 que se adapta a su ritmo y estilo de aprendizaje.'
        },
        {
            title: 'Escalabilidad Nacional',
            description: 'Diseñado para crecer desde el Eje Cafetero y cubrir las necesidades de toda Colombia.'
        },
    ],
    teacher: {
        clases: [
            {
                id: 1,
                title: 'Introducción al Álgebra',
                subject: 'Matemáticas',
                grade: '9°',
                time: '8:00 AM',
                color: 'bg-sky-100 dark:bg-sky-900/50'
            },
            {
                id: 2,
                title: 'Realismo Mágico',
                subject: 'Literatura',
                grade: '11°',
                time: '10:00 AM',
                color: 'bg-amber-100 dark:bg-amber-900/50'
            },
            {
                id: 3,
                title: 'Ciclo del Agua',
                subject: 'Ciencias',
                grade: '6°',
                time: '1:00 PM',
                color: 'bg-teal-100 dark:bg-teal-900/50'
            },
        ],
        recursos: [
            { title: 'Guía de Estándares Básicos', subject: 'Todos', type: 'PDF' },
            { title: 'Video: Volcanes de Colombia', subject: 'Sociales', type: 'Video' },
            { title: 'Simulación: Fotosíntesis', subject: 'Ciencias', type: 'Interactivo' },
        ]
    },
    student: {
        modules: [
            { title: 'Fracciones 101', subject: 'Matemáticas', progress: 75, icon: '➗' },
            { title: 'El Cuento y sus Partes', subject: 'Lenguaje', progress: 40, icon: '📖' },
            { title: 'Ecosistemas de Colombia', subject: 'Ciencias', progress: 90, icon: '🏞️' },
        ],
        achievements: [
            { title: 'Mente Maestra', description: 'Completa 10 módulos', icon: '🏆' },
            { title: 'Explorador Curioso', description: 'Usa el tutor por 5 horas', icon: '🧭' },
            { title: 'Colaborador Estrella', description: 'Comparte un recurso', icon: '⭐' },
        ]
    }
};