// Interfaces de Datos
// Estas interfaces definen la estructura de los datos que eventualmente vendrán del Backend en Django

export interface Stat {
    label: string;
    value: number;
    symbol: string;
}

export interface Feature {
    title: string;
    description: string;
}

export interface TeacherClass {
    id: number;
    title: string;
    subject: string;
    grade: string;
    time: string;
    color: string;
}

export interface Resource {
    title: string;
    subject: string;
    type: string;
}

export interface StudentModule {
    title: string;
    subject: string;
    progress: number;
    icon: string;
}

export interface Achievement {
    title: string;
    description: string;
    icon: string;
}

// Almacén de Datos Vacío
// TODO: Conectar con la API del Backend
export const mockData = {
    stats: [] as Stat[],
    features: [] as Feature[],
    teacher: {
        clases: [] as TeacherClass[],
        recursos: [] as Resource[]
    },
    student: {
        modules: [] as StudentModule[],
        achievements: [] as Achievement[]
    }
};