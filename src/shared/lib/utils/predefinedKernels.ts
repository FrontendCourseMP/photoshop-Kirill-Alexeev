export interface Kernel {
    name: string;
    matrix: number[][];
    divisor?: number;
}

export const predefinedKernels: Kernel[] = [
    {
        name: 'Тождественное отображение',
        matrix: [
            [0, 0, 0],
            [0, 1, 0],
            [0, 0, 0],
        ],
    },
    {
        name: 'Повышение резкости',
        matrix: [
            [0, -1, 0],
            [-1, 5, -1],
            [0, -1, 0],
        ],
    },
    {
        name: 'Фильтр Гаусса (3x3)',
        matrix: [
            [1, 2, 1],
            [2, 4, 2],
            [1, 2, 1],
        ],
        divisor: 16,
    },
    {
        name: 'Прямоугольное размытие',
        matrix: [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ],
        divisor: 9,
    },
    {
        name: 'Прюитт X (горизонтальный)',
        matrix: [
            [-1, 0, 1],
            [-1, 0, 1],
            [-1, 0, 1],
        ],
    },
    {
        name: 'Прюитт Y (вертикальный)',
        matrix: [
            [-1, -1, -1],
            [0, 0, 0],
            [1, 1, 1],
        ],
    },
];