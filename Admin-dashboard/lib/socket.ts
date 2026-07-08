import { io, Socket } from 'socket.io-client';

class SocketClient {
    private static instance: SocketClient;
    private socket: Socket | null = null;

    private constructor() {
        this.socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
            withCredentials: true,
            transports: ['websocket'],
        });

        this.socket.on('connect', () => {
            console.log('Connected to socket server:', this.socket?.id);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        this.socket.on('notification', (data) => {
            console.log('Received notification:', data);
        });
    }

    public static getInstance(): SocketClient {
        if (!SocketClient.instance) {
            SocketClient.instance = new SocketClient();
        }
        return SocketClient.instance;
    }

    public getSocket(): Socket {
        if (!this.socket) {
            throw new Error('Socket is not initialized');
        }
        return this.socket;
    }

    public registerUser(userId: string) {
        if (this.socket) {
            this.socket.emit('register', userId);
            console.log(`Registered user with ID: ${userId}`);
        }
    }
}

export default SocketClient;
